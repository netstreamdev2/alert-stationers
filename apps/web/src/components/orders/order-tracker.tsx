"use client";

import { DEMO_STEP_MS, orderProgress, STATUS_LABELS, type Order } from "@alert/core/orders";
import { CheckIcon, PulseIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { useNow } from "@/lib/use-now";

const HEADLINES: Record<string, string> = {
  "awaiting-payment": "Waiting for payment",
  "payment-failed": "Payment declined",
  cancelled: "This order was cancelled",
  paid: "We've got your order",
  packed: "Packed and ready",
  shipped: "With the courier",
  "out-for-delivery": "Out for delivery today",
  delivered: "Delivered",
  ready: "Ready for collection",
  collected: "Collected. Enjoy!",
};

/** "14:05", in SA time. */
function timeSA(iso: string): string {
  const d = new Date(Date.parse(iso) + 2 * 60 * 60 * 1000);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

/** Live order timeline: moves on its own (demo speed) and when staff advance the order. */
export function OrderTracker({ order }: { order: Pick<Order, "method" | "paidAt" | "failedAt" | "cancelledAt" | "advances" | "placedAt"> }) {
  const now = useNow();
  // Before the clock starts (server render), show the order as it was when placed.
  const progress = orderProgress(order, now || Date.parse(order.paidAt ?? order.placedAt));
  const moving = !progress.final && Boolean(order.paidAt) && !order.cancelledAt;

  return (
    <div>
      <p className={cn("flex items-center gap-2 text-[14px] font-semibold", moving ? "text-pink" : "text-muted")}>
        {moving ? <PulseIcon className="pulse-line size-5" strokeWidth={2} /> : null}
        {STATUS_LABELS[progress.status]}
      </p>
      <h2 className="type-display mt-2 text-[2rem] font-extrabold leading-tight sm:text-[2.5rem]">{HEADLINES[progress.status]}</h2>

      {progress.steps.some((s) => s.done) || order.paidAt ? (
        <ol className="mt-8" aria-label="Order progress">
          {progress.steps.map((step, i) => (
            <li key={step.status} className="relative flex gap-4 pb-7 last:pb-0">
              {i < progress.steps.length - 1 ? (
                <span aria-hidden="true" className={cn("absolute left-[13px] top-8 h-[calc(100%-1.75rem)] w-0.5", step.done && progress.steps[i + 1]?.done ? "bg-brand" : "bg-line")} />
              ) : null}
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500",
                  step.done ? "border-brand bg-brand text-on-brand" : "border-line-strong bg-surface",
                  step.current && !progress.final && "ring-4 ring-pink-tint",
                )}
              >
                {step.done ? <CheckIcon className="check-draw size-4" strokeWidth={3} /> : null}
              </span>
              <div className="pt-0.5">
                <p className={cn("text-[16px] font-semibold", !step.done && "text-muted")}>{step.label}</p>
                <p className="text-[13px] text-muted">{step.at ? timeSA(step.at) : step.done ? "" : "Coming up"}</p>
              </div>
              <span className="sr-only">{step.done ? "done" : "not yet"}</span>
            </li>
          ))}
        </ol>
      ) : null}

      {moving ? (
        <p className="mt-6 text-[12px] text-muted">
          Demo: tracking moves on by itself every {DEMO_STEP_MS / 60000} minutes, or staff can move it on from the admin.
        </p>
      ) : null}
    </div>
  );
}
