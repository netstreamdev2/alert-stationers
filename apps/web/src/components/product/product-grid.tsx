import type { Product } from "@alert/core";
import { cn } from "@/lib/cn";
import { ProductCard } from "./product-card";

export function ProductGrid({ products, className }: { products: readonly Product[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4", className)}>
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
