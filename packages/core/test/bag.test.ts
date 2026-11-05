import { describe, expect, it } from "vitest";
import { addLine, lineKey, lineProblem, priceBag, setLineQty, type BagLine } from "../src/bag";
import { toPublicProduct } from "../src/catalogue/public";
import { getProduct, unitPriceCents } from "../src/catalogue/queries";

describe("unit pricing", () => {
  it("uses the special first, then bulk once qty qualifies, then the option price", () => {
    expect(unitPriceCents(getProduct("planner-2027-a5"), undefined, 10)).toBe(19999);
    const paper = getProduct("printing-paper-a4-80");
    expect(unitPriceCents(paper, undefined, 4)).toBe(10999);
    expect(unitPriceCents(paper, undefined, 5)).toBe(9999);
    expect(unitPriceCents(getProduct("exercise-book-a4-72"), "10-pack")).toBe(12999);
  });
});

describe("bag", () => {
  it("rejects lines that can't be bought", () => {
    expect(lineProblem({ slug: "nope" })).not.toBeNull();
    expect(lineProblem({ slug: "backpack-25l" })).toMatch(/option/i);
    expect(lineProblem({ slug: "whiteboard-markers-4" })).toMatch(/sold out/i);
    expect(lineProblem({ slug: "mechanical-pencil-05", option: "teal" })).toMatch(/sold out/i);
    expect(lineProblem({ slug: "gel-pens-6" })).toBeNull();
  });

  it("merges repeat adds and never exceeds stock", () => {
    let lines: BagLine[] = [];
    lines = addLine(lines, { slug: "fountain-pen-steel", qty: 1 });
    lines = addLine(lines, { slug: "fountain-pen-steel", qty: 1 });
    expect(lines).toEqual([{ slug: "fountain-pen-steel", qty: 1 }]);
  });

  it("prices on the server side: totals, bulk savings, and drops bad lines", () => {
    const bag = priceBag([
      { slug: "gel-pens-6", qty: 2 },
      { slug: "printing-paper-a4-80", qty: 5 },
      { slug: "does-not-exist", qty: 3 },
      { slug: "whiteboard-markers-4", qty: 1 },
    ]);
    expect(bag.lines.map((l) => l.slug)).toEqual(["gel-pens-6", "printing-paper-a4-80"]);
    expect(bag.count).toBe(7);
    expect(bag.subtotalCents).toBe(7499 * 2 + 9999 * 5);
    expect(bag.lines[1]?.bulkApplied).toBe(true);
  });

  it("clamps stored quantities to current stock", () => {
    const bag = priceBag([{ slug: "fineliners-10", qty: 40 }]);
    expect(bag.lines[0]?.qty).toBe(3);
  });

  it("never shows another colour's photo on an option line", () => {
    const bag = priceBag([
      { slug: "backpack-25l", option: "navy", qty: 1 },
      { slug: "backpack-25l", option: "grey", qty: 1 },
    ]);
    const navy = bag.lines.find((l) => l.option === "navy");
    const grey = bag.lines.find((l) => l.option === "grey");
    expect(grey?.image).toBeUndefined();
    if (navy?.image) expect(navy.image).toContain("navy");
  });

  it("sets and removes lines by key", () => {
    const key = lineKey("backpack-25l", "navy");
    let lines: BagLine[] = [{ slug: "backpack-25l", option: "navy", qty: 1 }];
    lines = setLineQty(lines, key, 4);
    expect(lines[0]?.qty).toBe(4);
    expect(setLineQty(lines, key, 0)).toEqual([]);
  });
});

describe("public product view", () => {
  it("never exposes cost or supplier data", () => {
    const view = toPublicProduct(getProduct("backpack-25l")) as Record<string, unknown>;
    for (const secret of ["costPriceCents", "supplier", "reorderPoint", "reorderQty", "binLocation", "sku", "barcode"]) {
      expect(view, secret).not.toHaveProperty(secret);
    }
    expect(JSON.stringify(view)).not.toMatch(/costPriceCents|reorder|binLocation/);
  });
});
