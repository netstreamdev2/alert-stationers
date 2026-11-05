"use client";

// A client component: import the light entry point, never "@alert/core" (it carries the catalogue).
import { countdownParts, formatShortDateSA } from "@alert/core/time";
import { useSyncExternalStore } from "react";

/*
 * One shared one-second clock for every countdown on the page. The server (and the first
 * client render) shows a fixed end date, so the HTML matches during hydration and the
 * live countdown takes over straight after.
 */
let now = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === undefined) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      for (const notify of listeners) notify();
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => now;
const getServerSnapshot = () => 0;

const pad = (n: number) => n.toString().padStart(2, "0");

export function Countdown({ endsAt, seconds = false }: { endsAt: string; seconds?: boolean }) {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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
