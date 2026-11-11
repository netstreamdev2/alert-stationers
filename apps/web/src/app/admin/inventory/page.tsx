import { categories, formatRand, isCategorySlug, priceRangeCents, products, totalStock, type Product } from "@alert/core";
import { marginShare, skus } from "@alert/core/inventory";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AdminHeading, StockTag, td, th } from "@/components/admin/admin-ui";
import { categoryTile } from "@/components/product/tile";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Inventory" };

const filters = [
  { key: "all", label: "All stock" },
  { key: "reorder", label: "Needs reorder" },
  { key: "low", label: "Low or sold out" },
] as const;
type FilterKey = (typeof filters)[number]["key"];

const needsReorder = (p: Product) => skus.some((s) => s.product.slug === p.slug && s.stock <= s.reorderPoint);
const stockValue = (p: Product) =>
  p.options ? p.options.values.reduce((sum, o) => sum + o.stock * (o.costPriceCents ?? p.costPriceCents), 0) : (p.stock ?? 0) * p.costPriceCents;

export default function InventoryPage({ searchParams }: PageProps<"/admin/inventory">) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminHeading eyebrow="Stock" title="Inventory" />
      <Suspense fallback={<div aria-busy="true" className="h-96 animate-pulse rounded-2xl bg-line/50" />}>
        <InventoryTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function InventoryTable({ searchParams }: { searchParams: PageProps<"/admin/inventory">["searchParams"] }) {
  const params = await searchParams;
  const aisle = typeof params.aisle === "string" && isCategorySlug(params.aisle) ? params.aisle : undefined;
  const filter: FilterKey = filters.some((f) => f.key === params.filter) ? (params.filter as FilterKey) : "all";

  const rows = products
    .filter((p) => !aisle || p.category === aisle)
    .filter((p) => (filter === "reorder" ? needsReorder(p) : filter === "low" ? totalStock(p) <= 5 : true))
    .sort((a, b) => totalStock(a) - totalStock(b) || a.name.localeCompare(b.name));

  const href = (next: { aisle?: string | undefined; filter?: FilterKey }) => {
    const q = new URLSearchParams();
    const a = "aisle" in next ? next.aisle : aisle;
    const f = next.filter ?? filter;
    if (a) q.set("aisle", a);
    if (f !== "all") q.set("filter", f);
    const s = q.toString();
    return s ? `/admin/inventory?${s}` : "/admin/inventory";
  };
  const chip = (active: boolean) =>
    cn(
      "inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-[13px] font-semibold transition-colors",
      active ? "border-ink bg-ink text-paper" : "border-line-strong bg-surface text-ink-soft hover:border-ink",
    );

  return (
    <>
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Aisle">
          <Link href={href({ aisle: undefined })} className={chip(!aisle)} aria-current={!aisle ? "true" : undefined}>
            All aisles
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={href({ aisle: c.slug })} className={chip(aisle === c.slug)} aria-current={aisle === c.slug ? "true" : undefined}>
              {c.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Stock level">
          {filters.map((f) => (
            <Link key={f.key} href={href({ filter: f.key })} className={chip(filter === f.key)} aria-current={filter === f.key ? "true" : undefined}>
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      <section className="rounded-2xl border border-line bg-surface" aria-label="Products">
        <p className="border-b border-line px-5 py-3 text-[13px] text-muted">
          {rows.length} {rows.length === 1 ? "product" : "products"}, emptiest first. Cost and margin are ex VAT and never reach the shop.
        </p>
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-[15px] font-semibold">Nothing matches these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="border-b border-line">
                  <th className={`${th} pl-5`}>Product</th>
                  <th className={`${th} text-right`}>On hand</th>
                  <th className={`${th} text-right`}>Reorder at</th>
                  <th className={`${th} text-right`}>Price</th>
                  <th className={`${th} text-right`}>Cost</th>
                  <th className={`${th} text-right`}>Margin</th>
                  <th className={`${th} pr-5 text-right`}>Stock value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((p) => {
                  const stock = totalStock(p);
                  const range = priceRangeCents(p);
                  return (
                    <tr key={p.slug} className="hover:bg-paper/60">
                      <td className={`${td} pl-5`}>
                        <Link href={`/admin/inventory/${p.slug}`} className="group flex items-center gap-3">
                          <span className={cn("relative size-11 shrink-0 overflow-hidden rounded-lg", categoryTile[p.category].tint)}>
                            {p.image ? <Image src={p.image} alt="" fill sizes="44px" className="object-contain p-1" /> : null}
                          </span>
                          <span className="min-w-0">
                            <span className="block max-w-72 truncate font-semibold group-hover:text-pink">{p.name}</span>
                            <span className="block text-[12px] text-muted">
                              {p.sku} · Bin {p.binLocation}
                              {p.options ? ` · ${p.options.values.length} ${p.options.kind === "colour" ? "colours" : "packs"}` : ""}
                            </span>
                          </span>
                        </Link>
                      </td>
                      <td className={`${td} text-right`}>
                        <span className="inline-flex items-center gap-2">
                          <StockTag stock={stock} reorder={needsReorder(p)} />
                          <span className="font-semibold tabular-nums">{stock}</span>
                        </span>
                      </td>
                      <td className={`${td} text-right tabular-nums text-muted`}>{p.reorderPoint}</td>
                      <td className={`${td} text-right tabular-nums`}>
                        {range.min === range.max ? formatRand(range.min) : `${formatRand(range.min)}+`}
                      </td>
                      <td className={`${td} text-right tabular-nums text-muted`}>{formatRand(p.costPriceCents)}</td>
                      <td className={`${td} text-right tabular-nums`}>{Math.round(marginShare(p) * 100)}%</td>
                      <td className={`${td} pr-5 text-right tabular-nums`}>{formatRand(stockValue(p))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
