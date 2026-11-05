"use client";

import { formatRand } from "@alert/core/money";
import { ChevronRightIcon, MinusIcon, PlusIcon, ScanIcon } from "@/components/icons";
import { categoryTile } from "@/components/product/tile";
import { cn } from "@/lib/cn";
import { ScreenHeader, SimImage, useDragScroll } from "./sim-ui";
import { useSim } from "./sim-store";

export function SimBag() {
  const sim = useSim();
  const pageRef = useDragScroll<HTMLDivElement>("y");
  const { lines, count, subtotal } = sim.bag;

  if (lines.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <ScreenHeader title="Bag" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-32 text-center">
          <p className="type-display text-[2rem] font-extrabold leading-none">
            Your bag is <span className="type-accent text-pink">empty.</span>
          </p>
          <p className="mt-3 text-[14px] text-ink-soft">Scan a school list, or tap + on anything you like.</p>
          <button
            type="button"
            onClick={() => sim.push({ kind: "scan" })}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-paper active:scale-95"
          >
            <ScanIcon className="size-5" /> Scan a school list
          </button>
          <button type="button" onClick={() => sim.setTab("shop")} className="mt-3 text-[14px] font-semibold text-pink">
            Browse the aisles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title={`Bag · ${count}`} />
      <div ref={pageRef} className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-36">
        <ul className="space-y-3">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-3 rounded-[22px] bg-surface p-3 ring-1 ring-line">
              <button
                type="button"
                onClick={() => sim.push({ kind: "product", slug: line.slug })}
                className={cn("@container relative size-[4.75rem] shrink-0 overflow-hidden rounded-2xl", categoryTile[line.product.category].tint)}
              >
                <SimImage
                  product={line.product}
                  src={line.option ? line.product.options?.values.find((o) => o.key === line.option)?.image : line.product.image}
                  sizes="76px"
                  className="p-1.5"
                />
              </button>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="line-clamp-1 text-[13px] font-bold">{line.product.name}</p>
                <p className="text-[11px] text-muted">
                  {line.option ? `${line.product.options?.values.find((o) => o.key === line.option)?.label} · ` : ""}
                  {formatRand(line.unit)} each
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex h-8 items-center rounded-full bg-paper ring-1 ring-line">
                    <button type="button" aria-label="One fewer" onClick={() => sim.setQty(line.key, line.qty - 1)} className="inline-flex size-8 items-center justify-center">
                      <MinusIcon className="size-4" />
                    </button>
                    <span className="w-5 text-center text-[13px] font-bold tabular-nums">{line.qty}</span>
                    <button
                      type="button"
                      aria-label="One more"
                      onClick={() => sim.setQty(line.key, line.qty + 1)}
                      disabled={line.qty >= line.max}
                      className="inline-flex size-8 items-center justify-center disabled:opacity-30"
                    >
                      <PlusIcon className="size-4" />
                    </button>
                  </div>
                  <p className="text-[14px] font-bold tabular-nums">{formatRand(line.total)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => sim.toast("Promo codes come with checkout")}
          className="mt-4 flex h-12 w-full items-center justify-between rounded-full bg-surface px-5 text-[13px] text-muted ring-1 ring-line"
        >
          Enter promo code <ChevronRightIcon className="size-4" />
        </button>

        <dl className="mt-5 space-y-2 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-semibold tabular-nums">{formatRand(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="text-muted">At checkout</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-[16px]">
            <dt className="font-bold">Total</dt>
            <dd className="font-bold tabular-nums">{formatRand(subtotal)}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => sim.openSheet("checkout")}
          className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-brand text-[16px] font-semibold text-on-brand active:scale-[0.98]"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
