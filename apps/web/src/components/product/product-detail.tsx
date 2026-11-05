"use client";

// Client component: light entry points only (never "@alert/core", which carries the catalogue).
import type { PublicProduct } from "@alert/core";
import { formatRand, percentOff } from "@alert/core/money";
import { unitPriceCents } from "@alert/core/pricing";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { AddToBagButton } from "@/components/bag/add-to-bag-button";
import { ClockIcon, MinusIcon, PlusIcon, PulseIcon } from "@/components/icons";
import { Tag } from "@/components/ui";
import { cn } from "@/lib/cn";
import { Countdown } from "./countdown";

const LOW_STOCK = 5;

function QtyStepper({ value, max, onChange }: { value: number; max: number; onChange: (n: number) => void }) {
  const btn =
    "inline-flex size-12 items-center justify-center rounded-full transition-colors hover:bg-ink/6 disabled:cursor-not-allowed disabled:opacity-35";
  return (
    <div className="flex h-14 items-center justify-between rounded-full border border-line-strong bg-surface px-1">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="One fewer">
        <MinusIcon className="size-5" />
      </button>
      <output aria-live="polite" aria-label="Quantity" className="w-8 text-center text-[17px] font-semibold tabular-nums">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="One more">
        <PlusIcon className="size-5" />
      </button>
    </div>
  );
}

