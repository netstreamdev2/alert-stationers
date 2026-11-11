import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OrderFacts, OrderLines, OrderTotals } from "@/components/orders/order-details";
import { OrderTracker } from "@/components/orders/order-tracker";
import { Breadcrumbs, ButtonLink, Label } from "@/components/ui";
import { readOrder } from "@/lib/order-store";

export const metadata: Metadata = { title: "Your order", robots: { index: false, follow: false } };

export default function OrderPage({ params }: PageProps<"/orders/[id]">) {
  return (
    <div className="shell pt-4">
      <Suspense fallback={<div aria-busy="true" className="mt-8 h-96 animate-pulse rounded-card bg-line/50" />}>
        <OrderView params={params} />
      </Suspense>
    </div>
  );
}

async function OrderView({ params }: { params: PageProps<"/orders/[id]">["params"] }) {
  const { id } = await params;
  const order = await readOrder(id);
  if (!order) notFound();

  return (
    <>
      <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/account/orders", label: "Orders" }, { label: order.id }]} />
      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14">
        <section aria-label="Tracking">
          <Label>Order {order.id}</Label>
          <div className="mt-4 rounded-card border border-line bg-surface p-6 sm:p-8">
            <OrderTracker order={order} />
            {!order.paidAt && !order.cancelledAt ? (
              <div className="mt-6">
                <ButtonLink href={`/checkout/pay/${order.id}`}>{order.failedAt ? "Try paying again" : "Pay now"}</ButtonLink>
              </div>
            ) : null}
          </div>
          <div className="mt-8">
            <OrderFacts order={order} />
          </div>
        </section>
        <aside aria-label="Items" className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-card border border-line bg-surface p-6">
            <h2 className="type-display text-[1.375rem] font-extrabold">Items</h2>
            <div className="mt-2">
              <OrderLines order={order} />
            </div>
            <div className="mt-4 border-t border-line pt-4">
              <OrderTotals order={order} />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
