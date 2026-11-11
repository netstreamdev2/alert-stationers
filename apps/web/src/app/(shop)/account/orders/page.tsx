import { formatRand } from "@alert/core";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRightIcon } from "@/components/icons";
import { dateTimeSA, lineImage } from "@/components/orders/order-details";
import { OrderStatusText } from "@/components/orders/order-status-text";
import { Breadcrumbs, ButtonLink, Label } from "@/components/ui";
import { cn } from "@/lib/cn";
import { readOrders } from "@/lib/order-store";

export const metadata: Metadata = { title: "Your orders", robots: { index: false, follow: false } };

export default function OrdersPage() {
  return (
    <div className="shell pt-4">
      <Breadcrumbs trail={[{ href: "/", label: "Home" }, { label: "Orders" }]} />
      <Label className="mt-6">Your account</Label>
      <h1 className="type-display mt-3 text-[2.5rem] font-extrabold leading-none">Orders</h1>
      <p className="mt-3 text-[15px] text-muted">Orders placed in this browser, on the website or in the app preview.</p>
      <Suspense fallback={<div aria-busy="true" className="mt-8 h-64 animate-pulse rounded-card bg-line/50" />}>
        <OrderList />
      </Suspense>
    </div>
  );
}

async function OrderList() {
  const orders = await readOrders();
  if (orders.length === 0) {
    return (
      <div className="mt-10 rounded-card border border-line bg-surface p-10 text-center">
        <p className="type-display text-[1.75rem] font-extrabold">
          No orders <span className="type-accent text-pink">yet.</span>
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/shop">Start shopping</ButtonLink>
        </div>
      </div>
    );
  }
  return (
    <ul className="mt-8 space-y-3">
      {orders.map((order) => (
        <li key={order.id}>
          <Link href={`/orders/${order.id}`} className="group flex items-center gap-5 rounded-card border border-line bg-surface p-5 transition-shadow hover:shadow-lift">
            <div className="flex -space-x-3">
              {order.lines.slice(0, 3).map((line) => {
                const { src, tint } = lineImage(line);
                return (
                  <span key={`${line.slug}-${line.option ?? ""}`} className={cn("relative size-14 overflow-hidden rounded-xl ring-2 ring-surface", tint)}>
                    {src ? <Image src={src} alt="" fill sizes="56px" className="object-contain p-1" /> : null}
                  </span>
                );
              })}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">
                {order.id} <span className="font-normal text-muted">· {order.channel === "app" ? "App" : "Website"}</span>
              </p>
              <p className="text-[13px] text-muted">
                {dateTimeSA(order.placedAt)} · {order.lines.reduce((s, l) => s + l.qty, 0)} items
              </p>
              <OrderStatusText order={order} className="text-[14px]" />
            </div>
            <p className="text-[16px] font-bold tabular-nums">{formatRand(order.totalCents)}</p>
            <ChevronRightIcon className="size-5 text-muted transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
