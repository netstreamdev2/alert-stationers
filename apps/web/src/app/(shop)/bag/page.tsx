import { formatRand, priceBag } from "@alert/core";
import type { Metadata } from "next";
import { Suspense } from "react";
import { BagLineRow } from "@/components/bag/bag-line-row";
import { BagIcon } from "@/components/icons";
import { categoryTile } from "@/components/product/tile";
import { Breadcrumbs, ButtonLink, Label } from "@/components/ui";
import { readBag } from "@/lib/bag-store";

export const metadata: Metadata = { title: "Your bag" };

export default function BagPage() {
  return (
    <div className="shell pt-4">
      <Breadcrumbs trail={[{ href: "/", label: "Home" }, { label: "Bag" }]} />
      <Suspense fallback={<BagSkeleton />}>
        <BagContents />
      </Suspense>
    </div>
  );
}

function BagSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your bag" className="mt-8 animate-pulse">
      <div className="h-10 w-48 rounded bg-line/80" />
      <div className="mt-8 h-28 rounded-2xl bg-line/60" />
      <div className="mt-4 h-28 rounded-2xl bg-line/60" />
    </div>
  );
}

async function BagContents() {
  const bag = priceBag(await readBag());

  if (bag.lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div aria-hidden="true" className="pattern-ruled mx-auto grid size-28 rotate-[-4deg] place-items-center rounded-card bg-tint-blush">
          <BagIcon className="size-12 text-pink" strokeWidth={1.5} />
        </div>
        <h1 className="type-display mt-8 text-[2.25rem] font-extrabold leading-none">
          Your bag is <span className="type-accent text-pink">empty.</span>
        </h1>
        <p className="mt-4 text-[17px] text-ink-soft">Start with a school list, or browse the aisles.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/school-lists">Find your school list</ButtonLink>
          <ButtonLink href="/shop" variant="outline">
            Shop everything
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
      <section aria-labelledby="bag-title">
        <Label>Your bag</Label>
        <h1 id="bag-title" className="type-display mt-3 text-[2.5rem] font-extrabold leading-none">
          {bag.count} {bag.count === 1 ? "item" : "items"}
        </h1>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {bag.lines.map((line) => (
            <BagLineRow key={line.key} line={line} tintClass={categoryTile[line.category].tint} />
          ))}
        </ul>
      </section>

      <aside aria-labelledby="summary-title" className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-card border border-line bg-surface p-6">
          <h2 id="summary-title" className="type-display text-[1.375rem] font-extrabold">
            Summary
          </h2>
          <dl className="mt-5 space-y-3 text-[15px]">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="font-semibold tabular-nums">{formatRand(bag.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Delivery</dt>
              <dd className="text-muted">At checkout</dd>
            </div>
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
            <p className="font-semibold">Total</p>
            <p className="text-[1.5rem] font-bold tabular-nums">{formatRand(bag.subtotalCents)}</p>
          </div>
          <p className="mt-1 text-right text-[12px] text-muted">Includes VAT</p>
          <ButtonLink href="/checkout" className="mt-6 h-14 w-full text-[16px]">
            Checkout
          </ButtonLink>
          <p className="mt-3 text-center text-[13px] text-muted">Delivery is worked out at checkout.</p>
        </div>
      </aside>
    </div>
  );
}
