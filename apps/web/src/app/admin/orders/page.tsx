import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminHeading, Panel } from "@/components/admin/admin-ui";
import { OrdersTable } from "@/components/admin/orders-table";
import { readOrders } from "@/lib/order-store";

export const metadata: Metadata = { title: "Orders" };

export default function AdminOrders() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminHeading eyebrow="Fulfilment" title="Orders" />
      <p className="max-w-2xl text-[14px] text-muted">
        Tracking moves on by itself every two minutes in this demo. Move an order on by hand to show the customer&rsquo;s tracking page and the app updating. The
        real admin records each change, with who made it, in the order&rsquo;s history.
      </p>
      <Panel title="Checkout orders">
        <Suspense fallback={<div aria-busy="true" className="h-40 animate-pulse rounded-xl bg-line/50" />}>
          <AllOrders />
        </Suspense>
      </Panel>
    </div>
  );
}

async function AllOrders() {
  return <OrdersTable orders={await readOrders()} actions />;
}
