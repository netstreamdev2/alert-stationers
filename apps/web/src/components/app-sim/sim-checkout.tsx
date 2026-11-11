"use client";

import { formatRand } from "@alert/core/money";
import {
  DELIVERY_OPTIONS,
  PAYMENT_OPTIONS,
  SA_PROVINCES,
  deliveryFeeCents,
  vatIncludedCents,
  type FulfilmentMethod,
  type Order,
  type PaymentMethod,
} from "@alert/core/orders";
import { useEffect, useState, useTransition } from "react";
import { completePayment, getMyOrder, listMyOrders, startAppCheckout } from "@/app/actions/checkout";
import { DEMO_DETAILS } from "@/components/checkout/checkout-form";
import { ChevronRightIcon, ShieldCheckIcon } from "@/components/icons";
import { OrderStatusText } from "@/components/orders/order-status-text";
import { OrderTracker } from "@/components/orders/order-tracker";
import { cn } from "@/lib/cn";
import { ScreenHeader, useDragScroll } from "./sim-ui";
import { useSim } from "./sim-store";

const field = "h-11 w-full rounded-xl bg-surface px-3 text-[14px] ring-1 ring-line aria-invalid:ring-error";

function Input({ label, error, ...props }: { label: string; error?: string | undefined } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-ink-soft">{label}</span>
      <input {...props} aria-invalid={Boolean(error)} className={cn(field, "mt-1")} />
      {error ? <span className="mt-1 block text-[11px] font-medium text-error">{error}</span> : null}
    </label>
  );
}

function Choice({ selected, onClick, title, detail, aside }: { selected: boolean; onClick: () => void; title: string; detail: string; aside?: string }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn("flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition-colors", selected ? "bg-ink text-paper" : "bg-surface ring-1 ring-line")}
    >
      <span className={cn("size-4 shrink-0 rounded-full border-2", selected ? "border-paper bg-brand" : "border-line-strong")} />
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold">{title}</span>
        <span className={cn("block text-[11px]", selected ? "text-paper/70" : "text-muted")}>{detail}</span>
      </span>
      {aside ? <span className="text-[13px] font-semibold tabular-nums">{aside}</span> : null}
    </button>
  );
}

