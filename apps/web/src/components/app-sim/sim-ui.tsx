"use client";

import type { PublicProduct } from "@alert/core";
import { formatRand, percentOff } from "@alert/core/money";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeftIcon, BagIcon, PlusIcon } from "@/components/icons";
import { categoryTile } from "@/components/product/tile";
import { cn } from "@/lib/cn";
import { flyToBag } from "@/lib/fly-to-bag";
import { useSim } from "./sim-store";

export const shortName = (p: PublicProduct) => p.name.split(",")[0] ?? p.name;
export const stockOfProduct = (p: PublicProduct) =>
  p.options ? p.options.values.reduce((sum, o) => sum + o.stock, 0) : (p.stock ?? 0);

/** Lowest current price and, for specials, the was-price. */
export function displayPrice(p: PublicProduct): { now: number; was?: number; from: boolean } {
  if (p.special) return { now: p.special.priceCents, was: p.priceCents, from: false };
  const prices = p.options?.values.map((o) => o.priceCents ?? p.priceCents) ?? [p.priceCents];
  return { now: Math.min(...prices), from: new Set(prices).size > 1 };
}

/**
 * Mouse drag scrolls like a finger (the preview feels like a touch device).
 * Locks to its axis, so a horizontal rail inside a vertical page scrolls the right way,
 * and swallows the click that ends a drag.
 */
export function useDragScroll<T extends HTMLElement>(axis: "x" | "y" = "y") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let active = false;
    let moved = false;
    let id = -1;
    let x0 = 0;
    let y0 = 0;
    let left0 = 0;
    let top0 = 0;
    const zoom = () => {
      const phone = el.closest<HTMLElement>("[data-sim-phone]");
      return (phone && Number.parseFloat(phone.style.zoom)) || 1;
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      active = true;
      moved = false;
      id = e.pointerId;
      x0 = e.clientX;
      y0 = e.clientY;
      left0 = el.scrollLeft;
      top0 = el.scrollTop;
    };
    const move = (e: PointerEvent) => {
      if (!active || e.pointerId !== id) return;
      const z = zoom();
      const dx = (e.clientX - x0) / z;
      const dy = (e.clientY - y0) / z;
      if (!moved) {
        if (Math.hypot(dx, dy) < 6) return;
        // Not my axis: let the other scroller have it.
        if ((axis === "x" && Math.abs(dx) < Math.abs(dy)) || (axis === "y" && Math.abs(dy) < Math.abs(dx))) {
          active = false;
          return;
        }
        moved = true;
        el.setPointerCapture(id);
        el.dataset.dragging = "true";
      }
      if (axis === "y") el.scrollTop = top0 - dy;
      else el.scrollLeft = left0 - dx;
    };
    const up = () => {
      if (!active) return;
      active = false;
      delete el.dataset.dragging;
      if (moved) {
        const swallow = (ev: Event) => {
          ev.stopPropagation();
          ev.preventDefault();
        };
        el.addEventListener("click", swallow, { capture: true, once: true });
        window.setTimeout(() => el.removeEventListener("click", swallow, { capture: true }), 0);
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [axis]);
  return ref;
}

