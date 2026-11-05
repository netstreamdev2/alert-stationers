/**
 * Timestamps are stored in UTC and shown in South African time (UTC+2, no daylight saving).
 * These helpers are deterministic: they never read the current time themselves.
 */
const SA_OFFSET_MS = 2 * 60 * 60 * 1000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

/** "2026-12-31T21:59:59Z" -> "31 Dec" (in SA time). */
export function formatShortDateSA(iso: string): string {
  const sa = new Date(Date.parse(iso) + SA_OFFSET_MS);
  return `${sa.getUTCDate()} ${MONTHS[sa.getUTCMonth()]}`;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Splits a remaining duration into parts. Returns null once the time has passed. */
export function countdownParts(remainingMs: number): CountdownParts | null {
  if (remainingMs <= 0) return null;
  const total = Math.floor(remainingMs / 1000);
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  };
}
