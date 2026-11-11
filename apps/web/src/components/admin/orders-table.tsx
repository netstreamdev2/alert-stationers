import type { Order } from "@alert/core";
import { formatRand } from "@alert/core/money";
import Link from "next/link";
import { OrderActions } from "@/components/admin/order-actions";
import { td, th } from "@/components/admin/admin-ui";
import { dateTimeSA } from "@/components/orders/order-details";
import { OrderStatusText } from "@/components/orders/order-status-text";

/** Checkout orders (the demo keeps them in this browser's cookies). `compact` drops the fulfilment column for narrow panels. */
export function OrdersTable({ orders, actions = false, compact = false }: { orders: Order[]; actions?: boolean; compact?: boolean }) {
  if (orders.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-[15px] font-semibold">No orders yet</p>
        <p className="mt-1 text-[13px] text-muted">
          Place one on the{" "}
          <Link href="/shop" className="font-semibold text-pink underline-offset-2 hover:underline">
            website
          </Link>{" "}
          or in the{" "}
          <Link href="/app" className="font-semibold text-pink underline-offset-2 hover:underline">
            app preview
          </Link>{" "}
          and it appears here.
        </p>
      </div>
    );
  }
  return (
    <div className="-mx-5 overflow-x-auto">
      <table className={compact ? "w-full min-w-[440px]" : "w-full min-w-[640px]"}>
        <thead>
          <tr className="border-b border-line">
            <th className={`${th} pl-5`}>Order</th>
            <th className={th}>Customer</th>
            {compact ? null : <th className={th}>Fulfilment</th>}
            <th className={th}>Status</th>
            <th className={`${th} text-right`}>Total</th>
            {actions ? <th className={`${th} pr-5 text-right`}>Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {orders.map((order) => (
            <tr key={order.id} className="align-middle">
              <td className={`${td} pl-5`}>
                <Link href={`/orders/${order.id}`} className="font-semibold hover:text-pink">
                  {order.id}
                </Link>
                <p className="text-[12px] text-muted">
                  {dateTimeSA(order.placedAt)} · {order.channel === "app" ? "App" : "Website"}
                </p>
              </td>
              <td className={td}>
                <p>{order.contact.name}</p>
                <p className="text-[12px] text-muted">{itemCount(order)} {itemCount(order) === 1 ? "item" : "items"}</p>
              </td>
              {compact ? null : (
                <td className={td}>
                  {order.method === "courier" ? `Courier${order.address ? ` to ${order.address.city}` : ""}` : "Collect in store"}
                </td>
              )}
              <td className={td}>
                <OrderStatusText order={order} className="text-[14px]" />
              </td>
              <td className={`${td} text-right font-semibold tabular-nums`}>{formatRand(order.totalCents)}</td>
              {actions ? (
                <td className={`${td} pr-5`}>
                  <OrderActions order={order} />
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const itemCount = (order: Order) => order.lines.reduce((s, l) => s + l.qty, 0);
