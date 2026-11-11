"use client";

import { orderProgress, STATUS_LABELS, type Order } from "@alert/core/orders";
import { cn } from "@/lib/cn";
import { useNow } from "@/lib/use-now";

/** An order's live status in words (lists and admin tables). */
export function OrderStatusText({
  order,
  className,
}: {
  order: Pick<Order, "method" | "paidAt" | "failedAt" | "cancelledAt" | "advances" | "placedAt">;
  className?: string;
}) {
  const now = useNow();
  const { status } = orderProgress(order, now || Date.parse(order.paidAt ?? order.placedAt));
  const tone =
    status === "payment-failed" || status === "cancelled"
      ? "text-error"
      : status === "awaiting-payment"
        ? "text-warning"
        : status === "delivered" || status === "collected"
          ? "text-success"
          : "text-pink";
  return <span className={cn("font-semibold", tone, className)}>{STATUS_LABELS[status]}</span>;
}
