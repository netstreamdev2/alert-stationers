/**
 * Proof-of-concept bag storage: the chosen lines (product, option, quantity) live in an
 * httpOnly cookie that only the server reads and writes. Prices and totals are never
 * stored; they're worked out by @alert/core on every read. When Supabase is wired,
 * this file becomes the database-backed cart, and nothing else changes.
 */
import { bagSchema, type BagLine } from "@alert/core";
import { cookies } from "next/headers";

const COOKIE = "as_bag";

export async function readBag(): Promise<BagLine[]> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = bagSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export async function writeBag(lines: BagLine[]): Promise<void> {
  (await cookies()).set(COOKIE, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
