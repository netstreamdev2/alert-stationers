import { percentOff, stockState, totalStock, type Product } from "@alert/core";
import Link from "next/link";
import { ClockIcon } from "@/components/icons";
import { ArrowCircle, Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import { Countdown } from "./countdown";
import { Price } from "./price";
import { ProductArt } from "./product-art";
import { categoryTile } from "./tile";

const CARD_SIZES = "(min-width: 1024px) 300px, 50vw";

function Swatches({ product }: { product: Product }) {
  if (product.options?.kind !== "colour") return null;
  const values = product.options.values;
  return (
    <ul className="mt-2.5 flex items-center gap-1.5" aria-label={`${values.length} colours`}>
      {values.map((option) => (
        <li key={option.key}>
          <span
            aria-hidden="true"
            className={cn(
              "block size-3.5 rounded-full ring-1 ring-inset ring-ink/15",
              option.stock === 0 && "swatch-out",
            )}
            style={{ backgroundColor: option.swatch }}
          />
          <span className="sr-only">
            {option.label}
            {option.stock === 0 ? " (sold out)" : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const state = stockState(product);
  const units = totalStock(product);
  const discount = product.special ? percentOff(product.priceCents, product.special.priceCents) : 0;

  return (
    <article className="group relative">
      <Link href={`/product/${product.slug}`} className="block rounded-tile">
        <div className={cn("@container relative aspect-[4/5] overflow-hidden rounded-tile", categoryTile[product.category].tint)}>
          <ProductArt product={product} sizes={CARD_SIZES} />

          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {discount > 0 ? <Badge tone="ink">−{discount}%</Badge> : null}
            {state === "low" ? <Badge tone="pink">{units === 1 ? "Last one" : `Only ${units} left`}</Badge> : null}
            {state === "out" ? <Badge tone="muted">Sold out</Badge> : null}
            {product.special?.endsAt ? (
              <Badge tone="glass">
                <ClockIcon className="size-3.5" />
                <Countdown endsAt={product.special.endsAt} />
              </Badge>
            ) : null}
          </div>

          <ArrowCircle className="absolute right-3 top-3 opacity-0 transition-[opacity,transform] duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
        </div>

        <div className="px-1 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{product.brand}</p>
          <h3 className="mt-1 line-clamp-2 text-[15px] font-medium leading-snug text-ink">{product.name}</h3>
          <Price product={product} className="mt-1.5" />
          <Swatches product={product} />
        </div>
      </Link>
    </article>
  );
}
