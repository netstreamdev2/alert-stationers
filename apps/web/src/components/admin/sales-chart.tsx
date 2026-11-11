"use client";

import { formatRand } from "@alert/core/money";
import { useState } from "react";
import { cn } from "@/lib/cn";

export interface SalesDay {
  day: string;
  units: number;
  revenueCents: number;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const short = (day: string) => `${Number(day.slice(8, 10))} ${months[Number(day.slice(5, 7)) - 1]}`;

/** Round the top of the axis up to a tidy step so the gridlines carry readable values. */
function niceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude >= value / 4) ?? 10;
  return Math.ceil(value / (step * magnitude)) * step * magnitude;
}

/** Daily revenue as a single-series bar chart, with per-bar tooltips and a table view. */
export function SalesChart({ data }: { data: SalesDay[] }) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [active, setActive] = useState<number | null>(null);
  const max = niceMax(Math.max(...data.map((d) => d.revenueCents)));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const total = data.reduce((s, d) => s + d.revenueCents, 0);
  const units = data.reduce((s, d) => s + d.units, 0);
  const shown = active === null ? null : data[active];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[2rem] font-bold leading-none tabular-nums">{formatRand(total)}</p>
          <p className="mt-1.5 text-[13px] text-muted">
            {units.toLocaleString("en-ZA")} units over {data.length} days, valued at current prices
          </p>
        </div>
        <div role="group" aria-label="Show as" className="flex rounded-full border border-line p-0.5">
          {(["chart", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn("rounded-full px-3.5 py-1.5 text-[13px] font-semibold capitalize", view === v ? "bg-ink text-paper" : "text-ink-soft hover:text-ink")}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "chart" ? (
        <div className="mt-6">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3">
            {/* Axis labels, aligned to the gridlines */}
            <div className="relative h-56 w-14 text-right text-[11px] tabular-nums text-muted" aria-hidden>
              {ticks.map((t) => (
                <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${100 - (t / max) * 100}%` }}>
                  {t === 0 ? "R0" : `R${Math.round(t / 100 / 1000)}k`}
                </span>
              ))}
            </div>
            <div className="relative h-56" onMouseLeave={() => setActive(null)}>
              {ticks.map((t) => (
                <div key={t} aria-hidden className={cn("absolute inset-x-0 border-t", t === 0 ? "border-line-strong" : "border-line")} style={{ top: `${100 - (t / max) * 100}%` }} />
              ))}
              <ul className="absolute inset-0 flex items-end gap-[2px]" aria-label="Revenue by day">
                {data.map((d, i) => (
                  <li key={d.day} className="relative flex h-full min-w-0 flex-1 items-end">
                    <button
                      type="button"
                      aria-label={`${short(d.day)}: ${formatRand(d.revenueCents)}, ${d.units} units`}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onBlur={() => setActive(null)}
                      className="group flex h-full w-full items-end outline-none"
                    >
                      <span
                        className={cn(
                          "block w-full rounded-t-[4px] bg-chart transition-opacity group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ink",
                          active !== null && active !== i && "opacity-45",
                        )}
                        style={{ height: `${Math.max(1, (d.revenueCents / max) * 100)}%` }}
                      />
                    </button>
                  </li>
                ))}
              </ul>
              {shown && active !== null ? (
                <div
                  role="status"
                  className="pointer-events-none absolute top-0 z-10 w-max -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-[12px] text-paper shadow-lift"
                  style={{ left: `${Math.min(88, Math.max(12, ((active + 0.5) / data.length) * 100))}%` }}
                >
                  <p className="font-semibold">{short(shown.day)}</p>
                  <p className="tabular-nums">{formatRand(shown.revenueCents)}</p>
                  <p className="tabular-nums opacity-75">{shown.units} units</p>
                </div>
              ) : null}
            </div>
            <div />
            <div className="mt-2 flex justify-between text-[11px] text-muted" aria-hidden>
              <span>{short(data[0]?.day ?? "")}</span>
              <span>{short(data[Math.floor(data.length / 2)]?.day ?? "")}</span>
              <span>{short(data.at(-1)?.day ?? "")}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 max-h-72 overflow-auto rounded-xl border border-line">
          <table className="w-full text-[14px]">
            <caption className="sr-only">Revenue by day</caption>
            <thead className="sticky top-0 bg-surface">
              <tr className="border-b border-line text-left text-[12px] uppercase tracking-[0.06em] text-muted">
                <th className="px-3 py-2 font-semibold">Day</th>
                <th className="px-3 py-2 text-right font-semibold">Units</th>
                <th className="px-3 py-2 text-right font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.map((d) => (
                <tr key={d.day}>
                  <td className="px-3 py-2">{short(d.day)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{d.units}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatRand(d.revenueCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
