"use client";

// Client component: light entry points only.
import type { PricedLine } from "@alert/core";
import { formatRand } from "@alert/core/money";
import {
  DELIVERY_OPTIONS,
  PAYMENT_OPTIONS,
  SA_PROVINCES,
  deliveryFeeCents,
  vatIncludedCents,
  type FulfilmentMethod,
  type PaymentMethod,
} from "@alert/core/orders";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { startCheckout } from "@/app/actions/checkout";
import { ShieldCheckIcon } from "@/components/icons";
import { ChoiceCard, Field, StepHeading, inputClass } from "./fields";

/** Fictional details for demos: a real suburb and postal code, an invented street and person. */
export const DEMO_DETAILS = {
  contact: { name: "Thandi Mokoena", phone: "082 123 4567", email: "thandi@example.com" },
  address: { street: "14 Protea Lane", suburb: "Parkhurst", city: "Johannesburg", province: "Gauteng" as const, postalCode: "2193" },
};

const emptyAddress = { street: "", suburb: "", city: "", province: "Gauteng" as string, postalCode: "" };

export function CheckoutForm({ lines, subtotalCents }: { lines: PricedLine[]; subtotalCents: number }) {
  const router = useRouter();
  const [method, setMethod] = useState<FulfilmentMethod>("courier");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [address, setAddress] = useState(emptyAddress);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const delivery = deliveryFeeCents(method, subtotalCents);
  const total = subtotalCents + delivery;
  const freeFrom = DELIVERY_OPTIONS.courier.freeFromCents;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    startTransition(async () => {
      const result = await startCheckout({ method, payment, contact, ...(method === "courier" ? { address } : {}) });
      if (result.ok) {
        router.push(`/checkout/pay/${result.order.id}`);
        return;
      }
      setErrors(result.fields ?? {});
      setFormError(result.error);
    });
  }

  function fillDemo() {
    setContact(DEMO_DETAILS.contact);
    setAddress(DEMO_DETAILS.address);
    setErrors({});
  }

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14">
      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-tint-sky px-5 py-4">
          <p className="text-[14px] text-ink-soft">Demo checkout: no real payment is taken.</p>
          <button type="button" onClick={fillDemo} className="text-[14px] font-semibold text-pink underline-offset-4 hover:underline">
            Use demo details
          </button>
        </div>

        <section aria-labelledby="step-delivery">
          <div id="step-delivery">
            <StepHeading n={1} title="Delivery or collection" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {(Object.keys(DELIVERY_OPTIONS) as FulfilmentMethod[]).map((key) => {
              const fee = deliveryFeeCents(key, subtotalCents);
              return (
                <ChoiceCard
                  key={key}
                  name="method"
                  value={key}
                  checked={method === key}
                  onChange={(v) => setMethod(v as FulfilmentMethod)}
                  title={DELIVERY_OPTIONS[key].label}
                  detail={DELIVERY_OPTIONS[key].detail}
                  aside={fee === 0 ? "Free" : formatRand(fee)}
                />
              );
            })}
          </div>
          {method === "courier" && freeFrom && delivery > 0 ? (
            <p className="mt-2 text-[13px] text-pink">Add {formatRand(freeFrom - subtotalCents)} more for free delivery.</p>
          ) : null}
          <p className="mt-2 text-[12px] text-muted">Demo delivery rates, not Alert Stationers&rsquo; final pricing.</p>
        </section>

        <section aria-labelledby="step-details">
          <div id="step-details">
            <StepHeading n={2} title="Your details" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors["contact.name"]} className="sm:col-span-2">
              {(p) => <input {...p} className={inputClass} autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />}
            </Field>
            <Field label="Mobile number" error={errors["contact.phone"]} hint="For delivery updates">
              {(p) => <input {...p} className={inputClass} type="tel" autoComplete="tel" inputMode="tel" placeholder="082 123 4567" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />}
            </Field>
            <Field label="Email (optional)" error={errors["contact.email"]}>
              {(p) => <input {...p} className={inputClass} type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />}
            </Field>
          </div>
        </section>

        {method === "courier" ? (
          <section aria-labelledby="step-address">
            <div id="step-address">
              <StepHeading n={3} title="Delivery address" />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Street address" error={errors["address.street"]} className="sm:col-span-2">
                {(p) => <input {...p} className={inputClass} autoComplete="address-line1" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />}
              </Field>
              <Field label="Suburb" error={errors["address.suburb"]}>
                {(p) => <input {...p} className={inputClass} autoComplete="address-level3" value={address.suburb} onChange={(e) => setAddress({ ...address, suburb: e.target.value })} />}
              </Field>
              <Field label="City or town" error={errors["address.city"]}>
                {(p) => <input {...p} className={inputClass} autoComplete="address-level2" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />}
              </Field>
              <Field label="Province" error={errors["address.province"]}>
                {(p) => (
                  <select {...p} className={inputClass} autoComplete="address-level1" value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value })}>
                    {SA_PROVINCES.map((province) => (
                      <option key={province}>{province}</option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="Postal code" error={errors["address.postalCode"]}>
                {(p) => <input {...p} className={inputClass} inputMode="numeric" autoComplete="postal-code" maxLength={4} value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />}
              </Field>
            </div>
          </section>
        ) : null}

        <section aria-labelledby="step-payment">
          <div id="step-payment">
            <StepHeading n={method === "courier" ? 4 : 3} title="Payment" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(Object.keys(PAYMENT_OPTIONS) as PaymentMethod[]).map((key) => (
              <ChoiceCard
                key={key}
                name="payment"
                value={key}
                checked={payment === key}
                onChange={(v) => setPayment(v as PaymentMethod)}
                title={PAYMENT_OPTIONS[key].label}
                detail={PAYMENT_OPTIONS[key].detail}
              />
            ))}
          </div>
          <p className="mt-3 flex items-center gap-2 text-[13px] text-muted">
            <ShieldCheckIcon className="size-[18px] text-success" />
            You&rsquo;ll pay on a secure payment page. Card details never touch our servers.
          </p>
        </section>
      </div>

      <aside aria-labelledby="summary-title" className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-card border border-line bg-surface p-6">
          <h2 id="summary-title" className="type-display text-[1.375rem] font-extrabold">
            Order summary
          </h2>
          <ul className="mt-4 max-h-64 space-y-2.5 overflow-y-auto pr-1 text-[14px]">
            {lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="text-muted tabular-nums">{line.qty} × </span>
                  {line.name}
                  {line.optionLabel ? <span className="text-muted"> · {line.optionLabel}</span> : null}
                </span>
                <span className="shrink-0 tabular-nums">{formatRand(line.lineTotalCents)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-[15px]">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="tabular-nums">{formatRand(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">{method === "courier" ? "Delivery" : "Collection"}</dt>
              <dd className="tabular-nums">{delivery === 0 ? "Free" : formatRand(delivery)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <p className="font-semibold">Total</p>
            <p className="text-[1.5rem] font-bold tabular-nums">{formatRand(total)}</p>
          </div>
          <p className="mt-1 text-right text-[12px] text-muted">Includes VAT of {formatRand(vatIncludedCents(total))}</p>
          <button
            type="submit"
            disabled={pending}
            className="mt-6 flex h-14 w-full items-center justify-center rounded-full bg-ink text-[16px] font-semibold text-paper transition-colors hover:bg-ink-soft disabled:opacity-70"
          >
            {pending ? "Placing your order…" : `Continue to payment · ${formatRand(total)}`}
          </button>
          {formError ? (
            <p role="alert" className="mt-3 text-center text-[13px] font-medium text-error">
              {formError}
            </p>
          ) : null}
        </div>
      </aside>
    </form>
  );
}
