"use client";

import type { CategorySlug } from "@alert/core";
import Image from "next/image";
import { useState } from "react";
import { ChevronRightIcon } from "@/components/icons";
import { categoryTile } from "@/components/product/tile";
import { cn } from "@/lib/cn";
import { ScreenHeader, SimBagButton, SimProductTile, useDragScroll } from "./sim-ui";
import { useSim } from "./sim-store";

/** The reference's category screen: rotated shelf rail on the left, brand chips on top, two-column tiles. */
export function SimAisle({ category: slug }: { category: CategorySlug }) {
  const sim = useSim();
  const category = sim.data.categories.find((c) => c.slug === slug);
  const [shelf, setShelf] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const railRef = useDragScroll<HTMLElement>("y");
  const gridRef = useDragScroll<HTMLDivElement>("y");
  const chipsRef = useDragScroll<HTMLDivElement>("x");
  if (!category) return null;

  const inAisle = sim.data.products.filter((p) => p.category === slug);
  const shelves = category.subcategories.filter((s) => inAisle.some((p) => p.subcategory === s.slug));
  const brands = [...new Set(inAisle.map((p) => p.brand))];
  const shown = inAisle.filter((p) => (!shelf || p.subcategory === shelf) && (!brand || p.brand === brand));

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title={category.name} onBack={sim.pop} right={<SimBagButton />} />
      <div className="flex min-h-0 flex-1">
        <nav ref={railRef} aria-label="Shelves" className="no-scrollbar w-12 shrink-0 overflow-y-auto pb-32 pt-2">
          {[{ slug: null, name: "All" }, ...shelves].map((s) => {
            const active = shelf === s.slug;
            return (
              <button
                key={s.slug ?? "all"}
                type="button"
                onClick={() => setShelf(s.slug)}
                aria-pressed={active}
                className={cn(
                  "relative flex w-full justify-center py-4 text-[13px] transition-colors",
                  active ? "font-bold text-ink" : "font-medium text-muted",
                )}
              >
                {active ? <span aria-hidden="true" className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-brand" /> : null}
                <span className="whitespace-nowrap [writing-mode:vertical-rl] rotate-180">{s.name}</span>
              </button>
            );
          })}
        </nav>

        <div ref={gridRef} className="no-scrollbar min-w-0 flex-1 overflow-y-auto pb-32 pr-5">
          <div ref={chipsRef} className="no-scrollbar -mr-5 flex gap-2 overflow-x-auto pb-4 pr-5 pt-2">
            {[null, ...brands].map((b) => {
              const active = brand === b;
              return (
                <button
                  key={b ?? "all"}
                  type="button"
                  onClick={() => setBrand(b)}
                  aria-pressed={active}
                  className={cn(
                    "h-9 shrink-0 rounded-full px-4 text-[13px] font-medium transition-colors",
                    active ? "bg-ink text-paper" : "bg-surface text-ink ring-1 ring-line",
                  )}
                >
                  {b ?? "All brands"}
                </button>
              );
            })}
          </div>
          <p className="pb-3 text-[12px] text-muted">
            {shown.length} {shown.length === 1 ? "product" : "products"}
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            {shown.map((p) => (
              <SimProductTile key={p.slug} product={p} />
            ))}
          </div>
          {shown.length === 0 ? <p className="py-10 text-center text-[14px] text-muted">Nothing on this shelf from that brand.</p> : null}
        </div>
      </div>
    </div>
  );
}

/** Shop tab: every aisle, with a picture where one exists. */
export function SimShop() {
  const sim = useSim();
  const pageRef = useDragScroll<HTMLDivElement>("y");
  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="Shop" right={<SimBagButton />} />
      <div ref={pageRef} className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-32">
        <ul className="space-y-3">
          {sim.data.categories.map((c) => {
            const products = sim.data.products.filter((p) => p.category === c.slug);
            const photo = products.map((p) => p.image ?? p.options?.values.find((o) => o.image)?.image).find(Boolean);
            return (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => sim.push({ kind: "aisle", category: c.slug })}
                  className={cn("relative isolate flex h-24 w-full items-center gap-4 overflow-hidden rounded-[22px] px-5 text-left active:scale-[0.99]", categoryTile[c.slug].tint)}
                >
                  <span aria-hidden="true" className={cn("absolute inset-0 -z-10 [mask-image:linear-gradient(to_right,black,transparent_70%)]", categoryTile[c.slug].pattern)} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold">{c.name}</span>
                    <span className="block truncate text-[12px] text-muted">{c.blurb}</span>
                  </span>
                  {photo ? (
                    <span className="relative size-20 shrink-0">
                      <Image src={photo} alt="" fill sizes="80px" className="product-shot object-contain" />
                    </span>
                  ) : null}
                  <ChevronRightIcon className="size-5 shrink-0 text-muted" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
