"use client";

import { useState } from "react";

export interface StockPoint {
  /** ISO time of the movement */
  at: string;
  balance: number;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const shortDate = (iso: string) => {
  const d = new Date(Date.parse(iso) + 2 * 60 * 60 * 1000);
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]}`;
};

const W = 640;
const H = 160;
const PAD = { top: 12, right: 8, bottom: 4, left: 8 };

/** Stock on hand after each movement (a step line), with the reorder point as a dashed rule and a hover crosshair. */
export function StockLine({ points, reorderPoint, label }: { points: StockPoint[]; reorderPoint: number; label: string }) {
  const [active, setActive] = useState<number | null>(null);
  if (points.length < 2) return null;

  const t0 = Date.parse(points[0]!.at);
  const t1 = Date.parse(points.at(-1)!.at);
  const max = Math.max(reorderPoint, ...points.map((p) => p.balance)) * 1.1 || 1;
  const x = (iso: string) => PAD.left + ((Date.parse(iso) - t0) / Math.max(1, t1 - t0)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - v / max) * (H - PAD.top - PAD.bottom);

  let d = `M${x(points[0]!.at)},${y(points[0]!.balance)}`;
  for (let i = 1; i < points.length; i++) d += ` H${x(points[i]!.at)} V${y(points[i]!.balance)}`;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    let best = 0;
    for (let i = 0; i < points.length; i++) if (Math.abs(x(points[i]!.at) - px) < Math.abs(x(points[best]!.at) - px)) best = i;
    setActive(best);
  };
  const shown = active === null ? null : points[active]!;

  return (
    <figure className="relative pt-10">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="h-40 w-full touch-none overflow-visible"
          role="img"
          aria-label={`${label}: stock on hand over time, now ${points.at(-1)!.balance}. Reorder point ${reorderPoint}. The movement table below has every value.`}
          onPointerMove={onMove}
          onPointerLeave={() => setActive(null)}
        >
          <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} className="stroke-line-strong" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={y(reorderPoint)}
            y2={y(reorderPoint)}
            className="stroke-muted"
            strokeWidth={1}
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          <path d={d} fill="none" className="stroke-chart" strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {shown ? (
            <line
              x1={x(shown.at)}
              x2={x(shown.at)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              className="stroke-ink/40"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
        </svg>
        {shown ? (
          <span
            aria-hidden
            className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-chart"
            style={{
              left: `${(x(shown.at) / W) * 100}%`,
              top: `${(y(shown.balance) / H) * 100}%`,
            }}
          />
        ) : null}
      </div>
      {shown ? (
        <div
          className="pointer-events-none absolute top-0 z-10 w-max -translate-x-1/2 rounded-xl bg-ink px-3 py-1.5 text-[12px] text-paper shadow-lift"
          style={{
            left: `${Math.min(88, Math.max(12, (x(shown.at) / W) * 100))}%`,
          }}
        >
          <span className="font-semibold">{shortDate(shown.at)}</span> · <span className="tabular-nums">{shown.balance} on hand</span>
        </div>
      ) : null}
      <figcaption className="mt-2 flex justify-between text-[11px] text-muted">
        <span>{shortDate(points[0]!.at)}</span>
        <span>Dashed line: reorder point ({reorderPoint})</span>
        <span>{shortDate(points.at(-1)!.at)}</span>
      </figcaption>
    </figure>
  );
}
