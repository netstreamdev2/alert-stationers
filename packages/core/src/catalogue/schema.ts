/**
 * The catalogue's shape, defined once with Zod. Types are inferred from these schemas,
 * and the seed files are parsed through them at load, so bad data fails loudly instead
 * of rendering wrongly. Unknown keys (e.g. Astra's nested "demo" markers) are stripped.
 */
import { z } from "zod";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slug");
const cents = z.number().int().positive();
const count = z.number().int().nonnegative();
/** EAN-13 in GS1's restricted-circulation range (20–29), so it can never clash with a real product. */
const demoBarcode = z.string().regex(/^2\d{12}$/, "EAN-13 starting with 2");
const dimensions = z.object({ l: z.number().positive(), w: z.number().positive(), h: z.number().positive() });

export const categorySlugSchema = z.enum(["writing", "paper-books", "school", "art-craft", "office-filing", "gifts-planners"]);
export const productTagSchema = z.enum(["school-list", "bestseller", "new", "gift", "eco", "office-favourite"]);

export const categorySchema = z.object({
  slug: categorySlugSchema,
  name: z.string().min(1),
  blurb: z.string().min(1),
  subcategories: z.array(z.object({ slug, name: z.string().min(1) })).min(1),
});

export const productOptionSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  stock: count,
  sku: z.string().min(1),
  barcode: demoBarcode,
  swatch: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  /** Overrides the product price, e.g. for pack sizes. */
  priceCents: cents.optional(),
  costPriceCents: cents.optional(),
  weightGrams: z.number().int().positive().optional(),
  dimensionsMm: dimensions.optional(),
  reorderPoint: count.optional(),
  reorderQty: count.optional(),
  /** Public path to this option's photo (attached from product-images.json). */
  image: z.string().optional(),
});

export const productSchema = z.object({
  slug,
  sku: z.string().regex(/^AS-[A-Z]{3}-\d{4}$/),
  barcode: demoBarcode,
  name: z.string().min(1),
  brand: z.string().min(1),
  category: categorySlugSchema,
  subcategory: slug,
  description: z.string().min(1),
  specs: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })),
  /** Regular price in cents, VAT inclusive. */
  priceCents: cents,
  special: z.object({ priceCents: cents, endsAt: z.iso.datetime().optional() }).optional(),
  /** Supplier cost, excluding VAT. Server/admin only: never send to shoppers. */
  costPriceCents: cents,
  /** Stock for products without options. */
  stock: count.optional(),
  options: z.object({ kind: z.enum(["colour", "pack"]), values: z.array(productOptionSchema).min(1) }).optional(),
  /** Bulk tier: each unit costs `priceCents` when buying `minQty` or more. */
  bulk: z.object({ minQty: z.number().int().min(2), priceCents: cents }).optional(),
  reorderPoint: count,
  reorderQty: count,
  supplier: slug,
  binLocation: z.string().regex(/^A\d{2}-S\d-B\d$/),
  weightGrams: z.number().int().positive(),
  dimensionsMm: dimensions,
  tags: z.array(productTagSchema),
  imageNotes: z.string(),
  /** Public path to the main image. Absent until real or generated photos exist. */
  image: z.string().optional(),
  /** Extra photos (close-up, in use). */
  gallery: z.array(z.string()).optional(),
  /** Every seed record is demo data and gets wiped before launch. */
  demo: z.literal(true),
});

/** Written by `pnpm images` (scripts/sync-seed-images.mjs): which photo belongs to which product/option. */
export const productImagesSchema = z.object({
  products: z.record(
    z.string(),
    z.object({
      main: z.string().optional(),
      options: z.record(z.string(), z.string()).optional(),
      gallery: z.array(z.string()).optional(),
    }),
  ),
});

export const supplierSchema = z.object({
  slug,
  name: z.string().min(1),
  leadTimeDays: z.number().int().positive(),
  contactEmail: z.email(),
  categories: z.array(categorySlugSchema).min(1),
});

export const schoolListSchema = z.object({
  slug,
  school: z.string().endsWith("(Demo)"),
  grade: z.string().min(1),
  items: z.array(z.object({ product: slug, option: z.string().optional(), qty: z.number().int().positive() })).min(1),
});

export const stockMovementSchema = z.object({
  id: z.string().regex(/^MV-\d{6}$/),
  sku: z.string().min(1),
  type: z.enum(["opening", "receive", "sale", "return", "adjust", "stocktake"]),
  /** Signed: positive in, negative out. */
  qty: z.number().int(),
  at: z.iso.datetime(),
  reference: z.string().min(1),
  supplier: slug.optional(),
  orderedAt: z.iso.datetime().optional(),
});

export type CategorySlug = z.infer<typeof categorySlugSchema>;
export type ProductTag = z.infer<typeof productTagSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ProductOption = z.infer<typeof productOptionSchema>;
export type Product = z.infer<typeof productSchema>;
export type Special = NonNullable<Product["special"]>;
export type Supplier = z.infer<typeof supplierSchema>;
export type SchoolList = z.infer<typeof schoolListSchema>;
export type SchoolListItem = SchoolList["items"][number];
export type StockMovement = z.infer<typeof stockMovementSchema>;
export type ProductImages = z.infer<typeof productImagesSchema>;
export type StockState = "in" | "low" | "out";
