// Turns Astra's product photos (seed/images/) into web-ready WebP files and a manifest.
//
//   pnpm images
//
// Input:  seed/images/products/*.png, plus approved style tests in seed/images/_test/*.png
//         Names: <slug>.png · <slug>--<option key>.png · <slug>--detail.png · <slug>--in-use.png
// Output: apps/web/public/seed/products/<name>.webp (max 1200px, committed: small)
//         seed/data/product-images.json (which image belongs to which product/option)
// The large PNG originals stay local (see .gitignore).
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const webRequire = createRequire(join(root, "apps/web/package.json"));
const sharp = createRequire(webRequire.resolve("next/package.json"))("sharp");

const products = JSON.parse(readFileSync(join(root, "seed/data/products.json"), "utf8"));
const bySlug = new Map(products.map((p) => [p.slug, p]));
const sourceDirs = ["seed/images/_test", "seed/images/products"]; // later dirs win
const outDir = join(root, "apps/web/public/seed/products");
const GALLERY = new Set(["detail", "in-use"]);

const sources = new Map();
for (const dir of sourceDirs) {
  const abs = join(root, dir);
  if (!existsSync(abs)) continue;
  for (const file of readdirSync(abs).filter((f) => f.toLowerCase().endsWith(".png"))) {
    sources.set(basename(file, ".png"), join(abs, file));
  }
}

const manifest = {};
const skipped = [];
for (const [name] of sources) {
  const [slug, suffix] = name.split("--");
  const product = bySlug.get(slug);
  if (!product) { skipped.push(`${name} (no product "${slug}")`); continue; }
  const entry = (manifest[slug] ??= {});
  const url = `/seed/products/${name}.webp`;
  if (!suffix) entry.main = url;
  else if (GALLERY.has(suffix)) (entry.gallery ??= []).push(url);
  else if (product.options?.values.some((o) => o.key === suffix)) (entry.options ??= {})[suffix] = url;
  else { skipped.push(`${name} (unknown option "${suffix}")`); delete manifest[slug]?.[suffix]; }
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
let bytes = 0;
for (const [name, src] of sources) {
  const [slug] = name.split("--");
  if (!bySlug.has(slug)) continue;
  const out = join(outDir, `${name}.webp`);
  const info = await sharp(src).resize(1200, 1200, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90 }).toFile(out);
  bytes += info.size;
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(join(root, "seed/data/product-images.json"), JSON.stringify({ products: sorted }, null, 2) + "\n");

console.log(`Synced ${sources.size - skipped.length} images for ${Object.keys(sorted).length} products (${Math.round(bytes / 1024)} KB total).`);
if (skipped.length) console.log(`Skipped:\n  ${skipped.join("\n  ")}`);
