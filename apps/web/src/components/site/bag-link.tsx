"use client";

import Link from "next/link";
import { useState } from "react";
import { BagIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** Header bag with its count; the count pops whenever it goes up. */
export function BagLink({ count }: { count: number }) {
  const [shown, setShown] = useState(count);
  const [pops, setPops] = useState(0);
  if (count !== shown) {
    // Adjusting state during render (React's recommended pattern for "previous value").
    setShown(count);
    if (count > shown) setPops((n) => n + 1);
  }

  return (
    <Link
      href="/bag"
      aria-label={count > 0 ? `Bag, ${count} ${count === 1 ? "item" : "items"}` : "Bag, empty"}
      data-bag-target
      className="relative -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/6 sm:mr-0"
    >
      <BagIcon />
      {count > 0 ? (
        <span
          key={pops}
          aria-hidden="true"
          className={cn(
            "absolute right-0 top-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold tabular-nums text-on-brand",
            pops > 0 && "bag-pop",
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
