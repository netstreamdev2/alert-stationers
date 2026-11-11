import { formatRand, getCategory, products, totalStock, unitPriceCents } from "@alert/core";
import { historyForSku, marginShare, skusForProduct, supplierFor } from "@alert/core/inventory";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Panel, StockTag, td, th } from "@/components/admin/admin-ui";
import { StockLine } from "@/components/admin/stock-line";
import { dateTimeSA } from "@/components/orders/order-details";
import { categoryTile } from "@/components/product/tile";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/admin/inventory/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  return product ? { title: product.name } : {};
}

const movementLabels = {
  opening: "Opening stock",
  receive: "Received",
  sale: "Sold",
  return: "Returned",
  adjust: "Adjustment",
  stocktake: "Stocktake",
} as const;

export default function AdminProductPage({ params, searchParams }: PageProps<"/admin/inventory/[slug]">) {
  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin/inventory" className="text-[13px] font-semibold text-ink-soft hover:text-pink">
        ← Inventory
      </Link>
      <Suspense fallback={<div aria-busy="true" className="mt-4 h-96 animate-pulse rounded-2xl bg-line/50" />}>
        <ProductStock params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ProductStock({
  params,
  searchParams,
}: {
  params: PageProps<"/admin/inventory/[slug]">["params"];
  searchParams: PageProps<"/admin/inventory/[slug]">["searchParams"];
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const units = skusForProduct(slug);
  const selected = units.find((s) => s.sku === query.sku) ?? units[0]!;
  const history = historyForSku(selected.sku);
  const supplier = supplierFor(product);
  const category = getCategory(product.category);
  const points = history.map((m) => ({ at: m.at, balance: m.balance })).reverse();

  return (
    <div className="mt-4 space-y-6">
      <div className="flex flex-wrap items-center gap-5">
        <span className={cn("relative size-20 shrink-0 overflow-hidden rounded-2xl", categoryTile[product.category].tint)}>
          {product.image ? <Image src={product.image} alt="" fill sizes="80px" className="object-contain p-2" /> : null}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
            {category.name} · {product.brand}
          </p>
          <h1 className="type-display mt-1 text-[1.75rem] font-extrabold leading-tight">{product.name}</h1>
          <p className="mt-1 text-[13px] text-muted">
            {product.sku} · Bin {product.binLocation} ·{" "}
            <Link href={`/product/${product.slug}`} className="font-semibold text-pink hover:underline">
              View in shop
            </Link>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="On hand" value={String(totalStock(product))} note={units.length > 1 ? `Across ${units.length} ${product.options?.kind === "colour" ? "colours" : "packs"}` : "One stock-keeping unit"} />
        <Fact label="Price" value={formatRand(product.priceCents)} note={product.special ? `On special at ${formatRand(product.special.priceCents)}` : "Incl. VAT"} />
        <Fact label="Cost" value={formatRand(product.costPriceCents)} note={`Ex VAT · ${Math.round(marginShare(product) * 100)}% margin`} />
        <Fact label="Supplier" value={supplier?.name ?? "—"} note={supplier ? `${supplier.leadTimeDays}-day lead time` : undefined} small />
      </div>

      {units.length > 1 ? (
        <Panel title={product.options?.kind === "colour" ? "Colours" : "Packs"}>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((s) => {
              const isSelected = s.sku === selected.sku;
              return (
                <li key={s.sku}>
                  <Link
                    href={`/admin/inventory/${product.slug}?sku=${encodeURIComponent(s.sku)}`}
                    scroll={false}
                    aria-current={isSelected ? "true" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors",
                      isSelected ? "border-ink bg-paper" : "border-line hover:border-line-strong",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-semibold">{s.optionLabel}</span>
                      <span className="block text-[12px] text-muted">
                        {s.sku} · {formatRand(unitPriceCents(product, s.option))}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <StockTag stock={s.stock} reorder={s.stock <= s.reorderPoint} />
                      <span className="text-[16px] font-bold tabular-nums">{s.stock}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>
      ) : null}

      <Panel title={units.length > 1 ? `Stock movements · ${selected.optionLabel}` : "Stock movements"}>
        <p className="mb-5 text-[13px] text-muted">
          Reorder {selected.reorderQty} when stock reaches {selected.reorderPoint}. Stock only ever changes through this log: receipts, sales, returns and
          stocktakes.
        </p>
        <StockLine points={points} reorderPoint={selected.reorderPoint} label={selected.optionLabel ?? product.name} />
        <div className="-mx-5 mt-6 max-h-[28rem] overflow-auto border-t border-line">
          <table className="w-full min-w-[560px]">
            <caption className="sr-only">Every stock movement, newest first, with the balance after it</caption>
            <thead className="sticky top-0 bg-surface">
              <tr className="border-b border-line">
                <th className={`${th} pl-5`}>When</th>
                <th className={th}>Movement</th>
                <th className={th}>Reference</th>
                <th className={`${th} text-right`}>Change</th>
                <th className={`${th} pr-5 text-right`}>Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {history.map((m) => (
                <tr key={m.id}>
                  <td className={`${td} pl-5 whitespace-nowrap text-muted`}>{dateTimeSA(m.at)}</td>
                  <td className={td}>{movementLabels[m.type]}</td>
                  <td className={`${td} text-muted`}>{m.reference}</td>
                  <td className={cn(td, "text-right font-semibold tabular-nums", m.qty > 0 ? "text-success" : "text-ink")}>
                    {m.qty > 0 ? `+${m.qty}` : m.qty}
                  </td>
                  <td className={`${td} pr-5 text-right tabular-nums`}>{m.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function Fact({ label, value, note, small }: { label: string; value: string; note?: string | undefined; small?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-[13px] font-medium text-muted">{label}</p>
      <p className={cn("mt-1.5 font-bold leading-tight tabular-nums", small ? "text-[1rem]" : "text-[1.5rem]")}>{value}</p>
      {note ? <p className="mt-1.5 text-[12px] text-muted">{note}</p> : null}
    </div>
  );
}
