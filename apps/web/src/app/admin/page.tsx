import { formatRand } from "@alert/core";
import { historyEndsAt, inventorySummary, reorderList, salesByDay } from "@alert/core/inventory";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminHeading, Panel, Stat, td, th } from "@/components/admin/admin-ui";
import { OrdersTable } from "@/components/admin/orders-table";
import { SalesChart } from "@/components/admin/sales-chart";
import { dateTimeSA } from "@/components/orders/order-details";
import { readOrders } from "@/lib/order-store";

export const metadata: Metadata = { title: "Overview" };

export default function AdminOverview() {
  const summary = inventorySummary();
  const sales = salesByDay(30);
  const reorder = reorderList();
  const asOf = dateTimeSA(historyEndsAt).split(",")[0];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminHeading eyebrow={`Stock as of ${asOf}`} title="Overview" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Stock value" value={formatRand(summary.stockValueCents)} note={`${summary.unitsOnHand.toLocaleString("en-ZA")} units at cost, ex VAT`} />
        <Stat label="Products" value={String(summary.products)} note={`${summary.skus} stock-keeping units incl. colours and packs`} />
        <Stat label="Need reordering" value={String(summary.needsReorder)} note="Stock-keeping units at or below their reorder point" tone="warning" />
        <Stat label="Low or sold out" value={`${summary.lowStock} / ${summary.soldOut}`} note="Products with 5 or fewer left / none left" tone="pink" />
      </div>

      <Panel title="Sales, last 30 days">
        <SalesChart data={sales} />
      </Panel>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel
          title="Reorder list"
          action={
            <Link href="/admin/inventory?filter=reorder" className="text-[13px] font-semibold text-pink hover:underline">
              See all {reorder.length}
            </Link>
          }
        >
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-line">
                  <th className={`${th} pl-5`}>Item</th>
                  <th className={`${th} text-right`}>On hand</th>
                  <th className={`${th} text-right`}>Order</th>
                  <th className={`${th} pr-5`}>Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {reorder.slice(0, 8).map((s) => (
                  <tr key={s.sku}>
                    <td className={`${td} pl-5`}>
                      <Link href={`/admin/inventory/${s.product.slug}`} className="font-semibold hover:text-pink">
                        {s.product.name}
                      </Link>
                      <p className="text-[12px] text-muted">
                        {s.sku}
                        {s.optionLabel ? ` · ${s.optionLabel}` : ""}
                      </p>
                    </td>
                    <td className={`${td} text-right tabular-nums`}>
                      <span className={s.stock === 0 ? "font-semibold text-error" : ""}>{s.stock}</span>
                      <span className="text-muted"> / {s.reorderPoint}</span>
                    </td>
                    <td className={`${td} text-right tabular-nums`}>{s.reorderQty}</td>
                    <td className={`${td} pr-5`}>
                      <p className="max-w-40 truncate">{s.supplier?.name ?? "—"}</p>
                      {s.supplier ? <p className="text-[12px] text-muted">{s.supplier.leadTimeDays}-day lead time</p> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Recent orders"
          action={
            <Link href="/admin/orders" className="text-[13px] font-semibold text-pink hover:underline">
              Manage orders
            </Link>
          }
        >
          <Suspense fallback={<div aria-busy="true" className="h-40 animate-pulse rounded-xl bg-line/50" />}>
            <RecentOrders />
          </Suspense>
        </Panel>
      </div>
    </div>
  );
}

async function RecentOrders() {
  const orders = await readOrders();
  return <OrdersTable orders={orders.slice(0, 5)} compact />;
}
