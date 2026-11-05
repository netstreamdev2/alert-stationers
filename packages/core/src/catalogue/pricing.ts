/**
 * The price rule, with no catalogue attached, so client components can import it
 * (@alert/core/pricing) without bundling the seed data.
 */

/** Anything with prices: a full Product or the shopper-safe PublicProduct. */
export interface Priceable {
  priceCents: number;
  special?: { priceCents: number } | undefined;
  bulk?: { minQty: number; priceCents: number } | undefined;
  options?: { values: ReadonlyArray<{ key: string; priceCents?: number | undefined }> } | undefined;
}

/**
 * Price a shopper pays per unit right now. One rule, used everywhere:
 * a special wins; otherwise a bulk tier applies once `qty` reaches it; otherwise the
 * option's own price (e.g. a pack size); otherwise the regular price.
 */
export function unitPriceCents(product: Priceable, optionKey?: string, qty = 1): number {
  if (product.special) return product.special.priceCents;
  let base = product.priceCents;
  if (optionKey) {
    const option = product.options?.values.find((o) => o.key === optionKey);
    if (!option) throw new Error(`Unknown option "${optionKey}"`);
    base = option.priceCents ?? product.priceCents;
  }
  if (product.bulk && qty >= product.bulk.minQty && product.bulk.priceCents < base) return product.bulk.priceCents;
  return base;
}
