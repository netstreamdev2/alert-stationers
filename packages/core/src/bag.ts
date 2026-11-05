/**
 * Bag rules shared by every app. The stored bag holds only what the shopper chose
 * (product, option, quantity); prices, stock limits and totals are always worked out
 * here, on the server side, from the catalogue.
 */
import { z } from "zod";
import { availableUnits, getOption, unitPriceCents } from "./catalogue/queries";
import { products } from "./catalogue/seed";
import type { Product } from "./catalogue/schema";

export const MAX_LINE_QTY = 99;
export const MAX_BAG_LINES = 60;

export const bagLineSchema = z.object({
  slug: z.string().min(1).max(80),
  option: z.string().min(1).max(40).optional(),
  qty: z.number().int().min(1).max(MAX_LINE_QTY),
});
export const bagSchema = z.array(bagLineSchema).max(MAX_BAG_LINES);
export type BagLine = z.infer<typeof bagLineSchema>;

export function lineKey(slug: string, option?: string): string {
  return option ? `${slug}--${option}` : slug;
}

export interface PricedLine {
  key: string;
  slug: string;
  option?: string;
  optionLabel?: string;
  name: string;
  brand: string;
  category: Product["category"];
  image?: string;
  qty: number;
  /** Most the shopper can have of this line right now. */
  maxQty: number;
  unitPriceCents: number;
  /** What the unit would cost without a bulk tier, to show the saving. */
  regularUnitPriceCents: number;
  lineTotalCents: number;
  bulkApplied: boolean;
}

export interface PricedBag {
  lines: PricedLine[];
  /** Total units across all lines. */
  count: number;
  subtotalCents: number;
}

/** Why a requested line can't go in the bag, or null if it can. */
export function lineProblem(line: { slug: string; option?: string | undefined }): string | null {
  const product = products.find((p) => p.slug === line.slug);
  if (!product) return "That product doesn't exist.";
  if (product.options && !line.option) return "Choose an option first.";
  if (!product.options && line.option) return "That product has no options.";
  if (line.option && !product.options?.values.some((o) => o.key === line.option)) return "That option doesn't exist.";
  if (availableUnits(product, line.option) <= 0) return "Sold out.";
  return null;
}

/**
 * Prices a stored bag against the live catalogue. Lines for unknown or sold-out items
 * are dropped; quantities are clamped to stock. This is the only place totals come from.
 */
export function priceBag(lines: readonly BagLine[]): PricedBag {
  const priced: PricedLine[] = [];
  for (const line of lines) {
    if (lineProblem(line)) continue;
    const product = products.find((p) => p.slug === line.slug);
    if (!product) continue;
    const maxQty = Math.min(availableUnits(product, line.option), MAX_LINE_QTY);
    const qty = Math.min(line.qty, maxQty);
    const option = line.option ? getOption(product, line.option) : undefined;
    const unit = unitPriceCents(product, line.option, qty);
    const regular = unitPriceCents(product, line.option, 1);
    // A line for a specific option only shows that option's own photo, never another colour's.
    const image = option ? option.image : product.image;
    priced.push({
      key: lineKey(line.slug, line.option),
      slug: product.slug,
      ...(line.option ? { option: line.option } : {}),
      ...(option ? { optionLabel: option.label } : {}),
      name: product.name,
      brand: product.brand,
      category: product.category,
      ...(image ? { image } : {}),
      qty,
      maxQty,
      unitPriceCents: unit,
      regularUnitPriceCents: regular,
      lineTotalCents: unit * qty,
      bulkApplied: unit < regular && !product.special,
    });
  }
  return {
    lines: priced,
    count: priced.reduce((sum, l) => sum + l.qty, 0),
    subtotalCents: priced.reduce((sum, l) => sum + l.lineTotalCents, 0),
  };
}

/** Adds to a line (or creates it), clamped to stock and the per-line maximum. */
export function addLine(lines: readonly BagLine[], add: BagLine): BagLine[] {
  const product = products.find((p) => p.slug === add.slug);
  const max = product ? Math.min(availableUnits(product, add.option), MAX_LINE_QTY) : 0;
  const key = lineKey(add.slug, add.option);
  const existing = lines.find((l) => lineKey(l.slug, l.option) === key);
  if (existing) {
    return lines.map((l) => (l === existing ? { ...l, qty: Math.min(l.qty + add.qty, max) } : l));
  }
  return [...lines, { ...add, qty: Math.min(add.qty, max) }].slice(-MAX_BAG_LINES);
}

/** Sets a line's quantity (0 removes it), clamped to stock. */
export function setLineQty(lines: readonly BagLine[], key: string, qty: number): BagLine[] {
  return lines.flatMap((l) => {
    if (lineKey(l.slug, l.option) !== key) return [l];
    if (qty <= 0) return [];
    const product = products.find((p) => p.slug === l.slug);
    const max = product ? Math.min(availableUnits(product, l.option), MAX_LINE_QTY) : 0;
    return [{ ...l, qty: Math.min(qty, max) }];
  });
}
