"use server";

import { addLine, bagLineSchema, lineKey, lineProblem, MAX_LINE_QTY, priceBag, setLineQty } from "@alert/core";
import { refresh } from "next/cache";
import { readBag, writeBag } from "@/lib/bag-store";

export type BagActionResult = { ok: true; count: number } | { ok: false; error: string };

/** Adds to the bag. Input is validated here: the client only says what, never how much it costs. */
export async function addToBag(input: unknown): Promise<BagActionResult> {
  const parsed = bagLineSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Something went wrong. Please try again." };
  const problem = lineProblem(parsed.data);
  if (problem) return { ok: false, error: problem };

  const before = await readBag();
  const key = lineKey(parsed.data.slug, parsed.data.option);
  const qtyBefore = before.find((l) => lineKey(l.slug, l.option) === key)?.qty ?? 0;
  const after = addLine(before, parsed.data);
  const qtyAfter = after.find((l) => lineKey(l.slug, l.option) === key)?.qty ?? 0;
  if (qtyAfter === qtyBefore) {
    return { ok: false, error: `You already have all ${qtyAfter} we have in your bag.` };
  }

  await writeBag(after);
  refresh();
  return { ok: true, count: priceBag(after).count };
}

/** Sets a line's quantity; 0 removes it. */
export async function updateBagLine(key: unknown, qty: unknown): Promise<BagActionResult> {
  if (typeof key !== "string" || key.length > 130 || !Number.isInteger(qty) || (qty as number) < 0 || (qty as number) > MAX_LINE_QTY) {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  const after = setLineQty(await readBag(), key, qty as number);
  await writeBag(after);
  refresh();
  return { ok: true, count: priceBag(after).count };
}
