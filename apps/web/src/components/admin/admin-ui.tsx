import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function AdminHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{eyebrow}</p> : null}
        <h1 className="type-display mt-1 text-[2rem] font-extrabold leading-none">{title}</h1>
      </div>
      {children}
    </div>
  );
}

/** A headline number. The label says what it is; the note says how it's worked out. */
export function Stat({ label, value, note, tone = "ink" }: { label: string; value: string; note?: string; tone?: "ink" | "pink" | "warning" }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-[13px] font-medium text-muted">{label}</p>
      <p className={cn("mt-1.5 text-[1.75rem] font-bold leading-none tabular-nums", tone === "pink" ? "text-pink" : tone === "warning" ? "text-warning" : "text-ink")}>
        {value}
      </p>
      {note ? <p className="mt-2 text-[12px] text-muted">{note}</p> : null}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <h2 className="text-[16px] font-bold">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

/** Stock state in words with a rectangular tag look, never a dot in a pill. */
export function StockTag({ stock, reorder }: { stock: number; reorder: boolean }) {
  if (stock === 0) return <span className="rounded-[5px] bg-error/12 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-error">Sold out</span>;
  if (stock <= 5) return <span className="rounded-[5px] bg-pink-tint px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-pink">Low</span>;
  if (reorder) return <span className="rounded-[5px] bg-warning/12 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-warning">Reorder</span>;
  return null;
}

export const th = "px-3 py-2.5 text-left text-[12px] font-semibold uppercase tracking-[0.06em] text-muted";
export const td = "px-3 py-3 text-[14px]";
