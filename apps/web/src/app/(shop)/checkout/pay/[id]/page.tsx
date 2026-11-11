import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { MockGateway } from "@/components/checkout/mock-gateway";
import { readOrder } from "@/lib/order-store";

export const metadata: Metadata = { title: "Payment", robots: { index: false, follow: false } };

export default function PayPage({ params }: PageProps<"/checkout/pay/[id]">) {
  return (
    <div className="shell py-10 lg:py-16">
      <Suspense fallback={<div aria-busy="true" className="mx-auto h-[30rem] max-w-md animate-pulse rounded-[28px] bg-line/50" />}>
        <Gateway params={params} />
      </Suspense>
    </div>
  );
}

async function Gateway({ params }: { params: PageProps<"/checkout/pay/[id]">["params"] }) {
  const { id } = await params;
  const order = await readOrder(id);
  if (!order) notFound();
  if (order.paidAt) redirect(`/orders/${order.id}`);
  return <MockGateway id={order.id} totalCents={order.totalCents} payment={order.payment} declined={Boolean(order.failedAt)} />;
}
