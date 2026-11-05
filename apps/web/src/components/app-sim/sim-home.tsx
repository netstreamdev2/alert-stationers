"use client";

import type { CategorySlug, PublicProduct } from "@alert/core";
import { formatRand } from "@alert/core/money";
import Image from "next/image";
import { useState } from "react";
import { PlusIcon, ScanIcon, SearchIcon } from "@/components/icons";
import { Countdown } from "@/components/product/countdown";
import { categoryTile } from "@/components/product/tile";
import { cn } from "@/lib/cn";
import { SectionTitle, SimBagButton, SimImage, SimProductTile, displayPrice, shortName, stockOfProduct, useDragScroll, useQuickAdd } from "./sim-ui";
import { useSim } from "./sim-store";

const photoOf = (p?: PublicProduct) => p?.image ?? p?.options?.values.find((o) => o.image)?.image;

function Banners() {
  const sim = useSim();
  const railRef = useDragScroll<HTMLDivElement>("x");
  const [active, setActive] = useState(0);
  const backpack = sim.bySlug.get("backpack-25l");
  const planner = sim.bySlug.get("planner-2027-a5");

  return (
    <div>
      <div
        ref={railRef}
        onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.clientWidth * 0.86)))}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 data-[dragging]:snap-none"
      >
        <div className="relative isolate h-[10.5rem] w-[86%] shrink-0 snap-center overflow-hidden rounded-[26px] bg-contrast p-5 text-on-contrast">
          <span aria-hidden="true" className="rule-light pattern-ruled absolute inset-0 -z-10" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pink-bright">Back to school 2027</p>
          <p className="type-display mt-1.5 max-w-[11rem] text-[1.4rem] font-extrabold leading-[1.05]">
            Scan your <span className="type-accent text-pink-bright">school list.</span>
          </p>
          <button
            type="button"
            onClick={() => sim.push({ kind: "scan" })}
            className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-on-contrast px-4 text-[13px] font-semibold text-contrast active:scale-95"
          >
            <ScanIcon className="size-4" /> Scan now
          </button>
          {photoOf(backpack) ? (
            <div className="absolute -bottom-5 -right-3 size-[10rem] rotate-[8deg]">
              <Image src={photoOf(backpack) as string} alt="" fill sizes="160px" className="product-shot object-contain" />
            </div>
          ) : null}
        </div>
        {planner?.special?.endsAt ? (
          <button
            type="button"
            onClick={() => sim.push({ kind: "product", slug: planner.slug })}
            className="relative isolate h-[10.5rem] w-[86%] shrink-0 snap-center overflow-hidden rounded-[26px] bg-brand p-5 text-left text-on-brand"
          >
            <span aria-hidden="true" className="rule-light pattern-ruled absolute inset-0 -z-10" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80">Planner deal</p>
            <p className="type-display mt-1 text-[3rem] font-extrabold italic leading-none">−20%</p>
            <p className="mt-1 text-[14px] font-semibold">{planner.name}</p>
            <p className="mt-2 text-[12px] font-semibold opacity-90">
              <Countdown endsAt={planner.special.endsAt} />
            </p>
          </button>
        ) : null}
      </div>
      <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
        {[0, 1].map((i) => (
          <span key={i} className={cn("h-1.5 rounded-full transition-all duration-300", i === active ? "w-5 bg-ink" : "w-1.5 bg-line-strong")} />
        ))}
      </div>
    </div>
  );
}

