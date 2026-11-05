import { describe, expect, it } from "vitest";
import { formatRand, percentOff } from "../src/money";
import { countdownParts, formatShortDateSA } from "../src/time";

describe("formatRand", () => {
  it("formats cents as rand with SA grouping", () => {
    expect(formatRand(4999)).toBe("R49.99");
    expect(formatRand(5)).toBe("R0.05");
    expect(formatRand(123456)).toBe("R1 234.56");
    expect(formatRand(123456789)).toBe("R1 234 567.89");
    expect(formatRand(-1500)).toBe("−R15.00");
  });

  it("refuses non-integer cents", () => {
    expect(() => formatRand(49.99)).toThrow();
  });
});

describe("percentOff", () => {
  it("rounds down and never goes negative", () => {
    expect(percentOff(24999, 19999)).toBe(20);
    expect(percentOff(22999, 17999)).toBe(21);
    expect(percentOff(1000, 1200)).toBe(0);
  });
});

describe("time", () => {
  it("shows dates in SA time", () => {
    // 21:59 UTC on 31 Dec is 23:59 in Johannesburg: still 31 Dec.
    expect(formatShortDateSA("2026-12-31T21:59:59.000Z")).toBe("31 Dec");
    // 22:30 UTC on 31 Dec is already 1 Jan in Johannesburg.
    expect(formatShortDateSA("2026-12-31T22:30:00.000Z")).toBe("1 Jan");
  });

  it("splits a countdown and ends at zero", () => {
    expect(countdownParts(((2 * 24 + 3) * 60 * 60 + 4 * 60 + 5) * 1000)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 });
    expect(countdownParts(0)).toBeNull();
  });
});
