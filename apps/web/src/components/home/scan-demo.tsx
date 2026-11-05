"use client";

import { useEffect, useRef, useState } from "react";
import { BagIcon, CheckIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export interface ScanRow {
  name: string;
  qty: number;
}

/* Timeline, in ms: aim → one beat per line → found → added → fade out → loop. */
const AIM_MS = 900;
const LINE_MS = 340;
const FOUND_MS = 1800;
const ADDED_MS = 2600;
const RESET_MS = 600;

/* The phone's results list shows 8 rows, then scrolls. Sizes are em-based (see stage). */
const VISIBLE_ROWS = 8;
const ROW_EM = 1.6;

/**
 * Animated mock of the app scanning a printed school list. Purely illustrative
 * (aria-hidden; the section describes it in words). The whole scene is sized in em
 * off a container-relative font size, so it scales as one piece from phone to desktop.
 * Server render and reduced motion both show the finished state, standing still.
 */
export function ScanDemo({
  school,
  grade,
  rows,
  totalLabel,
  units,
}: {
  school: string;
  grade: string;
  rows: ScanRow[];
  totalLabel: string;
  units: number;
}) {
  const n = rows.length;
  const FOUND = n + 1;
  const ADDED = n + 2;
  const RESET = n + 3;

  const [step, setStep] = useState(FOUND);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const duration = (s: number) =>
      s === 0 ? AIM_MS : s <= n ? LINE_MS : s === n + 1 ? FOUND_MS : s === n + 2 ? ADDED_MS : RESET_MS;
    let current = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const advance = () => {
      current = (current + 1) % (n + 4);
      setStep(current);
      timer = setTimeout(advance, duration(current));
    };
    const start = () => {
      if (timer !== undefined) return;
      current = 0;
      setStep(0);
      timer = setTimeout(advance, duration(0));
    };
    const stop = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
    };

    // Only animate while the scene is on screen.
    const observer = new IntersectionObserver(
      (entries) => (entries.some((entry) => entry.isIntersecting) ? start() : stop()),
      { threshold: 0.3 },
    );
    observer.observe(stage);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [n]);

  const scanned = step === 0 ? 0 : Math.min(step, n);
  const aiming = step === 0;
  const scanning = step >= 1 && step <= n;
  const found = step === FOUND || step === ADDED;
  const added = step === ADDED;
  const resetting = step === RESET;
  const progress = scanned / n;
  const rowOffset = Math.max(0, scanned - VISIBLE_ROWS) * ROW_EM;
  const status = aiming
    ? "Hold steady over the list"
    : scanning
      ? `Reading the list… ${scanned} of ${n}`
      : added
        ? "Added to your bag"
        : `${n} items found`;

  return (
    <div className="@container w-full">
      <div
        ref={stageRef}
        aria-hidden="true"
        className="relative mx-auto aspect-[35/29] w-full text-[length:calc(100cqi/35)] @max-[30rem]:aspect-[22/29] @max-[30rem]:text-[length:calc(100cqi/22)]"
      >
        {/* The printed list */}
        <div className="absolute left-[0.5em] top-[2.2em] w-[21em] -rotate-[4deg] rounded-[0.3em] bg-sheet px-[1.4em] pb-[1.4em] pt-[1.8em] text-on-sheet shadow-[0_1.2em_2.4em_-1em_rgb(0_0_0/0.55)]">
          <span className="tape absolute -top-[0.7em] left-[7em] h-[1.4em] w-[6em] rotate-[3deg]" />
          <p className="text-[0.55em] font-semibold uppercase tracking-[0.16em] opacity-60">{school}</p>
          <p className="mt-[0.3em] font-mono text-[0.9em] font-bold">{grade} stationery list · 2027</p>
          <div className="mt-[0.8em] h-px bg-sheet-rule" />
          <ol className="relative mt-[0.5em]">
            {rows.map((row, index) => (
              <li key={row.name} className="flex h-[1.3em] items-center">
                <span className="relative isolate inline-block font-mono text-[0.66em]">
                  <span
                    className={cn(
                      "absolute -inset-x-[0.25em] inset-y-[0.1em] -z-10 origin-left -skew-x-12 rounded-[0.1em] bg-magenta/40 transition-[transform,opacity] duration-300 ease-glide",
                      scanned > index ? "scale-x-100" : "scale-x-0",
                      resetting && "opacity-0",
                    )}
                  />
                  {row.qty} × {row.name}
                </span>
              </li>
            ))}
            <span
              className={cn(
                "scan-laser pointer-events-none absolute -inset-x-[0.8em] transition-[top,opacity] duration-[340ms] ease-linear",
                aiming || scanning ? "opacity-100" : "opacity-0",
              )}
              style={{ top: `${progress * 100}%` }}
            />
          </ol>
        </div>

        {/* The phone */}
        <div className="absolute right-[0.25em] top-0 w-[14.5em] rounded-[2.3em] bg-device p-[0.4em] shadow-[0_1.6em_3em_-1.2em_rgb(0_0_0/0.7)]">
          <div className="relative flex h-[27.8em] flex-col overflow-hidden rounded-[1.9em] bg-surface text-ink">
            <span className="mx-auto mt-[0.55em] h-[1.15em] w-[4.4em] shrink-0 rounded-full bg-device" />

            <div className="flex items-center justify-between px-[1em] pt-[0.8em]">
              <p className="text-[0.78em] font-bold">Scan your list</p>
              <span className="relative inline-flex">
                <BagIcon className="size-[1.3em]" />
                <span
                  className={cn(
                    "absolute -right-[0.55em] -top-[0.45em] inline-flex h-[1.15em] min-w-[1.15em] items-center justify-center rounded-full bg-brand px-[0.25em] text-on-brand transition-transform duration-300 ease-snap",
                    added ? "scale-100" : "scale-0",
                  )}
                >
                  <span className="text-[0.55em] font-bold tabular-nums">{units}</span>
                </span>
              </span>
            </div>

            {/* Viewfinder */}
            <div className="relative mx-[0.9em] mt-[0.7em] h-[6.6em] shrink-0 overflow-hidden rounded-[0.9em] bg-sheet">
              <span className="pattern-ruled absolute inset-0 [--rule:var(--sheet-rule)]" />
              <span className="absolute left-[0.55em] top-[0.55em] size-[1em] rounded-tl-[0.3em] border-l-2 border-t-2 border-pink" />
              <span className="absolute right-[0.55em] top-[0.55em] size-[1em] rounded-tr-[0.3em] border-r-2 border-t-2 border-pink" />
              <span className="absolute bottom-[0.55em] left-[0.55em] size-[1em] rounded-bl-[0.3em] border-b-2 border-l-2 border-pink" />
              <span className="absolute bottom-[0.55em] right-[0.55em] size-[1em] rounded-br-[0.3em] border-b-2 border-r-2 border-pink" />
              <span
                className={cn(
                  "scan-laser absolute inset-x-[0.9em] transition-[top,opacity] duration-[340ms] ease-linear",
                  aiming || scanning ? "opacity-100" : "opacity-0",
                )}
                style={{ top: `${10 + progress * 80}%` }}
              />
              <span
                className={cn(
                  "absolute inset-0 grid place-items-center bg-sheet/75 transition-opacity duration-300",
                  found ? "opacity-100" : "opacity-0",
                )}
              >
                <CheckIcon className="size-[2.2em] text-pink" strokeWidth={2.5} />
              </span>
            </div>

            <div className="px-[1em] pt-[0.7em]">
              <p className="text-[0.62em] font-semibold text-muted">{status}</p>
              <div className="mt-[0.4em] h-[0.22em] overflow-hidden rounded-full bg-line">
                <span className="block h-full bg-pink transition-[width] duration-300 ease-linear" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>

            {/* Items found, matched to stock */}
            <div className={cn("relative mx-[1em] mt-[0.6em] h-[12.8em] overflow-hidden transition-opacity duration-500", resetting && "opacity-0")}>
              <ul className="transition-transform duration-300 ease-glide" style={{ transform: `translateY(-${rowOffset}em)` }}>
                {rows.map((row, index) => (
                  <li
                    key={row.name}
                    className={cn(
                      "flex h-[1.6em] items-center gap-[0.5em] border-b border-line transition-[opacity,transform] duration-300 ease-glide",
                      scanned > index ? "translate-x-0 opacity-100" : "translate-x-[0.6em] opacity-0",
                    )}
                  >
                    <CheckIcon className="size-[0.95em] shrink-0 text-pink" strokeWidth={2.5} />
                    <span className="min-w-0 flex-1 truncate text-[0.6em] font-medium">{row.name}</span>
                    <span className="text-[0.6em] tabular-nums text-muted">×{row.qty}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary sheet */}
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 rounded-t-[1.4em] bg-contrast px-[1em] pb-[1.2em] pt-[1em] text-on-contrast transition-transform duration-500 ease-glide",
                found ? "translate-y-0" : "translate-y-full",
              )}
            >
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[0.55em] text-contrast-muted">
                    {n} items · {units} units
                  </p>
                  <p className="text-[1.05em] font-bold tabular-nums">{totalLabel}</p>
                </div>
                <p className="text-[0.55em] text-contrast-muted">{grade}</p>
              </div>
              <div
                className={cn(
                  "mt-[0.7em] flex h-[2.4em] items-center justify-center gap-[0.4em] rounded-full bg-brand text-on-brand transition-transform duration-300 ease-snap",
                  added && "scale-[0.97]",
                )}
              >
                {added ? <CheckIcon className="size-[1em]" strokeWidth={2.5} /> : <BagIcon className="size-[1em]" />}
                <span className="text-[0.68em] font-bold">{added ? "Added to your bag" : `Add all ${n} to bag`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