export function ProductDetail({
  product,
  tintClass,
  patternClass,
  children,
}: {
  product: PublicProduct;
  tintClass: string;
  patternClass: string;
  /** Server-rendered description and specs, shown under the buying controls. */
  children: ReactNode;
}) {
  const values = product.options?.values ?? [];
  const [optionKey, setOptionKey] = useState<string | undefined>((values.find((o) => o.stock > 0) ?? values[0])?.key);
  const [qty, setQty] = useState(1);
  const [galleryImage, setGalleryImage] = useState<string | null>(null);

  const option = values.find((o) => o.key === optionKey);
  const stock = option ? option.stock : (product.stock ?? 0);
  const soldOut = stock <= 0;
  const maxQty = Math.max(1, Math.min(stock, 99));
  const safeQty = Math.min(Math.max(qty, 1), maxQty);
  const unit = unitPriceCents(product, optionKey, safeQty);
  const regular = unitPriceCents(product, optionKey, 1);
  const discount = product.special ? percentOff(product.priceCents, product.special.priceCents) : 0;
  // A chosen option only ever shows its own photo: never another colour's.
  const image = galleryImage ?? (option ? option.image : product.image);

  const thumbs = [
    ...values.filter((o) => o.image).map((o) => ({ key: `option-${o.key}`, src: o.image as string, label: o.label, option: o.key })),
    ...(product.gallery ?? []).map((src, i) => ({ key: `gallery-${i}`, src, label: `Photo ${i + 1}`, option: undefined })),
  ];

  function chooseOption(key: string) {
    setOptionKey(key);
    setGalleryImage(null);
    setQty(1);
  }

  return (
    <div data-fly-scope className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
      {/* Picture */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div data-fly-source className={cn("@container relative aspect-square overflow-hidden rounded-card", tintClass)}>
          {image ? (
            <Image
              key={image}
              src={image}
              alt={`${product.name}${option ? `, ${option.label}` : ""}`}
              fill
              preload
              sizes="(min-width: 1024px) 620px, 100vw"
              className="product-shot fade-in object-contain p-[12%]"
            />
          ) : (
            <div aria-hidden="true" className="fade-in absolute inset-0" key={optionKey ?? "none"}>
              <span className={cn("absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]", patternClass)} />
              <span className="absolute inset-x-[8%] bottom-[8%] block">
                {option ? (
                  <span className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-ink-soft">
                    {option.swatch ? <span className="size-4 rounded-full ring-1 ring-inset ring-ink/15" style={{ backgroundColor: option.swatch }} /> : null}
                    {option.label}
                  </span>
                ) : null}
                <span className="type-accent block text-[length:11cqi] leading-[0.95] text-ink/85">{product.name.split(",")[0]}</span>
              </span>
            </div>
          )}
          <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
            {discount > 0 ? <Tag tone="ink">−{discount}%</Tag> : null}
            {soldOut ? <Tag tone="muted">Sold out</Tag> : stock <= LOW_STOCK ? <Tag tone="brand">{stock === 1 ? "Last one" : `Only ${stock} left`}</Tag> : null}
          </div>
        </div>

        {thumbs.length > 1 ? (
          <ul className="mt-3 flex gap-3" aria-label="More photos">
            {thumbs.map((thumb) => {
              const active = image === thumb.src;
              return (
                <li key={thumb.key}>
                  <button
                    type="button"
                    aria-label={`Show ${thumb.label}`}
                    aria-pressed={active}
                    onClick={() => (thumb.option ? chooseOption(thumb.option) : setGalleryImage(thumb.src))}
                    className={cn(
                      "relative size-20 overflow-hidden rounded-2xl ring-2 transition",
                      tintClass,
                      active ? "ring-ink" : "ring-transparent hover:ring-line-strong",
                    )}
                  >
                    <Image src={thumb.src} alt="" fill sizes="80px" className="object-contain p-2" />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {/* Buying */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">{product.brand}</p>
        <h1 className="type-display mt-2 text-[2rem] font-extrabold leading-[1.04] sm:text-[2.5rem]">{product.name}</h1>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className={cn("text-[2rem] font-bold tabular-nums leading-none", product.special ? "text-pink" : "text-ink")}>
            {formatRand(unit)}
          </p>
          {product.special ? (
            <p className="text-[17px] text-muted">
              <span className="sr-only">was </span>
              <s className="tabular-nums">{formatRand(product.priceCents)}</s>
            </p>
          ) : unit < regular ? (
            <p className="text-[15px] font-semibold text-pink">Bulk price · was {formatRand(regular)} each</p>
          ) : null}
        </div>
        {product.special?.endsAt ? (
          <p className="mt-3 flex items-center gap-2 text-[14px] font-semibold text-pink">
            <ClockIcon className="size-[18px]" />
            <Countdown endsAt={product.special.endsAt} seconds />
          </p>
        ) : null}
        {product.bulk && unit >= regular && !product.special ? (
          <p className="mt-3 text-[14px] font-medium text-pink">
            {formatRand(product.bulk.priceCents)} each when you buy {product.bulk.minQty} or more
          </p>
        ) : null}
        <p className="mt-2 text-[13px] text-muted">Prices include VAT.</p>

        <p
          className={cn(
            "mt-6 flex items-center gap-2 text-[15px] font-semibold",
            soldOut ? "text-muted" : stock <= LOW_STOCK ? "text-pink" : "text-success",
          )}
        >
          <PulseIcon className="pulse-line size-5" strokeWidth={2} />
          {soldOut ? "Sold out for now" : stock <= LOW_STOCK ? `Only ${stock} left in stock` : "In stock"}
        </p>

        {product.options ? (
          <fieldset className="mt-7">
            <legend className="text-[14px] font-semibold">
              {product.options.kind === "colour" ? "Colour" : "Pack size"}
              {option ? <span className="font-normal text-muted">: {option.label}</span> : null}
            </legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {values.map((o) => {
                const selected = o.key === optionKey;
                const out = o.stock <= 0;
                return product.options?.kind === "colour" ? (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => chooseOption(o.key)}
                    aria-pressed={selected}
                    aria-label={`${o.label}${out ? ", sold out" : ""}`}
                    className={cn(
                      "relative size-11 rounded-full ring-2 ring-offset-[3px] ring-offset-paper transition",
                      selected ? "ring-ink" : "ring-transparent hover:ring-line-strong",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn("absolute inset-0 rounded-full ring-1 ring-inset ring-ink/15", out && "swatch-out")}
                      style={{ backgroundColor: o.swatch }}
                    />
                  </button>
                ) : (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => chooseOption(o.key)}
                    aria-pressed={selected}
                    className={cn(
                      "flex min-w-32 flex-col items-start rounded-2xl border px-4 py-3 text-left transition-colors",
                      selected ? "border-ink bg-ink text-paper" : "border-line-strong bg-surface hover:border-ink",
                      out && "opacity-50",
                    )}
                  >
                    <span className="text-[15px] font-semibold">{o.label}</span>
                    <span className={cn("text-[13px] tabular-nums", selected ? "text-paper/75" : "text-muted")}>
                      {out ? "Sold out" : formatRand(unitPriceCents(product, o.key))}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
          <QtyStepper value={safeQty} max={maxQty} onChange={(n) => setQty(Math.min(Math.max(n, 1), maxQty))} />
          <AddToBagButton slug={product.slug} option={optionKey} qty={safeQty} name={product.name} disabled={soldOut} />
        </div>

        {children}
      </div>
    </div>
  );
}
