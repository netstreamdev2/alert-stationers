import { describe, expect, it } from "vitest";
import { historyForSku, inventorySummary, reorderList, salesByDay, skus } from "../src/catalogue/inventory";

describe("admin inventory views", () => {
  it("covers every stock-keeping unit", () => {
    expect(skus).toHaveLength(138);
  });

  it("sums daily sales over the last 30 days of history", () => {
    const days = salesByDay(30);
    expect(days).toHaveLength(30);
    expect(days.reduce((s, d) => s + d.units, 0)).toBeGreaterThan(0);
    expect(days.every((d) => Number.isInteger(d.revenueCents))).toBe(true);
  });

  it("summarises stock and lists what needs reordering", () => {
    const summary = inventorySummary();
    expect(summary.products).toBe(120);
    expect(summary.soldOut).toBeGreaterThan(0);
    expect(reorderList().every((s) => s.stock <= s.reorderPoint)).toBe(true);
  });

  it("keeps a running balance that ends at today's stock", () => {
    const sku = skus.find((s) => s.product.slug === "fountain-pen-steel");
    expect(sku).toBeDefined();
    if (sku) expect(historyForSku(sku.sku)[0]?.balance).toBe(sku.stock);
  });
});
