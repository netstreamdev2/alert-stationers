import { categories, products, schoolLists } from "./seed";
import type { Category, CategorySlug, Product, ProductOption, SchoolList, StockState } from "./types";

/** At or below this many units, a product shows as low stock. */
export const LOW_STOCK_THRESHOLD = 5;

export function getCategory(slug: CategorySlug): Category {
  const category = categories.find((c) => c.slug === slug);
  if (!category) throw new Error(`Unknown category: ${slug}`);
  return category;
}

export function getProduct(slug: string): Product {
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  return product;
}

export function getProducts(slugs: readonly string[]): Product[] {
  return slugs.map(getProduct);
}

export function productsInCategory(slug: CategorySlug): Product[] {
  return products.filter((p) => p.category === slug);
}

export function getSchoolList(slug: string): SchoolList {
  const list = schoolLists.find((l) => l.slug === slug);
  if (!list) throw new Error(`Unknown school list: ${slug}`);
  return list;
}

export function totalStock(product: Product): number {
  if (product.options) return product.options.values.reduce((sum, o) => sum + o.stock, 0);
  return product.stock ?? 0;
}

export function stockState(product: Product): StockState {
  const units = totalStock(product);
  if (units <= 0) return "out";
  if (units <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
}

export function getOption(product: Product, key: string): ProductOption {
  const option = product.options?.values.find((o) => o.key === key);
  if (!option) throw new Error(`Unknown option "${key}" for ${product.slug}`);
  return option;
}

/** Price a shopper pays for one unit right now (special first, then option, then base). */
export function unitPriceCents(product: Product, optionKey?: string): number {
  if (product.special) return product.special.priceCents;
  if (optionKey) return getOption(product, optionKey).priceCents ?? product.priceCents;
  return product.priceCents;
}

/** Lowest and highest unit price across options (equal when there's a single price). */
export function priceRangeCents(product: Product): { min: number; max: number } {
  if (product.special) return { min: product.special.priceCents, max: product.special.priceCents };
  const prices = product.options?.values.map((o) => o.priceCents ?? product.priceCents) ?? [product.priceCents];
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function schoolListTotalCents(list: SchoolList): number {
  return list.items.reduce((sum, item) => sum + unitPriceCents(getProduct(item.product), item.option) * item.qty, 0);
}

export function schoolListUnitCount(list: SchoolList): number {
  return list.items.reduce((sum, item) => sum + item.qty, 0);
}

export function specials(): Product[] {
  return products.filter((p) => p.special);
}
