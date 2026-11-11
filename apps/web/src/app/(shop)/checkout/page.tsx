import { priceBag } from "@alert/core";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Breadcrumbs, Label } from "@/components/ui";
import { readBag } from "@/lib/bag-store";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="shell pt-4">
      <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/bag", label: "Bag" }, { label: "Checkout" }]} />
      <Label className="mt-6">Checkout</Label>
      <h1 className="type-display mt-3 text-[2.5rem] font-extrabold leading-none">
        Almost <span className="type-accent text-pink">yours.</span>
      </h1>
      <div className="mt-8">
        <Suspense fallback={<div aria-busy="true" className="h-96 animate-pulse rounded-card bg-line/50" />}>
          <CheckoutContents />
        </Suspense>
      </div>
    </div>
  );
}

async function CheckoutContents() {
  const bag = priceBag(await readBag());
  if (bag.lines.length === 0) redirect("/bag");
  return <CheckoutForm lines={bag.lines} subtotalCents={bag.subtotalCents} />;
}