/** Mismatched tile sizes: one tall, two short, one wide, two square. */
function AisleBento() {
  const sim = useSim();
  const cats = sim.data.categories;
  const art = (slug: CategorySlug) => photoOf(sim.data.products.find((p) => p.category === slug && photoOf(p)));
  const count = (slug: CategorySlug) => sim.data.products.filter((p) => p.category === slug).length;
  const layout: { slug: CategorySlug; className: string; imageClass: string }[] = [
    { slug: "school", className: "row-span-2 h-[16.5rem]", imageClass: "bottom-[-6%] right-[-10%] size-[9.5rem] rotate-[6deg]" },
    { slug: "writing", className: "h-[8rem]", imageClass: "bottom-[-14%] right-[-8%] size-[5.5rem] rotate-[24deg]" },
    { slug: "art-craft", className: "h-[8rem]", imageClass: "bottom-[2%] right-[-10%] size-[6.5rem] -rotate-[6deg]" },
    { slug: "office-filing", className: "col-span-2 h-[7rem]", imageClass: "bottom-[-10%] right-[4%] size-[7.5rem] -rotate-[4deg]" },
    { slug: "paper-books", className: "aspect-square", imageClass: "bottom-[-4%] right-[-8%] size-[6.5rem] rotate-[10deg]" },
    { slug: "gifts-planners", className: "aspect-square", imageClass: "" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 px-5">
      {layout.map(({ slug, className, imageClass }) => {
        const category = cats.find((c) => c.slug === slug);
        if (!category) return null;
        const image = art(slug);
        return (
          <button
            key={slug}
            type="button"
            onClick={() => sim.push({ kind: "aisle", category: slug })}
            className={cn(
              "relative isolate flex flex-col items-start justify-start overflow-hidden rounded-[24px] p-4 text-left transition-transform active:scale-[0.98]",
              categoryTile[slug].tint,
              className,
            )}
          >
            <span aria-hidden="true" className={cn("absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]", categoryTile[slug].pattern)} />
            <p className="text-[15px] font-bold leading-tight">{category.name}</p>
            <p className="mt-0.5 text-[11px] text-muted">{count(slug)} products</p>
            {image ? (
              <div className={cn("absolute", imageClass)}>
                <Image src={image} alt="" fill sizes="160px" className="product-shot object-contain" />
              </div>
            ) : (
              <span className="type-accent absolute bottom-3 left-4 text-[1.6rem] leading-none text-ink/70">Gifts</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Rail({ products }: { products: PublicProduct[] }) {
  const railRef = useDragScroll<HTMLDivElement>("x");
  return (
    <div ref={railRef} className="no-scrollbar flex gap-3.5 overflow-x-auto px-5 pb-1 pt-2">
      {products.map((p) => (
        <SimProductTile key={p.slug} product={p} className="w-[9.75rem] shrink-0" />
      ))}
    </div>
  );
}

/** The reference's "Spotlight": a big card with the product breaking out of the top. */
function Spotlight({ products }: { products: PublicProduct[] }) {
  const sim = useSim();
  const quickAdd = useQuickAdd();
  const railRef = useDragScroll<HTMLDivElement>("x");
  return (
    <div ref={railRef} className="no-scrollbar flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pt-10 data-[dragging]:snap-none">
      {products.map((p) => {
        const { now, was } = displayPrice(p);
        return (
          <div key={p.slug} data-fly-scope className="relative w-[78%] shrink-0 snap-center">
            <button
              type="button"
              onClick={() => sim.push({ kind: "product", slug: p.slug })}
              className={cn("block w-full rounded-[28px] px-5 pb-5 pt-28 text-left", categoryTile[p.category].tint)}
            >
              <div data-fly-source className="@container absolute -top-9 left-1/2 size-[10.5rem] -translate-x-1/2">
                <SimImage product={p} sizes="170px" />
              </div>
              <p className="text-[17px] font-bold leading-tight">{shortName(p)}</p>
              <p className="mt-1 text-[12px] text-muted">{p.specs.map((s) => s.value).slice(0, 2).join(", ")}</p>
              <p className="mt-2 text-[16px] font-bold tabular-nums">
                {formatRand(now)} {was ? <span className="text-[13px] font-medium text-muted">(was {formatRand(was)})</span> : null}
              </p>
            </button>
            {stockOfProduct(p) > 0 ? (
              <button
                type="button"
                aria-label={`Add ${p.name} to bag`}
                onClick={(e) => quickAdd(p, e.currentTarget)}
                className="absolute bottom-4 right-4 inline-flex size-10 items-center justify-center rounded-full bg-surface text-ink shadow-[0_2px_8px_rgb(0_0_0/0.08)] active:scale-90"
              >
                <PlusIcon className="size-5" strokeWidth={2.25} />
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function SimHome() {
  const sim = useSim();
  const pageRef = useDragScroll<HTMLDivElement>("y");
  const [scrolled, setScrolled] = useState(false);
  const all = sim.data.products;
  const photographed = all.filter((p) => photoOf(p));
  const specials = all.filter((p) => p.special);
  const spotlight = [...photographed, ...all.filter((p) => p.tags.includes("bestseller"))].filter((p, i, arr) => arr.findIndex((q) => q.slug === p.slug) === i).slice(0, 5);
  const popular = [...photographed, ...all.filter((p) => p.tags.includes("school-list"))].filter((p, i, arr) => arr.findIndex((q) => q.slug === p.slug) === i).slice(0, 6);

  return (
    <div ref={pageRef} onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 8)} className="no-scrollbar h-full overflow-y-auto pb-32">
      {/* Header: picks up a light frost once the page scrolls under it */}
      <div className={cn("sticky top-0 z-10 px-5 pb-3 pt-1 transition-colors duration-200", scrolled && "bg-paper/80 backdrop-blur-md")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative size-11 shrink-0">
              <Image src="/brand/logo-badge.svg" alt="Alert Stationers" fill sizes="44px" />
            </span>
            <div>
              <p className="text-[12px] text-muted">Welcome,</p>
              <p className="text-[16px] font-bold leading-tight">Guest</p>
            </div>
          </div>
          <SimBagButton />
        </div>
        <div className="mt-4 flex h-12 items-center gap-3 rounded-full bg-surface pl-4 pr-1.5 ring-1 ring-line">
          <SearchIcon className="size-5 text-muted" />
          <span className="flex-1 text-[14px] text-muted">Search pens, paper, lists…</span>
          <button type="button" aria-label="Scan a school list" onClick={() => sim.push({ kind: "scan" })} className="inline-flex size-9 items-center justify-center rounded-full bg-ink text-paper active:scale-90">
            <ScanIcon className="size-[18px]" />
          </button>
        </div>
      </div>

      <div className="mt-2">
        <Banners />
      </div>

      <div className="mt-7">
        <SectionTitle title="Shop by aisle" action="See all" onAction={() => sim.setTab("shop")} />
        <div className="mt-3">
          <AisleBento />
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle title="On special" action="See more" onAction={() => sim.setTab("shop")} />
        <Rail products={specials} />
      </div>

      <div className="mt-8">
        <SectionTitle title="Spotlight" />
        <Spotlight products={spotlight} />
      </div>

      <div className="mt-8">
        <SectionTitle title="Popular for school" />
        <div className="mt-3 grid grid-cols-2 gap-x-3.5 gap-y-6 px-5">
          {popular.map((p) => (
            <SimProductTile key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
