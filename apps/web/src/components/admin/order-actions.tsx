"use client";

import { orderProgress, type Order, type OrderStatus } from "@alert/core/orders";
import { useState, useTransition } from "react";
import { advanceOrder, cancelOrder } from "@/app/actions/checkout";
import { cn } from "@/lib/cn";
import { useNow } from "@/lib/use-now";

/** What the staff member is confirming when they move an order to each step. */
const stepActions: Partial<Record<OrderStatus, string>> = {
  packed: "Mark packed",
  shipped: "Hand to courier",
  "out-for-delivery": "Out for delivery",
  delivered: "Mark delivered",
  ready: "Ready to collect",
  collected: "Mark collected",
};

/** Staff controls: move a paid order to its next step, or cancel it. Each one is a server action. */
export function OrderActions({ order }: { order: Order }) {
  const now = useNow();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { steps, final, status } = orderProgress(order, now || Date.parse(order.paidAt ?? order.placedAt));
  const next = steps.find((s) => !s.done);
  const canAdvance = Boolean(order.paidAt) && !order.cancelledAt && !final && next;
  const canCancel = !order.cancelledAt && !final && status !== "delivered" && status !== "collected";

  const run = (action: (id: string) => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      setError(null);
      const result = await action(order.id);
      if (!result.ok) setError(result.error ?? "Something went wrong.");
    });

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {canAdvance ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(advanceOrder)}
          className={cn("h-9 rounded-full bg-ink px-4 text-[13px] font-semibold text-paper transition-opacity hover:bg-ink-soft", pending && "opacity-60")}
        >
          {stepActions[next.status] ?? `Move to ${next.label}`}
        </button>
      ) : null}
      {canCancel ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(cancelOrder)}
          className="h-9 rounded-full border border-line-strong px-4 text-[13px] font-semibold text-ink-soft hover:border-error hover:text-error"
        >
          Cancel
        </button>
      ) : null}
      {error ? (
        <p role="alert" className="w-full text-right text-[12px] text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
