"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ShelfItem {
  key: string;
  shelf: string;
  /** A server-rendered product card. */
  card: ReactNode;
}

/**
 * One dense product grid with shelf filter chips. The server renders every card (so the
 * full aisle is in the HTML); the chips only choose which ones show.
 */
export function ShelfFilter({
  label,
  shelves,
  items,
}: {
  label: string;
  shelves: { slug: string; name: string; count: number }[];
  items: ShelfItem[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const visible = active ? items.filter((item) => item.shelf === active) : items;
  const chips = [{ slug: null, name: "All", count: items.length }, ...shelves];

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 bg-paper/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-[76px] lg:mx-0 lg:px-0">
        <ul aria-label={label} className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-wrap">
          {chips.map((chip) => {
            const pressed = active === chip.slug;
            return (
              <li key={chip.slug ?? "all"} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setActive(chip.slug)}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors active:scale-[0.97]",
                    pressed ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink hover:border-line-strong",
                  )}
                >
                  {chip.name}
                  <span className={cn("tabular-nums", pressed ? "text-paper/70" : "text-muted")}>{chip.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-3 text-[14px] text-muted" aria-live="polite">
        Showing {visible.length} of {items.length}
      </p>

      <ul key={active ?? "all"} className="mt-5 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((item, index) => (
          <li key={item.key} className="rise" style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}>
            {item.card}
          </li>
        ))}
      </ul>
    </div>
  );
}
