import { percentOff, stockState, totalStock, type Product } from "@alert/core";
import Link from "next/link";
import { AddToBagButton } from "@/components/bag/add-to-bag-button";
import { ClockIcon, PlusIcon } from "@/components/icons";
import { Tag } from "@/components/ui";
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
            className={cn("block size-3.5 rounded-full ring-1 ring-inset ring-ink/15", option.stock === 0 && "swatch-out")}
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

/**
 * The "+" sits in a notch cut into the tile's top-right corner (the ring in the page
 * colour makes the cut). Products with options go to their page to choose one first.
 */
function QuickAdd({ product }: { product: Product }) {
  if (stockState(product) === "out") return null;
  if (product.options) {
    return (
      <Link
        href={`/product/${product.slug}`}
        aria-label={`Choose ${product.options.kind === "colour" ? "a colour" : "a pack size"} for ${product.name}`}
        className="inline-flex size-10 items-center justify-center rounded-full bg-pink-tint text-pink ring-[6px] ring-paper transition-colors duration-200 hover:bg-brand hover:text-on-brand"
      >
        <PlusIcon className="size-5" strokeWidth={2.25} />
      </Link>
    );
  }
  return <AddToBagButton variant="quick" slug={product.slug} name={product.name} />;
}

export function ProductCard({ product }: { product: Product }) {
  const state = stockState(product);
  const units = totalStock(product);
  const discount = product.special ? percentOff(product.priceCents, product.special.priceCents) : 0;

  return (
    <article className="group relative" data-fly-scope>
      <Link href={`/product/${product.slug}`} className="block rounded-tile">
        <div
          data-fly-source
          className={cn("@container relative aspect-[4/5] overflow-hidden rounded-tile", categoryTile[product.category].tint)}
        >
          <ProductArt product={product} sizes={CARD_SIZES} />

          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {discount > 0 ? <Tag tone="ink">−{discount}%</Tag> : null}
            {state === "low" ? <Tag tone="brand">{units === 1 ? "Last one" : `Only ${units} left`}</Tag> : null}
            {state === "out" ? <Tag tone="muted">Sold out</Tag> : null}
            {product.special?.endsAt ? (
              <Tag tone="glass">
                <ClockIcon className="size-3.5" strokeWidth={2.25} />
                <Countdown endsAt={product.special.endsAt} />
              </Tag>
            ) : null}
          </div>
        </div>

        <div className="px-1 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{product.brand}</p>
          <h3 className="mt-1 line-clamp-2 text-[15px] font-medium leading-snug text-ink">{product.name}</h3>
          <Price product={product} className="mt-1.5" />
          <Swatches product={product} />
        </div>
      </Link>

      {/* Sits over the tile's top-right corner, outside the link (no nested controls). */}
      <div className="absolute -right-1.5 -top-1.5">
        <QuickAdd product={product} />
      </div>
    </article>
  );
}
