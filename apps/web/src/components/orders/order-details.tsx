import { DELIVERY_OPTIONS, PAYMENT_OPTIONS, formatRand, products, vatIncludedCents, type Order } from "@alert/core";
import Image from "next/image";
import Link from "next/link";
import { categoryTile } from "@/components/product/tile";
import { cn } from "@/lib/cn";

/** "11 Nov 2026, 14:05" in SA time. */
export function dateTimeSA(iso: string): string {
  const d = new Date(Date.parse(iso) + 2 * 60 * 60 * 1000);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

/** The picture for an order line (its option's own photo when it has options). */
export function lineImage(line: Order["lines"][number]): { src?: string | undefined; tint: string } {
  const product = products.find((p) => p.slug === line.slug);
  const option = line.option ? product?.options?.values.find((o) => o.key === line.option) : undefined;
  return { src: line.option ? option?.image : product?.image, tint: product ? categoryTile[product.category].tint : "bg-tint-sand" };
}

export function OrderLines({ order }: { order: Order }) {
  return (
    <ul className="divide-y divide-line">
      {order.lines.map((line) => {
        const { src, tint } = lineImage(line);
        return (
          <li key={`${line.slug}-${line.option ?? ""}`} className="flex items-center gap-4 py-3">
            <Link href={`/product/${line.slug}`} className={cn("relative size-16 shrink-0 overflow-hidden rounded-xl", tint)}>
              {src ? <Image src={src} alt="" fill sizes="64px" className="product-shot object-contain p-1.5" /> : null}
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold">{line.name}</p>
              <p className="text-[13px] text-muted">
                {line.optionLabel ? `${line.optionLabel} · ` : ""}
                {line.qty} × {formatRand(line.unitPriceCents)}
              </p>
            </div>
            <p className="text-[14px] font-semibold tabular-nums">{formatRand(line.qty * line.unitPriceCents)}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function OrderTotals({ order }: { order: Order }) {
  return (
    <dl className="space-y-2 text-[14px]">
      <div className="flex justify-between">
        <dt className="text-ink-soft">Subtotal</dt>
        <dd className="tabular-nums">{formatRand(order.subtotalCents)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-soft">{order.method === "courier" ? "Delivery" : "Collection"}</dt>
        <dd className="tabular-nums">{order.deliveryCents === 0 ? "Free" : formatRand(order.deliveryCents)}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-3 text-[16px] font-bold">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatRand(order.totalCents)}</dd>
      </div>
      <p className="text-right text-[12px] text-muted">Includes VAT of {formatRand(vatIncludedCents(order.totalCents))}</p>
    </dl>
  );
}

export function OrderFacts({ order }: { order: Order }) {
  return (
    <dl className="grid grid-cols-1 gap-5 text-[14px] sm:grid-cols-2">
      <div>
        <dt className="text-muted">{order.method === "courier" ? "Delivering to" : "Collecting"}</dt>
        <dd className="mt-1 font-medium leading-relaxed">
          {order.contact.name}
          <br />
          {order.address ? (
            <>
              {order.address.street}, {order.address.suburb}
              <br />
              {order.address.city}, {order.address.province}, {order.address.postalCode}
            </>
          ) : (
            "From the Alert Stationers store (demo)"
          )}
        </dd>
      </div>
      <div>
        <dt className="text-muted">Details</dt>
        <dd className="mt-1 font-medium leading-relaxed">
          {DELIVERY_OPTIONS[order.method].label}
          <br />
          Paid by {PAYMENT_OPTIONS[order.payment].label.toLowerCase()}
          <br />
          Placed {dateTimeSA(order.placedAt)} on the {order.channel === "app" ? "app" : "website"}
        </dd>
      </div>
    </dl>
  );
}