/** Checkout in the app: delivery, details, payment, then the test payment sheet. */
export function SimCheckout() {
  const sim = useSim();
  const pageRef = useDragScroll<HTMLDivElement>("y");
  const [method, setMethod] = useState<FulfilmentMethod>("courier");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [contact, setContact] = useState<{ name: string; phone: string; email: string }>(DEMO_DETAILS.contact);
  const [address, setAddress] = useState<{ street: string; suburb: string; city: string; province: string; postalCode: string }>(DEMO_DETAILS.address);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<Order | null>(null);
  const [declined, setDeclined] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const subtotal = sim.bag.subtotal;
  const delivery = deliveryFeeCents(method, subtotal);
  const total = subtotal + delivery;

  function placeOrder() {
    setMessage(null);
    startTransition(async () => {
      const result = await startAppCheckout({
        details: { method, payment, contact, ...(method === "courier" ? { address } : {}) },
        lines: sim.state.bag.map((l) => ({ slug: l.slug, ...(l.option ? { option: l.option } : {}), qty: l.qty })),
      });
      if (result.ok) {
        setErrors({});
        setOrder(result.order);
      } else {
        setErrors(result.fields ?? {});
        setMessage(result.error);
      }
    });
  }

  function pay(outcome: "approve" | "decline") {
    if (!order) return;
    startTransition(async () => {
      const result = await completePayment(order.id, outcome);
      if (result.ok && outcome === "approve") {
        sim.clearBag();
        sim.toast("Payment approved");
        sim.replace({ kind: "order", id: order.id });
      } else {
        setDeclined(true);
      }
    });
  }

  if (sim.bag.lines.length === 0 && !order) {
    return (
      <div className="flex h-full flex-col">
        <ScreenHeader title="Checkout" onBack={sim.pop} />
        <p className="px-8 pt-20 text-center text-[14px] text-muted">Your bag is empty.</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      <ScreenHeader title="Checkout" onBack={sim.pop} />
      <div ref={pageRef} className="no-scrollbar min-h-0 flex-1 space-y-6 overflow-y-auto px-5 pb-36">
        <p className="rounded-xl bg-tint-sky px-3 py-2 text-[11px] text-ink-soft">Demo checkout: no real payment is taken.</p>

        <section className="space-y-2">
          <h2 className="text-[15px] font-bold">Delivery</h2>
          {(Object.keys(DELIVERY_OPTIONS) as FulfilmentMethod[]).map((key) => {
            const fee = deliveryFeeCents(key, subtotal);
            return (
              <Choice
                key={key}
                selected={method === key}
                onClick={() => setMethod(key)}
                title={DELIVERY_OPTIONS[key].label}
                detail={DELIVERY_OPTIONS[key].detail}
                aside={fee === 0 ? "Free" : formatRand(fee)}
              />
            );
          })}
          <p className="text-[10px] text-muted">Demo delivery rates.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[15px] font-bold">Your details</h2>
          <Input label="Full name" value={contact.name} error={errors["details.contact.name"]} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
          <Input label="Mobile number" type="tel" value={contact.phone} error={errors["details.contact.phone"]} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
        </section>

        {method === "courier" ? (
          <section className="space-y-3">
            <h2 className="text-[15px] font-bold">Delivery address</h2>
            <Input label="Street address" value={address.street} error={errors["details.address.street"]} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Suburb" value={address.suburb} error={errors["details.address.suburb"]} onChange={(e) => setAddress({ ...address, suburb: e.target.value })} />
              <Input label="City" value={address.city} error={errors["details.address.city"]} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-3">
              <label className="block">
                <span className="text-[12px] font-semibold text-ink-soft">Province</span>
                <select className={cn(field, "mt-1")} value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value })}>
                  {SA_PROVINCES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <Input label="Postal code" inputMode="numeric" maxLength={4} value={address.postalCode} error={errors["details.address.postalCode"]} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
            </div>
          </section>
        ) : null}

        <section className="space-y-2">
          <h2 className="text-[15px] font-bold">Payment</h2>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PAYMENT_OPTIONS) as PaymentMethod[]).map((key) => (
              <Choice key={key} selected={payment === key} onClick={() => setPayment(key)} title={PAYMENT_OPTIONS[key].label} detail={PAYMENT_OPTIONS[key].detail} />
            ))}
          </div>
        </section>

        <dl className="space-y-2 rounded-2xl bg-surface p-4 text-[13px] ring-1 ring-line">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal · {sim.bag.count} items</dt>
            <dd className="tabular-nums">{formatRand(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{method === "courier" ? "Delivery" : "Collection"}</dt>
            <dd className="tabular-nums">{delivery === 0 ? "Free" : formatRand(delivery)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-[15px] font-bold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatRand(total)}</dd>
          </div>
          <p className="text-right text-[10px] text-muted">Includes VAT of {formatRand(vatIncludedCents(total))}</p>
        </dl>
        {message ? <p className="text-center text-[12px] font-medium text-error">{message}</p> : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-line/70 bg-paper/85 px-5 pb-9 pt-3 backdrop-blur-xl">
        <button
          type="button"
          onClick={placeOrder}
          disabled={pending}
          className="flex h-13 w-full items-center justify-center rounded-full bg-brand py-4 text-[15px] font-semibold text-on-brand active:scale-[0.98] disabled:opacity-70"
        >
          {pending && !order ? "Placing order…" : `Pay ${formatRand(total)}`}
        </button>
      </div>

      {/* The provider's secure page, as an in-app sheet (test mode) */}
      {order ? (
        <div className="absolute inset-0 z-40 flex items-end">
          <div className="sim-fade absolute inset-0 bg-device/45" />
          <div role="dialog" aria-label="Test payment" className="sim-sheet relative w-full rounded-t-[28px] bg-surface px-6 pb-10 pt-3">
            <span aria-hidden="true" className="mx-auto block h-1.5 w-10 rounded-full bg-line-strong" />
            <div className="mt-4 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold">
                <ShieldCheckIcon className="size-4 text-success" /> Secure test payment
              </p>
              <span className="rounded-[5px] bg-ink px-1.5 py-0.5 text-[10px] font-bold text-paper">TEST MODE</span>
            </div>
            <p className="mt-5 text-[12px] text-muted">Paying Alert Stationers (demo)</p>
            <p className="text-[2.25rem] font-bold leading-tight tabular-nums">{formatRand(order.totalCents)}</p>
            <p className="text-[12px] text-muted">
              {order.id} · {PAYMENT_OPTIONS[order.payment].label}
            </p>
            {declined && !pending ? <p className="mt-4 rounded-xl bg-pink-tint px-3 py-2 text-[12px] font-medium text-error">Declined. Nothing was charged. Try again?</p> : null}
            <button
              type="button"
              onClick={() => pay("approve")}
              disabled={pending}
              className="mt-5 flex h-13 w-full items-center justify-center rounded-full bg-ink py-4 text-[15px] font-semibold text-paper disabled:opacity-70"
            >
              {pending ? "One moment…" : "Approve test payment"}
            </button>
            <button type="button" onClick={() => pay("decline")} disabled={pending} className="mt-2 w-full py-2 text-[13px] font-semibold text-muted">
              Decline (test a failed payment)
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Live tracking for one order. Re-reads it every few seconds so staff changes in admin show up. */
export function SimOrder({ id }: { id: string }) {
  const sim = useSim();
  const pageRef = useDragScroll<HTMLDivElement>("y");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () => getMyOrder(id).then((o) => alive && setOrder(o));
    load();
    const timer = window.setInterval(load, 8000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [id]);

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title={`Order ${id}`} onBack={sim.state.stack.length > 1 ? sim.pop : () => sim.setTab("account")} />
      <div ref={pageRef} className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-36">
        {order ? (
          <>
            <div className="rounded-[24px] bg-surface p-5 ring-1 ring-line">
              <OrderTracker order={order} />
            </div>
            <ul className="mt-5 divide-y divide-line rounded-[22px] bg-surface px-4 ring-1 ring-line">
              {order.lines.map((l) => (
                <li key={`${l.slug}-${l.option ?? ""}`} className="flex justify-between gap-3 py-3 text-[13px]">
                  <span className="min-w-0 truncate">
                    <span className="text-muted">{l.qty} × </span>
                    {l.name}
                  </span>
                  <span className="tabular-nums">{formatRand(l.qty * l.unitPriceCents)}</span>
                </li>
              ))}
              <li className="flex justify-between py-3 text-[14px] font-bold">
                <span>Total</span>
                <span className="tabular-nums">{formatRand(order.totalCents)}</span>
              </li>
            </ul>
            <p className="mt-4 text-[12px] leading-relaxed text-muted">
              {order.address
                ? `Delivering to ${order.contact.name}, ${order.address.street}, ${order.address.suburb}, ${order.address.city}`
                : `Collecting in store (demo) · ${order.contact.name}`}
            </p>
          </>
        ) : (
          <div className="h-80 animate-pulse rounded-[24px] bg-line/60" />
        )}
      </div>
    </div>
  );
}

/** Every order placed in this browser: the app's and the website's. */
export function SimOrders() {
  const sim = useSim();
  const pageRef = useDragScroll<HTMLDivElement>("y");
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    let alive = true;
    listMyOrders().then((o) => alive && setOrders(o));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="Orders" onBack={sim.pop} />
      <div ref={pageRef} className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-36">
        {orders === null ? (
          <div className="h-40 animate-pulse rounded-[22px] bg-line/60" />
        ) : orders.length === 0 ? (
          <p className="pt-16 text-center text-[14px] text-muted">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o.id}>
                <button type="button" onClick={() => sim.push({ kind: "order", id: o.id })} className="flex w-full items-center gap-3 rounded-[22px] bg-surface p-4 text-left ring-1 ring-line">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold">{o.id}</span>
                    <span className="block text-[11px] text-muted">
                      {o.lines.reduce((s, l) => s + l.qty, 0)} items · {o.channel === "app" ? "App" : "Website"}
                    </span>
                    <OrderStatusText order={o} className="text-[12px]" />
                  </span>
                  <span className="text-[14px] font-bold tabular-nums">{formatRand(o.totalCents)}</span>
                  <ChevronRightIcon className="size-4 text-muted" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
