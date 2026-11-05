"use client";

import { formatRand } from "@alert/core/money";
import { unitPriceCents } from "@alert/core/pricing";
import { useEffect, useState } from "react";
import { CameraIcon, CheckIcon, CloseIcon, SchoolListIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { RoundButton, useDragScroll } from "./sim-ui";
import { useSim } from "./sim-store";

const LINE_MS = 230;

/** Camera → laser reads the printed list line by line → results sheet → whole list into the bag. */
export function SimScan() {
  const sim = useSim();
  const list = sim.data.list;
  const n = list.items.length;
  const [phase, setPhase] = useState<"aim" | "scanning" | "found">("aim");
  const [read, setRead] = useState(0);
  const resultsRef = useDragScroll<HTMLUListElement>("y");

  useEffect(() => {
    if (phase !== "scanning") return;
    const id = window.setInterval(() => setRead((r) => Math.min(r + 1, n)), LINE_MS);
    return () => window.clearInterval(id);
  }, [phase, n]);

  useEffect(() => {
    if (phase !== "scanning" || read < n) return;
    const t = window.setTimeout(() => setPhase("found"), 400);
    return () => window.clearTimeout(t);
  }, [phase, read, n]);

  const units = list.items.reduce((s, i) => s + i.qty, 0);
  const total = list.items.reduce((sum, item) => {
    const product = sim.bySlug.get(item.slug);
    return product ? sum + unitPriceCents(product, item.option, item.qty) * item.qty : sum;
  }, 0);

  function addAll() {
    sim.add(list.items.map((i) => ({ slug: i.slug, ...(i.option ? { option: i.option } : {}), qty: i.qty })));
    sim.toast(`${n} items from your list are in your bag`);
    sim.setTab("bag");
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-device text-on-contrast">
      {/* "Camera feed": a desk, softly lit */}
      <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgb(255_255_255/0.14),transparent_65%)]" />

      <div className="relative z-10 flex items-center justify-between px-5 pt-[58px]">
        <RoundButton label="Close" onClick={sim.pop} frosted className="bg-on-contrast/15 text-on-contrast">
          <CloseIcon className="size-5" />
        </RoundButton>
        <p className="text-[15px] font-semibold">Scan a school list</p>
        <span className="size-11" />
      </div>
      <p className="relative z-10 mt-3 text-center text-[13px] text-on-contrast/70">
        {phase === "aim" ? "Fit the whole list inside the frame" : phase === "scanning" ? `Reading the list… ${read} of ${n}` : `${n} items found`}
      </p>

      {/* The printed list in view */}
      <div className="relative z-0 mx-auto mt-5 w-[17.5rem] -rotate-2 rounded-md bg-sheet p-4 text-on-sheet shadow-[0_30px_50px_-20px_rgb(0_0_0/0.8)]">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] opacity-60">{list.school}</p>
        <p className="mt-0.5 font-mono text-[13px] font-bold">{list.grade} stationery list · 2027</p>
        <ol className="relative mt-2">
          {list.items.map((item, i) => (
            <li key={item.slug + i} className="flex h-[1.15rem] items-center">
              <span className="relative isolate inline-block font-mono text-[10px]">
                <span
                  className={cn(
                    "absolute -inset-x-1 inset-y-0 -z-10 origin-left -skew-x-12 bg-magenta/40 transition-transform duration-200",
                    read > i ? "scale-x-100" : "scale-x-0",
                  )}
                />
                {item.qty} × {item.name}
              </span>
            </li>
          ))}
          {phase === "scanning" ? (
            <span className="scan-laser absolute -inset-x-3 transition-[top] duration-200 ease-linear" style={{ top: `${(read / n) * 100}%` }} />
          ) : null}
        </ol>
      </div>
      {/* Viewfinder corners */}
      <span aria-hidden="true" className="pointer-events-none absolute left-[2.6rem] top-[9.5rem] size-8 rounded-tl-xl border-l-[3px] border-t-[3px] border-on-contrast" />
      <span aria-hidden="true" className="pointer-events-none absolute right-[2.6rem] top-[9.5rem] size-8 rounded-tr-xl border-r-[3px] border-t-[3px] border-on-contrast" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-[12.5rem] left-[2.6rem] size-8 rounded-bl-xl border-b-[3px] border-l-[3px] border-on-contrast" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-[12.5rem] right-[2.6rem] size-8 rounded-br-xl border-b-[3px] border-r-[3px] border-on-contrast" />

      {/* Camera controls */}
      <div className="relative z-10 mt-auto flex items-center justify-around px-10 pb-12">
        <RoundButton label="Upload a photo" onClick={() => sim.toast("Uploading a photo comes with the full app")} frosted className="bg-on-contrast/15 text-on-contrast">
          <CameraIcon className="size-5" />
        </RoundButton>
        <button
          type="button"
          aria-label="Scan the list"
          disabled={phase !== "aim"}
          onClick={() => {
            setRead(0);
            setPhase("scanning");
          }}
          className="inline-flex size-[4.75rem] items-center justify-center rounded-full ring-4 ring-on-contrast transition-transform active:scale-90 disabled:opacity-50"
        >
          <span className="size-[3.9rem] rounded-full bg-on-contrast" />
        </button>
        <RoundButton label="Type your list" onClick={() => sim.toast("Typing a list comes with the full app")} frosted className="bg-on-contrast/15 text-on-contrast">
          <SchoolListIcon className="size-5" />
        </RoundButton>
      </div>

      {/* Results */}
      {phase === "found" ? (
        <div className="sim-sheet absolute inset-x-0 bottom-0 z-20 flex max-h-[75%] flex-col rounded-t-[28px] bg-paper px-5 pb-9 pt-3 text-ink">
          <span aria-hidden="true" className="mx-auto h-1.5 w-10 rounded-full bg-line-strong" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{list.school}</p>
          <p className="type-display mt-1 text-[1.5rem] font-extrabold leading-tight">
            {list.grade}: <span className="type-accent text-pink">all {n} found.</span>
          </p>
          <ul ref={resultsRef} className="no-scrollbar mt-3 min-h-0 flex-1 overflow-y-auto">
            {list.items.map((item, i) => (
              <li key={item.slug + i} className="flex items-center gap-2.5 border-b border-line py-2 text-[13px]">
                <CheckIcon className="size-4 shrink-0 text-pink" strokeWidth={2.5} />
                <span className="min-w-0 flex-1 truncate">{item.name}</span>
                <span className="tabular-nums text-muted">×{item.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-[12px] text-muted">
              {n} items · {units} units
            </p>
            <p className="text-[18px] font-bold tabular-nums">{formatRand(total)}</p>
          </div>
          <button
            type="button"
            onClick={addAll}
            className="mt-3 flex h-14 w-full items-center justify-center rounded-full bg-brand text-[16px] font-semibold text-on-brand active:scale-[0.98]"
          >
            Add all {n} to bag
          </button>
          <button
            type="button"
            onClick={() => {
              setRead(0);
              setPhase("aim");
            }}
            className="mt-2 text-[13px] font-semibold text-muted"
          >
            Scan again
          </button>
        </div>
      ) : null}
    </div>
  );
}
