/**
 * Money is always an integer number of cents (ZAR). Never use floats for money.
 * Prices are VAT-inclusive (15%).
 */

/** Throws if a value isn't a safe integer amount of cents. Use at every boundary. */
export function assertCents(value: number): void {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError(`Expected an integer number of cents, got ${value}`);
  }
}

const NBSP = " ";

/**
 * Formats cents as rand, e.g. 4999 -> "R49.99", 123456 -> "R1 234.56".
 * Thousands use a non-breaking space (SA convention); decimals use a point
 * (SA retail convention). This is the only money formatter: every app uses it.
 */
export function formatRand(cents: number): string {
  assertCents(cents);
  const sign = cents < 0 ? "−" : "";
  const abs = Math.abs(cents);
  const rands = Math.floor(abs / 100).toString();
  const rest = (abs % 100).toString().padStart(2, "0");
  const grouped = rands.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${sign}R${grouped}.${rest}`;
}

/** Whole-number percentage saved going from `wasCents` to `nowCents` (rounded down). */
export function percentOff(wasCents: number, nowCents: number): number {
  assertCents(wasCents);
  assertCents(nowCents);
  if (wasCents <= 0 || nowCents >= wasCents) return 0;
  return Math.floor(((wasCents - nowCents) * 100) / wasCents);
}
