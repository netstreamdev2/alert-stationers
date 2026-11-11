/**
 * Order rules shared by the website, the app and the admin. Pure functions with no
 * catalogue and no Zod, so client components can import them (@alert/core/orders).
 *
 * DEMO VALUES: delivery fees, the free-delivery threshold and the tracking speed are
 * placeholders for the proof of concept, not the client's real policy.
 */

export type FulfilmentMethod = "courier" | "collect";
export type PaymentMethod = "card" | "eft";

export const DELIVERY_OPTIONS: Record<FulfilmentMethod, { label: string; detail: string; feeCents: number; freeFromCents?: number }> = {
  courier: { label: "Courier delivery", detail: "2–4 working days", feeCents: 9900, freeFromCents: 75000 },
  collect: { label: "Collect in store", detail: "Usually ready within 2 hours", feeCents: 0 },
};

export const PAYMENT_OPTIONS: Record<PaymentMethod, { label: string; detail: string }> = {
  card: { label: "Card", detail: "Visa, Mastercard" },
  eft: { label: "Instant EFT", detail: "Pay from your banking app" },
};

export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
] as const;
export type Province = (typeof SA_PROVINCES)[number];

export function deliveryFeeCents(method: FulfilmentMethod, subtotalCents: number): number {
  const option = DELIVERY_OPTIONS[method];
  if (option.freeFromCents !== undefined && subtotalCents >= option.freeFromCents) return 0;
  return option.feeCents;
}

/** The VAT already inside a VAT-inclusive total (15%). */
export function vatIncludedCents(totalCents: number): number {
  return Math.round((totalCents * 15) / 115);
}

export interface OrderLine {
  slug: string;
  option?: string;
  optionLabel?: string;
  name: string;
  qty: number;
  unitPriceCents: number;
}

export interface Contact {
  name: string;
  phone: string;
  email?: string;
}

export interface Address {
  street: string;
  suburb: string;
  city: string;
  province: Province;
  postalCode: string;
}

/** An order as stored. Status is never stored: it's worked out from these timestamps. */
export interface Order {
  id: string;
  channel: "web" | "app";
  placedAt: string;
  method: FulfilmentMethod;
  payment: PaymentMethod;
  contact: Contact;
  address?: Address;
  lines: OrderLine[];
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
  paidAt?: string;
  failedAt?: string;
  cancelledAt?: string;
  /** Times staff moved the order forward by hand (admin). */
  advances: string[];
}

export type OrderStatus =
  | "awaiting-payment"
  | "payment-failed"
  | "cancelled"
  | "paid"
  | "packed"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "ready"
  | "collected";

const COURIER_STEPS = ["paid", "packed", "shipped", "out-for-delivery", "delivered"] as const;
const COLLECT_STEPS = ["paid", "packed", "ready", "collected"] as const;

export const STATUS_LABELS: Record<OrderStatus, string> = {
  "awaiting-payment": "Awaiting payment",
  "payment-failed": "Payment declined",
  cancelled: "Cancelled",
  paid: "Order confirmed",
  packed: "Packed",
  shipped: "With the courier",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  ready: "Ready for collection",
  collected: "Collected",
};

/** Demo speed: each tracking step arrives this long after the previous one. */
export const DEMO_STEP_MS = 2 * 60 * 1000;

export interface TimelineStep {
  status: OrderStatus;
  label: string;
  /** When it happened, if it has. */
  at: string | null;
  done: boolean;
  current: boolean;
}

export interface OrderProgress {
  status: OrderStatus;
  steps: TimelineStep[];
  /** True once the last step is reached (or the order can't move any more). */
  final: boolean;
}

/**
 * Where an order is at `nowMs`. After payment, each step arrives DEMO_STEP_MS after
 * the last; every staff "advance" jumps one step ahead.
 */
export function orderProgress(order: Pick<Order, "method" | "paidAt" | "failedAt" | "cancelledAt" | "advances">, nowMs: number): OrderProgress {
  const keys = order.method === "courier" ? COURIER_STEPS : COLLECT_STEPS;
  const make = (reached: number, times: (string | null)[]): TimelineStep[] =>
    keys.map((status, i) => ({ status, label: STATUS_LABELS[status], at: times[i] ?? null, done: i < reached, current: i === reached - 1 }));

  if (order.cancelledAt) return { status: "cancelled", steps: make(0, []), final: true };
  if (!order.paidAt) {
    return { status: order.failedAt ? "payment-failed" : "awaiting-payment", steps: make(0, []), final: false };
  }

  const paid = Date.parse(order.paidAt);
  const elapsed = Math.max(0, nowMs - paid);
  const auto = 1 + Math.floor(elapsed / DEMO_STEP_MS);
  const reached = Math.min(keys.length, auto + order.advances.length);

  const times = keys.map((_, i) => {
    if (i >= reached) return null;
    if (i === 0) return order.paidAt ?? null;
    const autoAt = paid + i * DEMO_STEP_MS;
    if (autoAt <= nowMs) return new Date(autoAt).toISOString();
    return order.advances[order.advances.length - 1] ?? null;
  });

  const status = keys[reached - 1] ?? "paid";
  return { status, steps: make(reached, times), final: reached === keys.length };
}

/** Short, readable order number. */
export function formatOrderId(id: string): string {
  return `#${id}`;
}
