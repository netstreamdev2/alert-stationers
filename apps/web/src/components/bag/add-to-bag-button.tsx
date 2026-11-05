"use client";

import { useState, useTransition } from "react";
import { addToBag } from "@/app/actions/bag";
import { BagIcon, CheckIcon, PlusIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { flyToBag } from "@/lib/fly-to-bag";

/*
 * Two looks, one behaviour:
 * - "full": the product page's big pill. A pink fill sweeps across while it adds,
 *   then it turns pink with a drawn tick.
 * - "quick": the round "+" set into a product tile's notch.
 * On success the picture flies into the header bag (any [data-fly-source] inside the
 * nearest [data-fly-scope]).
 */
export function AddToBagButton({
  slug,
  option,
  qty = 1,
  name,
  variant = "full",
  disabled = false,
}: {
  slug: string;
  option?: string | undefined;
  qty?: number;
  name: string;
  variant?: "full" | "quick";
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function add(event: React.MouseEvent<HTMLButtonElement>) {
    const scope = event.currentTarget.closest("[data-fly-scope]");
    setError(null);
    startTransition(async () => {
      const result = await addToBag({ slug, ...(option ? { option } : {}), qty });
      if (!result.ok) {
        setError(result.error);
        window.setTimeout(() => setError(null), 3200);
        return;
      }
      flyToBag(scope?.querySelector("[data-fly-source]") ?? null);
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    });
  }

  if (variant === "quick") {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={add}
          disabled={disabled || pending}
          aria-label={`Add ${name} to bag`}
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-full ring-[6px] ring-paper transition-[background-color,color,transform] duration-200 ease-snap active:scale-90",
            added ? "bg-brand text-on-brand" : "bg-pink-tint text-pink hover:bg-brand hover:text-on-brand",
            pending && "animate-pulse",
          )}
        >
          {added ? <CheckIcon className="check-draw size-5" strokeWidth={2.5} /> : <PlusIcon className="size-5" strokeWidth={2.25} />}
        </button>
        {error ? (
          <p role="alert" className="absolute right-0 top-full z-10 mt-3 w-52 rounded-xl bg-ink px-3 py-2 text-[12px] font-medium text-paper shadow-lift">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={add}
        disabled={disabled || pending}
        data-pending={pending || undefined}
        className={cn(
          "add-btn relative isolate flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full text-[16px] font-semibold transition-colors duration-300 active:scale-[0.99]",
          disabled ? "cursor-not-allowed bg-line text-muted" : added ? "bg-brand text-on-brand" : "bg-ink text-paper hover:bg-ink-soft",
        )}
      >
        <span aria-hidden="true" className="add-sweep" />
        {added ? (
          <>
            <CheckIcon className="check-draw size-5" strokeWidth={2.5} />
            Added to bag
          </>
        ) : pending ? (
          "Adding…"
        ) : (
          <>
            <BagIcon className="size-5" />
            {disabled ? "Sold out" : qty > 1 ? `Add ${qty} to bag` : "Add to bag"}
          </>
        )}
      </button>
      <p role="status" aria-live="polite" className={cn("mt-2 min-h-5 text-[13px]", error ? "text-error" : "text-muted")}>
        {error ?? (added ? `${name} is in your bag.` : "")}
      </p>
    </div>
  );
}
