import { describe, expect, it } from "vitest";
import { stockMovements } from "../src/catalogue/inventory";
import { getProduct, getSchoolList, schoolListTotalCents, totalStock } from "../src/catalogue/queries";
import { categories, products, schoolLists, suppliers } from "../src/catalogue/seed";

function isValidEan13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;
  const digits = [...code].map(Number);
  const sum = digits.slice(0, 12).reduce((total, digit, index) => total + digit * (index % 2 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === digits[12];
}

/** Current stock per stock-keeping unit (option SKUs for products with options). */
const stockBySku = new Map<string, number>();
for (const product of products) {
  if (product.options) for (const option of product.options.values) stockBySku.set(option.sku, option.stock);
  else stockBySku.set(product.sku, product.stock ?? 0);
}

describe("catalogue shape", () => {
  it("has 120 products, 20 per category, and no empty subcategory", () => {
    expect(products).toHaveLength(120);
    for (const category of categories) {
      const inCategory = products.filter((p) => p.category === category.slug);
      expect(inCategory, category.slug).toHaveLength(20);
      for (const sub of category.subcategories) {
        expect(inCategory.some((p) => p.subcategory === sub.slug), `${category.slug}/${sub.slug}`).toBe(true);
      }
    }
  });

  it("puts every product in a subcategory of its own category", () => {
    for (const product of products) {
      const category = categories.find((c) => c.slug === product.category);
      expect(category?.subcategories.some((s) => s.slug === product.subcategory), product.slug).toBe(true);
    }
  });

  it("has either stock or options on every product, never both", () => {
    for (const product of products) expect(product.stock === undefined, product.slug).toBe(product.options !== undefined);
  });
});

describe("identifiers", () => {
  it("keeps slugs, SKUs and barcodes unique", () => {
    const slugs = products.map((p) => p.slug);
    const skus = products.flatMap((p) => [p.sku, ...(p.options?.values.map((o) => o.sku) ?? [])]);
    const barcodes = products.flatMap((p) => [p.barcode, ...(p.options?.values.map((o) => o.barcode) ?? [])]);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(skus).size).toBe(skus.length);
    expect(new Set(barcodes).size).toBe(barcodes.length);
  });

  it("uses valid EAN-13 barcodes in the restricted 20–29 range", () => {
    for (const product of products) {
      for (const code of [product.barcode, ...(product.options?.values.map((o) => o.barcode) ?? [])]) {
        expect(isValidEan13(code) && code.startsWith("2"), `${product.slug}: ${code}`).toBe(true);
      }
    }
  });
});

describe("money", () => {
  it("prices specials and bulk tiers below the regular price, and cost below the ex-VAT price", () => {
    for (const product of products) {
      if (product.special) expect(product.special.priceCents, product.slug).toBeLessThan(product.priceCents);
      if (product.bulk) expect(product.bulk.priceCents, product.slug).toBeLessThan(product.priceCents);
      expect(product.costPriceCents, product.slug).toBeLessThan(product.priceCents / 1.15);
    }
  });
});

describe("references", () => {
  it("links every product to a real supplier", () => {
    for (const product of products) expect(suppliers.some((s) => s.slug === product.supplier), product.slug).toBe(true);
  });

  it("links every school-list item to a real product and option", () => {
    for (const list of schoolLists) {
      for (const item of list.items) {
        const product = getProduct(item.product);
        if (product.options) expect(product.options.values.some((o) => o.key === item.option), `${list.slug}: ${item.product}`).toBe(true);
        else expect(item.option, `${list.slug}: ${item.product}`).toBeUndefined();
      }
    }
  });
});

describe("stock history", () => {
  it("records movements only for real stock-keeping units", () => {
    for (const movement of stockMovements) expect(stockBySku.has(movement.sku), movement.id).toBe(true);
  });

  it("opens every SKU on 1 August, never goes negative, and ends at today's stock", () => {
    for (const [sku, stock] of stockBySku) {
      const history = stockMovements
        .filter((m) => m.sku === sku)
        .sort((a, b) => Date.parse(a.at) - Date.parse(b.at) || a.id.localeCompare(b.id));
      expect(history[0]?.type, sku).toBe("opening");
      expect(history[0]?.at.startsWith("2026-08-01"), sku).toBe(true);
      let balance = 0;
      for (const movement of history) {
        balance += movement.qty;
        expect(balance, `${sku} at ${movement.id}`).toBeGreaterThanOrEqual(0);
      }
      expect(balance, sku).toBe(stock);
    }
  });
});

describe("product images", () => {
  it("only points at synced files, and gives option products their first photographed option", () => {
    const withImage = products.filter((p) => p.image);
    for (const product of withImage) expect(product.image, product.slug).toMatch(/^\/seed\/products\/[a-z0-9-]+\.webp$/);
    const backpack = getProduct("backpack-25l");
    if (backpack.options?.values.some((o) => o.image)) {
      expect(backpack.image).toBe(backpack.options.values.find((o) => o.image)?.image);
    }
  });
});

describe("demo script scenarios (docs/POC-SEED-DATA.md)", () => {
  it("keeps the last-one, sold-out and low-stock products where the demo needs them", () => {
    expect(totalStock(getProduct("fountain-pen-steel"))).toBe(1);
    expect(totalStock(getProduct("whiteboard-markers-4"))).toBe(0);
    expect(totalStock(getProduct("fineliners-10"))).toBe(3);
    const backpack = getProduct("backpack-25l");
    expect(backpack.options?.values.find((o) => o.key === "pink")?.stock).toBe(2);
    const pencil = getProduct("mechanical-pencil-05");
    expect(pencil.options?.values.find((o) => o.key === "teal")?.stock).toBe(0);
  });

  it("keeps the countdown special and the Grade 4 list total", () => {
    expect(getProduct("planner-2027-a5").special).toEqual({ priceCents: 19999, endsAt: "2026-12-31T21:59:59.000Z" });
    expect(getProduct("highlighters-4").special).toBeUndefined();
    expect(schoolListTotalCents(getSchoolList("protea-heights-grade-4"))).toBe(70281);
  });
});