export function RoundButton({
  label,
  onClick,
  children,
  frosted = false,
  className,
  ...rest
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  frosted?: boolean;
  className?: string;
  "data-sim-bag"?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition-transform duration-150 active:scale-90",
        frosted ? "bg-surface/70 backdrop-blur-md" : "bg-surface shadow-[0_1px_3px_rgb(0_0_0/0.06)] ring-1 ring-line",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SimBagButton({ frosted = false }: { frosted?: boolean }) {
  const sim = useSim();
  const count = sim.bag.count;
  return (
    <RoundButton label={count ? `Bag, ${count} items` : "Bag, empty"} onClick={() => sim.setTab("bag")} frosted={frosted} data-sim-bag>
      <BagIcon className="size-5" />
      {count > 0 ? (
        <span
          key={count}
          className="bag-pop absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold tabular-nums text-on-brand"
        >
          {count}
        </span>
      ) : null}
    </RoundButton>
  );
}

export function ScreenHeader({ title, onBack, right }: { title: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <header className="grid shrink-0 grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 px-5 pb-3 pt-1">
      {onBack ? (
        <RoundButton label="Back" onClick={onBack}>
          <ArrowLeftIcon className="size-5" />
        </RoundButton>
      ) : (
        <span />
      )}
      <h1 className="truncate text-center text-[17px] font-bold">{title}</h1>
      {right ?? <span />}
    </header>
  );
}

export function SimImage({ product, src, sizes, className }: { product: PublicProduct; src?: string | undefined; sizes: string; className?: string }) {
  const image = src ?? product.image;
  if (image) {
    return <Image src={image} alt="" fill sizes={sizes} className={cn("product-shot object-contain", className)} />;
  }
  return (
    <span aria-hidden="true" className="type-accent absolute inset-x-[10%] bottom-[9%] block text-[length:14cqi] leading-[0.95] text-ink/80">
      {shortName(product)}
    </span>
  );
}

export function PricePill({ product }: { product: PublicProduct }) {
  const { now, was, from } = displayPrice(product);
  return (
    <span className="inline-flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-3 text-[13px] font-bold tabular-nums text-paper">
      {from ? <span className="font-medium text-paper/70">From</span> : null}
      {formatRand(now)}
      {was ? (
        <>
          <span className="sr-only">, was</span>
          <s className="text-[11px] font-medium text-paper/55">{formatRand(was)}</s>
        </>
      ) : null}
    </span>
  );
}

/** Adds one to the demo bag and flies the picture to the visible bag button. */
export function useQuickAdd() {
  const sim = useSim();
  return (product: PublicProduct, from: Element | null) => {
    if (product.options) {
      sim.push({ kind: "product", slug: product.slug });
      return;
    }
    sim.add([{ slug: product.slug, qty: 1 }]);
    flyToBag(from?.closest("[data-fly-scope]")?.querySelector("[data-fly-source]") ?? null, "[data-sim-bag]");
    sim.toast(`${shortName(product)} added to your bag`);
  };
}

/** The tile from the reference: tinted square, notched "+", brand · spec, name, price pill. */
export function SimProductTile({ product, className }: { product: PublicProduct; className?: string }) {
  const sim = useSim();
  const quickAdd = useQuickAdd();
  const soldOut = stockOfProduct(product) === 0;
  const discount = product.special ? percentOff(product.priceCents, product.special.priceCents) : 0;
  const spec = product.specs[0]?.value;

  return (
    <div data-fly-scope className={cn("relative", className)}>
      <button type="button" onClick={() => sim.push({ kind: "product", slug: product.slug })} className="block w-full text-left">
        <div data-fly-source className={cn("@container relative aspect-square overflow-hidden rounded-[22px]", categoryTile[product.category].tint)}>
          <SimImage product={product} sizes="180px" className="p-[13%]" />
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
            {discount ? <span className="rounded-[5px] bg-ink px-1.5 py-0.5 text-[10px] font-bold text-paper">{discount}% OFF</span> : null}
            {soldOut ? <span className="rounded-[5px] bg-surface px-1.5 py-0.5 text-[10px] font-bold text-muted">SOLD OUT</span> : null}
          </div>
        </div>
        <p className="mt-2 truncate text-[11px] text-muted">
          {product.brand}
          {spec ? ` · ${spec}` : ""}
        </p>
        <p className="line-clamp-1 text-[13px] font-bold leading-snug">{product.name}</p>
      </button>
      <div className="mt-2">
        <PricePill product={product} />
      </div>
      {!soldOut ? (
        <button
          type="button"
          aria-label={product.options ? `Choose an option for ${product.name}` : `Add ${product.name} to bag`}
          onClick={(e) => quickAdd(product, e.currentTarget)}
          className="absolute -right-1.5 -top-1.5 inline-flex size-9 items-center justify-center rounded-full bg-pink-tint text-pink ring-[5px] ring-paper transition-transform duration-150 active:scale-90"
        >
          <PlusIcon className="size-[18px]" strokeWidth={2.25} />
        </button>
      ) : null}
    </div>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-baseline justify-between px-5">
      <h2 className="text-[17px] font-bold">{title}</h2>
      {action ? (
        <button type="button" onClick={onAction} className="text-[13px] font-medium text-muted">
          {action}
        </button>
      ) : null}
    </div>
  );
}
