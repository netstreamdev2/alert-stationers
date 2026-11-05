/**
 * The shopper-safe view of a product: everything a storefront or app screen needs,
 * nothing it mustn't see (cost price, supplier, reorder levels, bin location).
 * Use this whenever product data crosses into a client component.
 */
import type { Product } from "./schema";

export type PublicOption = {
  key: string;
  label: string;
  stock: number;
  swatch?: string;
  priceCents?: number;
  image?: string;
};

export type PublicProduct = Pick<
  Product,
  "slug" | "name" | "brand" | "category" | "subcategory" | "description" | "specs" | "priceCents" | "tags"
> & {
  special?: { priceCents: number; endsAt?: string };
  stock?: number;
  options?: { kind: "colour" | "pack"; values: PublicOption[] };
  bulk?: { minQty: number; priceCents: number };
  image?: string;
  gallery?: string[];
};

export function toPublicProduct(p: Product): PublicProduct {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    subcategory: p.subcategory,
    description: p.description,
    specs: p.specs,
    priceCents: p.priceCents,
    tags: p.tags,
    ...(p.special ? { special: { priceCents: p.special.priceCents, ...(p.special.endsAt ? { endsAt: p.special.endsAt } : {}) } } : {}),
    ...(p.stock !== undefined ? { stock: p.stock } : {}),
    ...(p.options
      ? {
          options: {
            kind: p.options.kind,
            values: p.options.values.map((o) => ({
              key: o.key,
              label: o.label,
              stock: o.stock,
              ...(o.swatch ? { swatch: o.swatch } : {}),
              ...(o.priceCents ? { priceCents: o.priceCents } : {}),
              ...(o.image ? { image: o.image } : {}),
            })),
          },
        }
      : {}),
    ...(p.bulk ? { bulk: p.bulk } : {}),
    ...(p.image ? { image: p.image } : {}),
    ...(p.gallery ? { gallery: p.gallery } : {}),
  };
}
