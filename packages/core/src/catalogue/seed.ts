/**
 * Proof-of-concept seed catalogue, loaded from seed/data/ (made by Astra to
 * docs/astra/POC-INVENTORY-DATA-BRIEF.md) and validated on load. All fictional, all
 * wiped before launch. Stock movements live in ./inventory so storefront pages never
 * load them.
 */
import { z } from "zod";
import categoriesJson from "../../../../seed/data/categories.json";
import productImagesJson from "../../../../seed/data/product-images.json";
import productsJson from "../../../../seed/data/products.json";
import schoolListsJson from "../../../../seed/data/school-lists.json";
import suppliersJson from "../../../../seed/data/suppliers.json";
import { categorySchema, productImagesSchema, productSchema, schoolListSchema, supplierSchema, type Product } from "./schema";

const productImages = productImagesSchema.parse(productImagesJson).products;

/** Attaches synced photos. A product with options shows its first photographed option until it has its own main photo. */
function withImages(product: Product): Product {
  const images = productImages[product.slug];
  if (!images) return product;
  const options = product.options && {
    ...product.options,
    values: product.options.values.map((option) => {
      const image = images.options?.[option.key];
      return image ? { ...option, image } : option;
    }),
  };
  const image = images.main ?? options?.values.find((option) => option.image)?.image;
  return {
    ...product,
    ...(options ? { options } : {}),
    ...(image ? { image } : {}),
    ...(images.gallery ? { gallery: images.gallery } : {}),
  };
}

export const categories = z.array(categorySchema).parse(categoriesJson);
export const products = z.array(productSchema).parse(productsJson).map(withImages);
export const schoolLists = z.array(schoolListSchema).parse(schoolListsJson);
export const suppliers = z.array(supplierSchema).parse(suppliersJson);
