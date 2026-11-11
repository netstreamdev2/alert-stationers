/**
 * Stock history (about 3,500 movements) and the admin's views of it. A separate entry
 * point (@alert/core/inventory) so storefront pages never bundle it.
 */
import { z } from "zod";
import movementsJson from "../../../../seed/data/stock-movements.json";
import { unitPriceCents } from "./pricing";
import { getProduct, totalStock } from "./queries";
import { products, suppliers } from "./seed";
import { stockMovementSchema, type Product, type StockMovement } from "./schema";

export const stockMovements = z.array(stockMovementSchema).parse(movementsJson);

export function movementsForSku(sku: string) {
  return stockMovements.filter((m) => m.sku === sku).sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}

/** Every stock-keeping unit: a product without options, or one option of a product. */
export interface Sku {
  sku: string;
  product: Product;
  option?: string;
  optionLabel?: string;
  stock: number;
  reorderPoint: number;
  reorderQty: number;
}

export const skus: Sku[] = products.flatMap((p) =>
  p.options
    ? p.options.values.map((o) => ({
        sku: o.sku,
        product: p,
        option: o.key,
        optionLabel: o.label,
        stock: o.stock,
        reorderPoint: o.reorderPoint ?? p.reorderPoint,
        reorderQty: o.reorderQty ?? p.reorderQty,
      }))
    : [{ sku: p.sku, product: p, stock: p.stock ?? 0, reorderPoint: p.reorderPoint, reorderQty: p.reorderQty }],
);
const bySku = new Map(skus.map((s) => [s.sku, s]));

/** The last day the demo history covers; dashboards measure back from here, not from "now". */
export const historyEndsAt = stockMovements.reduce((max, m) => (m.at > max ? m.at : max), "");

const DAY = 24 * 60 * 60 * 1000;
const saDay = (iso: string) => new Date(Date.parse(iso) + 2 * 60 * 60 * 1000).toISOString().slice(0, 10);

export interface DaySales {
  /** yyyy-mm-dd, SA time */
  day: string;
  units: number;
  /** Estimated at today's prices: the history records quantities, not prices. */
  revenueCents: number;
}

export function salesByDay(days: number): DaySales[] {
  const end = Date.parse(historyEndsAt);
  const keys = Array.from({ length: days }, (_, i) => saDay(new Date(end - (days - 1 - i) * DAY).toISOString()));
  const totals = new Map(keys.map((k) => [k, { units: 0, revenueCents: 0 }]));
  for (const m of stockMovements) {
    if (m.type !== "sale" && m.type !== "return") continue;
    const day = totals.get(saDay(m.at));
    const sku = bySku.get(m.sku);
    if (!day || !sku) continue;
    const units = -m.qty;
    day.units += units;
    day.revenueCents += units * unitPriceCents(sku.product, sku.option);
  }
  return keys.map((day) => ({ day, ...(totals.get(day) ?? { units: 0, revenueCents: 0 }) }));
}

export interface InventorySummary {
  products: number;
  skus: number;
  unitsOnHand: number;
  /** On-hand stock valued at cost (ex VAT). */
  stockValueCents: number;
  lowStock: number;
  soldOut: number;
  needsReorder: number;
}

export function inventorySummary(): InventorySummary {
  let unitsOnHand = 0;
  let stockValueCents = 0;
  for (const s of skus) {
    unitsOnHand += s.stock;
    const option = s.option ? s.product.options?.values.find((o) => o.key === s.option) : undefined;
    stockValueCents += s.stock * (option?.costPriceCents ?? s.product.costPriceCents);
  }
  return {
    products: products.length,
    skus: skus.length,
    unitsOnHand,
    stockValueCents,
    lowStock: products.filter((p) => totalStock(p) > 0 && totalStock(p) <= 5).length,
    soldOut: products.filter((p) => totalStock(p) === 0).length,
    needsReorder: skus.filter((s) => s.stock <= s.reorderPoint).length,
  };
}

/** Stock-keeping units at or below their reorder point, emptiest first, with who supplies them. */
export function reorderList() {
  return skus
    .filter((s) => s.stock <= s.reorderPoint)
    .sort((a, b) => a.stock / Math.max(1, a.reorderPoint) - b.stock / Math.max(1, b.reorderPoint))
    .map((s) => ({ ...s, supplier: suppliers.find((x) => x.slug === s.product.supplier) }));
}

/** Margin on the regular price, as a share of the ex-VAT price. */
export function marginShare(p: Product): number {
  const exVat = p.priceCents / 1.15;
  return (exVat - p.costPriceCents) / exVat;
}

export interface MovementRow extends StockMovement {
  balance: number;
}

/** A SKU's movements with the running balance, newest first. */
export function historyForSku(sku: string): MovementRow[] {
  let balance = 0;
  return movementsForSku(sku)
    .map((m) => ({ ...m, balance: (balance += m.qty) }))
    .reverse();
}

export function skusForProduct(slug: string): Sku[] {
  const product = getProduct(slug);
  return skus.filter((s) => s.product.slug === product.slug);
}

export function supplierFor(p: Product) {
  return suppliers.find((s) => s.slug === p.supplier);
}
