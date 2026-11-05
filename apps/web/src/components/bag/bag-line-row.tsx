"use client";

// Client component: light entry points only.
import type { PricedLine } from "@alert/core";
import { formatRand } from "@alert/core/money";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { updateBagLine } from "@/app/actions/bag";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** One bag line. Every change goes to the server, which re-prices the bag. */
export function BagLineRow({ line, tintClass }: { line: PricedLine; tintClass: string }) {
  const [pending, startTransition] = useTransition();
  const setQty = (qty: number) => startTransition(async () => void (await updateBagLine(line.key, qty)));
  const step = "inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-ink/6 disabled:opacity-35";

  return (
    <li className={cn("flex gap-4 py-5 transition-opacity sm:gap-5", pending && "opacity-60")}>
      <Link href={`/product/${line.slug}`} className={cn("relative size-24 shrink-0 overflow-hidden rounded-2xl sm:size-28", tintClass)}>
        {line.image ? (
          <Image src={line.image} alt="" fill sizes="112px" className="product-shot object-contain p-2.5" />
        ) : (
          <span aria-hidden="true" className="type-accent absolute inset-x-2.5 bottom-2.5 text-[15px] leading-tight text-ink/80">
            {line.name.split(",")[0]}
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{line.brand}</p>
            <Link href={`/product/${line.slug}`} className="mt-0.5 block text-[15px] font-semibold leading-snug hover:text-pink">
              {line.name}
            </Link>
            {line.optionLabel ? <p className="text-[13px] text-muted">{line.optionLabel}</p> : null}
          </div>
          <p className="shrink-0 text-[16px] font-bold tabular-nums">{formatRand(line.lineTotalCents)}</p>
        </div>

        <p className="mt-1 text-[13px] tabular-nums text-muted">
          {formatRand(line.unitPriceCents)} each
          {line.bulkApplied ? <span className="font-semibold text-pink"> · bulk price, was {formatRand(line.regularUnitPriceCents)}</span> : null}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-3">
          <div className="flex h-10 items-center rounded-full border border-line-strong bg-surface px-0.5" aria-label={`Quantity of ${line.name}`}>
            <button type="button" className={step} onClick={() => setQty(line.qty - 1)} disabled={pending} aria-label="One fewer">
              <MinusIcon className="size-4" />
            </button>
            <output aria-live="polite" className="w-8 text-center text-[15px] font-semibold tabular-nums">
              {line.qty}
            </output>
            <button type="button" className={step} onClick={() => setQty(line.qty + 1)} disabled={pending || line.qty >= line.maxQty} aria-label="One more">
              <PlusIcon className="size-4" />
            </button>
          </div>
          <button type="button" onClick={() => setQty(0)} disabled={pending} className="text-[13px] font-semibold text-muted underline-offset-4 hover:text-pink hover:underline">
            Remove
          </button>
        </div>
        {line.qty >= line.maxQty ? <p className="mt-2 text-[12px] text-pink">That&rsquo;s all we have in stock.</p> : null}
      </div>
    </li>
  );
}
