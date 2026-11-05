"use client";

import { formatRand, percentOff } from "@alert/core/money";
import { unitPriceCents } from "@alert/core/pricing";
import { useState } from "react";
import { ArrowLeftIcon, BagIcon, CheckIcon, HeartIcon, MinusIcon, PlusIcon, PulseIcon } from "@/components/icons";
import { Countdown } from "@/components/product/countdown";
import { categoryTile } from "@/components/product/tile";
import { cn } from "@/lib/cn";
import { flyToBag } from "@/lib/fly-to-bag";
import { RoundButton, SimBagButton, SimImage, shortName, useDragScroll } from "./sim-ui";
import { useSim } from "./sim-store";

export function SimProduct({ slug }: { slug: string }) {
  const sim = useSim();
  const product = sim.bySlug.get(slug);
  const values = product?.options?.values ?? [];
  const [optionKey, setOptionKey] = useState<string | undefined>((values.find((o) => o.stock > 0) ?? values[0])?.key);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const pageRef = useDragScroll<HTMLDivElement>("y");
  if (!product) return null;

  const option = values.find((o) => o.key === optionKey);
  const stock = Math.min(option ? option.stock : (product.stock ?? 0), 99);
  const soldOut = stock <= 0;
  const safeQty = Math.max(1, Math.min(qty, Math.max(stock, 1)));
  const unit = unitPriceCents(product, optionKey, safeQty);
  const discount = product.special ? percentOff(product.priceCents, product.special.priceCents) : 0;
  // A chosen option only shows its own photo.
  const image = option ? option.image : product.image;

  function add(e: React.MouseEvent<HTMLButtonElement>, p: NonNullable<typeof product>) {
    sim.add([{ slug: p.slug, ...(optionKey ? { option: optionKey } : {}), qty: safeQty }]);
    flyToBag(e.currentTarget.closest("[data-fly-scope]")?.querySelector("[data-fly-source]") ?? null, "[data-sim-bag]");
    sim.toast(`${shortName(p)} added to your bag`);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div data-fly-scope className="relative h-full">
      <div ref={pageRef} className="no-scrollbar h-full overflow-y-auto pb-36">
        <div className={cn("relative h-[25rem] pt-[54px]", categoryTile[product.category].tint)}>
          <div className="absolute inset-x-5 top-[58px] z-10 flex items-center justify-between">
            <RoundButton label="Back" onClick={sim.pop} frosted>
              <ArrowLeftIcon className="size-5" />
            </RoundButton>
            <div className="flex gap-2">
              <RoundButton label="Save for later" onClick={() => sim.toast("Wishlists come with the full app")} frosted>
                <HeartIcon className="size-5" />
              </RoundButton>
              <SimBagButton frosted />
            </div>
          </div>
          <div data-fly-source className="@container absolute inset-x-8 bottom-6 top-20" key={image ?? optionKey}>
            <SimImage product={product} src={image} sizes="330px" className="fade-in p-[6%]" />
          </div>
          {discount ? <span className="absolute bottom-6 left-5 rounded-[6px] bg-ink px-2 py-1 text-[12px] font-bold text-paper">−{discount}%</span> : null}
        </div>

        <div className="relative -mt-5 rounded-t-[28px] bg-paper px-5 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{product.brand}</p>
          <h1 className="type-display mt-1 text-[1.6rem] font-extrabold leading-[1.08]">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-2">
            <p className={cn("text-[1.5rem] font-bold tabular-nums", product.special ? "text-pink" : "text-ink")}>{formatRand(unit)}</p>
            {product.special ? <s className="text-[14px] tabular-nums text-muted">{formatRand(product.priceCents)}</s> : null}
          </div>
          {product.special?.endsAt ? (
            <p className="mt-1 text-[12px] font-semibold text-pink">
              <Countdown endsAt={product.special.endsAt} />
            </p>
          ) : null}
          {product.bulk && !product.special ? (
            <p className="mt-1 text-[12px] font-medium text-pink">
              {formatRand(product.bulk.priceCents)} each for {product.bulk.minQty}+
            </p>
          ) : null}

          <p className={cn("mt-3 flex items-center gap-1.5 text-[13px] font-semibold", soldOut ? "text-muted" : stock <= 5 ? "text-pink" : "text-success")}>
            <PulseIcon className="pulse-line size-4" strokeWidth={2} />
            {soldOut ? "Sold out for now" : stock <= 5 ? `Only ${stock} left` : "In stock"}
          </p>

          {product.options ? (
            <div className="mt-5">
              <p className="text-[13px] font-semibold">{product.options.kind === "colour" ? "Colour" : "Pack size"}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {values.map((o) => {
                  const selected = o.key === optionKey;
                  return (
                    <button
                      key={o.key}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setOptionKey(o.key);
                        setQty(1);
                      }}
                      className={cn(
                        "inline-flex h-10 items-center gap-2 rounded-full pl-1.5 pr-4 text-[13px] font-medium transition-colors",
                        selected ? "bg-ink text-paper" : "bg-surface ring-1 ring-line",
                        o.stock <= 0 && "opacity-45",
                        !o.swatch && "pl-4",
                      )}
                    >
                      {o.swatch ? <span className="size-7 rounded-full ring-1 ring-inset ring-ink/15" style={{ backgroundColor: o.swatch }} /> : null}
                      {o.label}
                      {o.stock <= 0 ? " · sold out" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <p className="mt-6 text-[14px] leading-relaxed text-ink-soft">{product.description}</p>

          <p className="mt-6 text-[13px] font-semibold">A snapshot</p>
          <dl className="mt-2 divide-y divide-line rounded-2xl bg-surface px-4 ring-1 ring-line">
            {product.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-4 py-3 text-[13px]">
                <dt className="text-muted">{s.label}</dt>
                <dd className="text-right font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Sticky buy bar: a light frost over the page */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 border-t border-line/70 bg-paper/85 px-5 pb-9 pt-3 backdrop-blur-xl">
        <div className="flex h-12 items-center rounded-full bg-surface ring-1 ring-line">
          <button type="button" aria-label="One fewer" onClick={() => setQty(safeQty - 1)} disabled={safeQty <= 1} className="inline-flex size-11 items-center justify-center disabled:opacity-30">
            <MinusIcon className="size-[18px]" />
          </button>
          <span className="w-6 text-center text-[15px] font-bold tabular-nums">{safeQty}</span>
          <button type="button" aria-label="One more" onClick={() => setQty(safeQty + 1)} disabled={safeQty >= stock} className="inline-flex size-11 items-center justify-center disabled:opacity-30">
            <PlusIcon className="size-[18px]" />
          </button>
        </div>
        <button
          type="button"
          onClick={(e) => add(e, product)}
          disabled={soldOut}
          className={cn(
            "flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-colors active:scale-[0.98]",
            soldOut ? "bg-line text-muted" : added ? "bg-ink text-paper" : "bg-brand text-on-brand",
          )}
        >
          {added ? <CheckIcon className="check-draw size-5" strokeWidth={2.5} /> : <BagIcon className="size-5" />}
          {soldOut ? "Sold out" : added ? "Added" : `Add · ${formatRand(unit * safeQty)}`}
        </button>
      </div>
    </div>
  );
}
