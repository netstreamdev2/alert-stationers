import { describe, expect, it } from "vitest";
import { DEMO_STEP_MS, deliveryFeeCents, orderProgress, vatIncludedCents } from "../src/orders";
import { checkoutSchema, fieldErrors } from "../src/orders-schema";

const paidAt = "2026-11-11T08:00:00.000Z";
const t0 = Date.parse(paidAt);

describe("delivery and VAT", () => {
  it("charges courier delivery until the demo free-delivery threshold", () => {
    expect(deliveryFeeCents("courier", 74999)).toBe(9900);
    expect(deliveryFeeCents("courier", 75000)).toBe(0);
    expect(deliveryFeeCents("collect", 100)).toBe(0);
  });

  it("works out the VAT inside a VAT-inclusive total", () => {
    expect(vatIncludedCents(11500)).toBe(1500);
  });
});

describe("order progress", () => {
  const base = { method: "courier" as const, advances: [] as string[] };

  it("waits for payment, or shows a decline", () => {
    expect(orderProgress(base, t0).status).toBe("awaiting-payment");
    expect(orderProgress({ ...base, failedAt: paidAt }, t0).status).toBe("payment-failed");
  });

  it("moves one step every demo interval after payment, and stops at the end", () => {
    const order = { ...base, paidAt };
    expect(orderProgress(order, t0).status).toBe("paid");
    expect(orderProgress(order, t0 + DEMO_STEP_MS).status).toBe("packed");
    expect(orderProgress(order, t0 + 2 * DEMO_STEP_MS).status).toBe("shipped");
    const end = orderProgress(order, t0 + 100 * DEMO_STEP_MS);
    expect(end.status).toBe("delivered");
    expect(end.final).toBe(true);
    expect(end.steps.every((s) => s.done && s.at)).toBe(true);
  });

  it("jumps ahead when staff advance it", () => {
    const order = { ...base, paidAt, advances: ["2026-11-11T08:00:30.000Z", "2026-11-11T08:00:40.000Z"] };
    expect(orderProgress(order, t0 + 1000).status).toBe("shipped");
  });

  it("uses collection steps for collect orders", () => {
    const order = { method: "collect" as const, paidAt, advances: [] };
    expect(orderProgress(order, t0 + 2 * DEMO_STEP_MS).status).toBe("ready");
  });

  it("stops everything when cancelled", () => {
    expect(orderProgress({ ...base, paidAt, cancelledAt: paidAt }, t0 + DEMO_STEP_MS).status).toBe("cancelled");
  });
});

describe("checkout validation", () => {
  const contact = { name: "Thandi M.", phone: "082 123 4567" };
  const address = { street: "14 Protea Lane", suburb: "Parkhurst", city: "Johannesburg", province: "Gauteng", postalCode: "2193" };

  it("accepts a courier order with an SA address and normalises the phone", () => {
    const result = checkoutSchema.safeParse({ method: "courier", payment: "card", contact, address });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.contact.phone).toBe("0821234567");
  });

  it("needs an address for delivery but not for collection", () => {
    expect(checkoutSchema.safeParse({ method: "courier", payment: "card", contact }).success).toBe(false);
    expect(checkoutSchema.safeParse({ method: "collect", payment: "eft", contact }).success).toBe(true);
  });

  it("gives field-level messages", () => {
    const result = checkoutSchema.safeParse({ method: "courier", payment: "card", contact: { name: "T", phone: "123" }, address: { ...address, postalCode: "21" } });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrors(result.error);
      expect(errors["contact.phone"]).toMatch(/South African/);
      expect(errors["address.postalCode"]).toMatch(/4 digits/);
    }
  });
});
