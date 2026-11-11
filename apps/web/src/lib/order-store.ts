/**
 * Proof-of-concept order storage: each order in its own httpOnly cookie (cookies cap
 * at ~4 KB each), plus an index of ids, newest first. Only the server reads or writes
 * them. Orders move to the database when Supabase is wired.
 */
import { storedOrderSchema, type Order } from "@alert/core";
import { cookies } from "next/headers";

const INDEX = "as_orders";
const PREFIX = "as_o_";
const KEEP = 8;
const options = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

async function readIndex(): Promise<string[]> {
  const raw = (await cookies()).get(INDEX)?.value;
  if (!raw) return [];
  return raw.split(",").filter((id) => /^AS-\d{6}$/.test(id));
}

export async function readOrder(id: string): Promise<Order | null> {
  if (!/^AS-\d{6}$/.test(id)) return null;
  const raw = (await cookies()).get(PREFIX + id)?.value;
  if (!raw) return null;
  try {
    const parsed = storedOrderSchema.safeParse(JSON.parse(raw));
    return parsed.success ? (parsed.data as Order) : null;
  } catch {
    return null;
  }
}

/** This browser's orders, newest first. */
export async function readOrders(): Promise<Order[]> {
  const ids = await readIndex();
  const orders = await Promise.all(ids.map(readOrder));
  return orders.filter((o): o is Order => o !== null);
}

export async function writeOrder(order: Order): Promise<void> {
  const store = await cookies();
  store.set(PREFIX + order.id, JSON.stringify(order), options);
  const ids = [order.id, ...(await readIndex()).filter((id) => id !== order.id)];
  for (const old of ids.slice(KEEP)) store.delete(PREFIX + old);
  store.set(INDEX, ids.slice(0, KEEP).join(","), options);
}
