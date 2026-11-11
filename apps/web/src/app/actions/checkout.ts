"use server";

import {
  appCheckoutSchema,
  checkoutSchema,
  deliveryFeeCents,
  fieldErrors,
  priceBag,
  type BagLine,
  type Order,
} from "@alert/core";
import { refresh } from "next/cache";
import { randomInt } from "node:crypto";
import { readBag, writeBag } from "@/lib/bag-store";
import { readOrder, readOrders, writeOrder } from "@/lib/order-store";

export type CheckoutResult = { ok: true; order: Order } | { ok: false; error: string; fields?: Record<string, string> };

/**
 * Creates an order awaiting payment. The server prices every line from the catalogue;
 * the client only says what was chosen and where it's going.
 */
async function createOrder(details: unknown, lines: BagLine[], channel: Order["channel"]): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(details);
  if (!parsed.success) return { ok: false, error: "Please check the highlighted details.", fields: fieldErrors(parsed.error) };

  const bag = priceBag(lines);
  if (bag.lines.length === 0) return { ok: false, error: "Your bag is empty, or everything in it has sold out." };

  const { method, payment, contact, address } = parsed.data;
  const deliveryCents = deliveryFeeCents(method, bag.subtotalCents);
  const order: Order = {
    id: `AS-${randomInt(100000, 1000000)}`,
    channel,
    placedAt: new Date().toISOString(),
    method,
    payment,
    contact: { name: contact.name, phone: contact.phone, ...(contact.email ? { email: contact.email } : {}) },
    ...(method === "courier" && address ? { address } : {}),
    lines: bag.lines.map((l) => ({
      slug: l.slug,
      ...(l.option ? { option: l.option } : {}),
      ...(l.optionLabel ? { optionLabel: l.optionLabel } : {}),
      name: l.name,
      qty: l.qty,
      unitPriceCents: l.unitPriceCents,
    })),
    subtotalCents: bag.subtotalCents,
    deliveryCents,
    totalCents: bag.subtotalCents + deliveryCents,
    advances: [],
  };
  await writeOrder(order);
  return { ok: true, order };
}

/** Website checkout: uses the bag in this browser. */
export async function startCheckout(details: unknown): Promise<CheckoutResult> {
  return createOrder(details, await readBag(), "web");
}

/** App preview checkout: the preview's demo bag comes with the request. */
export async function startAppCheckout(input: unknown): Promise<CheckoutResult> {
  const parsed = appCheckoutSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the highlighted details.", fields: fieldErrors(parsed.error) };
  return createOrder(parsed.data.details, parsed.data.lines, "app");
}

/**
 * The mock payment gateway's answer. In production this is the provider's verified
 * server-to-server notification (PayFast ITN / Yoco webhook), never the browser.
 */
export async function completePayment(id: unknown, outcome: unknown): Promise<CheckoutResult> {
  if (typeof id !== "string" || (outcome !== "approve" && outcome !== "decline")) return { ok: false, error: "Something went wrong." };
  const order = await readOrder(id);
  if (!order) return { ok: false, error: "We couldn't find that order." };
  if (order.paidAt) return { ok: true, order };

  const now = new Date().toISOString();
  let updated: Order;
  if (outcome === "approve") {
    // A retry after a decline clears the decline.
    const { failedAt, ...rest } = order;
    void failedAt;
    updated = { ...rest, paidAt: now };
  } else {
    updated = { ...order, failedAt: now };
  }
  await writeOrder(updated);
  if (outcome === "approve" && order.channel === "web") await writeBag([]);
  refresh();
  return { ok: true, order: updated };
}

/** Staff: move an order one step forward (admin). */
export async function advanceOrder(id: unknown): Promise<CheckoutResult> {
  if (typeof id !== "string") return { ok: false, error: "Something went wrong." };
  const order = await readOrder(id);
  if (!order) return { ok: false, error: "We couldn't find that order." };
  if (!order.paidAt || order.cancelledAt) return { ok: false, error: "Only paid orders can move forward." };
  const updated = { ...order, advances: [...order.advances, new Date().toISOString()].slice(-10) };
  await writeOrder(updated);
  refresh();
  return { ok: true, order: updated };
}

/** Staff: cancel an order (admin). */
export async function cancelOrder(id: unknown): Promise<CheckoutResult> {
  if (typeof id !== "string") return { ok: false, error: "Something went wrong." };
  const order = await readOrder(id);
  if (!order) return { ok: false, error: "We couldn't find that order." };
  const updated = { ...order, cancelledAt: new Date().toISOString() };
  await writeOrder(updated);
  refresh();
  return { ok: true, order: updated };
}

/** For the app preview's order list and tracking screen. */
export async function listMyOrders(): Promise<Order[]> {
  return readOrders();
}

export async function getMyOrder(id: unknown): Promise<Order | null> {
  return typeof id === "string" ? readOrder(id) : null;
}
