import type { Product } from "@alert/core";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { categoryTile } from "./tile";

/**
 * The product's picture on its tinted tile: a transparent cut-out with a soft contact
 * shadow. Until a photo exists (seed/images/ → `pnpm images`), it shows a deliberate
 * typographic placeholder instead of a broken image.
 */
export function ProductArt({ product, sizes }: { product: Product; sizes: string }) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        // The product name is right below, inside the same link: don't announce it twice.
        alt=""
        fill
        sizes={sizes}
        className="product-shot object-contain p-[11%] transition-transform duration-500 ease-glide group-hover:scale-[1.05]"
      />
    );
  }

  const { pattern } = categoryTile[product.category];
  const label = product.name.split(",")[0] ?? product.name;
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <span className={cn("absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]", pattern)} />
      <span className="absolute inset-x-[9%] bottom-[8%] block transition-transform duration-500 ease-glide group-hover:-translate-y-1">
        <span className="type-accent block text-[length:13cqi] leading-[0.95] text-ink/85">{label}</span>
      </span>
    </div>
  );
}
