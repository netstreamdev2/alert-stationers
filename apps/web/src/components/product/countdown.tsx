"use client";

// A client component: import the light entry point, never "@alert/core" (it carries the catalogue).
import { countdownParts, formatShortDateSA } from "@alert/core/time";
import { useNow } from "@/lib/use-now";

const pad = (n: number) => n.toString().padStart(2, "0");

export function Countdown({ endsAt, seconds = false }: { endsAt: string; seconds?: boolean }) {
  const current = useNow();
  const endsLabel = `Ends ${formatShortDateSA(endsAt)}`;

  if (current === 0) return <span>{endsLabel}</span>;

  const parts = countdownParts(Date.parse(endsAt) - current);
  if (!parts) return <span>Deal ended</span>;

  const text =
    parts.days > 0
      ? `${parts.days}d ${pad(parts.hours)}h ${pad(parts.minutes)}m${seconds ? ` ${pad(parts.seconds)}s` : ""}`
      : `${pad(parts.hours)}h ${pad(parts.minutes)}m ${pad(parts.seconds)}s`;

  return (
    <span className="tabular-nums">
      <span className="sr-only">{endsLabel}</span>
      <span aria-hidden="true">Ends in {text}</span>
    </span>
  );
}
