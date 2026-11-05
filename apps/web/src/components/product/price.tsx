import { formatRand, priceRangeCents, stockState, type Product } from "@alert/core";
import { cn } from "@/lib/cn";

export function Price({ product, className }: { product: Product; className?: string }) {
  if (product.special) {
    return (
      <p className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
        <span className="text-[17px] font-semibold tabular-nums text-pink">{formatRand(product.special.priceCents)}</span>
        <span className="sr-only">, was </span>
        <s className="text-sm tabular-nums text-muted">{formatRand(product.priceCents)}</s>
      </p>
    );
  }

  const { min, max } = priceRangeCents(product);
  const soldOut = stockState(product) === "out";

  return (
    <div className={className}>
      <p className={cn("text-[17px] font-semibold tabular-nums", soldOut ? "text-muted" : "text-ink")}>
        {min !== max ? <span className="text-sm font-medium text-muted">From </span> : null}
        {formatRand(min)}
      </p>
      {product.bulk ? (
        <p className="mt-0.5 text-[13px] font-medium text-pink">
          {formatRand(product.bulk.priceCents)} each for {product.bulk.minQty}+
        </p>
      ) : null}
    </div>
  );
}
