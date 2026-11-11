"use client";

import { formatRand } from "@alert/core/money";
import { PAYMENT_OPTIONS, type PaymentMethod } from "@alert/core/orders";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { completePayment } from "@/app/actions/checkout";
import { ShieldCheckIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Stands in for the provider's hosted payment page (PayFast / Yoco). Deliberately plain
 * and unbranded: it isn't a copy of any real gateway, and it never asks for card details.
 */
export function MockGateway({
  id,
  totalCents,
  payment,
  declined: initiallyDeclined,
}: {
  id: string;
  totalCents: number;
  payment: PaymentMethod;
  declined: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [choice, setChoice] = useState<"approve" | "decline" | null>(null);
  const [declined, setDeclined] = useState(initiallyDeclined);

  function respond(outcome: "approve" | "decline") {
    setChoice(outcome);
    startTransition(async () => {
      const result = await completePayment(id, outcome);
      if (result.ok && outcome === "approve") router.push(`/orders/${id}?paid=1`);
      else setDeclined(true);
    });
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="overflow-hidden rounded-[28px] border border-line bg-surface shadow-lift">
        <div className="flex items-center justify-between border-b border-line bg-paper px-6 py-4">
          <p className="flex items-center gap-2 text-[14px] font-semibold">
            <ShieldCheckIcon className="size-5 text-success" />
            Secure test payment
          </p>
          <span className="rounded-[5px] bg-ink px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-paper">Test mode</span>
        </div>
        <div className="px-6 py-7">
          <p className="text-[13px] text-muted">Paying</p>
          <p className="text-[17px] font-semibold">Alert Stationers (demo)</p>
          <p className="mt-5 text-[13px] text-muted">Amount</p>
          <p className="text-[2.5rem] font-bold leading-tight tabular-nums">{formatRand(totalCents)}</p>
          <dl className="mt-5 space-y-2 border-t border-line pt-5 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-muted">Reference</dt>
              <dd className="font-medium tabular-nums">{id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Method</dt>
              <dd className="font-medium">{PAYMENT_OPTIONS[payment].label}</dd>
            </div>
          </dl>

          {declined && !pending ? (
            <p role="alert" className="mt-6 rounded-2xl bg-pink-tint px-4 py-3 text-[14px] font-medium text-error">
              The test payment was declined. Nothing was charged. You can try again.
            </p>
          ) : null}

          <div className="mt-7 grid gap-3">
            <button
              type="button"
              onClick={() => respond("approve")}
              disabled={pending}
              className="flex h-14 items-center justify-center rounded-full bg-ink text-[16px] font-semibold text-paper transition-colors hover:bg-ink-soft disabled:opacity-70"
            >
              {pending && choice === "approve" ? "Approving…" : `Approve test payment`}
            </button>
            <button
              type="button"
              onClick={() => respond("decline")}
              disabled={pending}
              className={cn(
                "flex h-12 items-center justify-center rounded-full border border-line-strong text-[15px] font-semibold text-ink-soft transition-colors hover:border-ink disabled:opacity-70",
              )}
            >
              {pending && choice === "decline" ? "Declining…" : "Decline (test a failed payment)"}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-[13px] text-muted">
        This page stands in for the payment provider&rsquo;s secure page. No money moves, and no card details are asked for.
      </p>
    </div>
  );
}
