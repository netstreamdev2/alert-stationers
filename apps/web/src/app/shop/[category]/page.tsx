import { categories, categoryShelves, getCategory, isCategorySlug, productsInCategory } from "@alert/core";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/product/product-card";
import { ShelfFilter } from "@/components/product/shelf-filter";
import { categoryTile } from "@/components/product/tile";
import { ArrowCircle, Breadcrumbs, Label } from "@/components/ui";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await params;
  if (!isCategorySlug(category)) return {};
  const { name, blurb } = getCategory(category);
  return { title: name, description: blurb };
}

/*
 * The page is an instant shell: the aisle reads its URL param inside Suspense, so a
 * navigation shows the skeleton at once. All six real aisles are fully prerendered
 * at build (generateStaticParams).
 *
 * Known limitation: an unknown aisle renders the branded not-found page with
 * `noindex`, but the status is 200 (a soft 404). Cache Components streams the layout
 * shell before the page runs, and `dynamicParams = false` isn't available. Before
 * launch, return a hard 404 for unknown aisles from proxy.ts.
 */
export default function AislePage({ params }: PageProps<"/shop/[category]">) {
  return (
    <div className="shell pt-4">
      <Suspense fallback={<AisleSkeleton />}>
        <Aisle params={params} />
      </Suspense>
    </div>
  );
}

function AisleSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading aisle" className="animate-pulse">
      <div className="h-4 w-40 rounded bg-line" />
      <div className="mt-6 h-[13.5rem] rounded-card bg-line/60 sm:h-[15.5rem]" />
      <div className="mt-7 flex gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-28 shrink-0 rounded-full bg-line/60" />
        ))}
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <li key={i}>
            <div className="aspect-[4/5] rounded-tile bg-line/60" />
            <div className="mt-3 h-3 w-20 rounded bg-line" />
            <div className="mt-2 h-4 w-36 rounded bg-line/80" />
          </li>
        ))}
      </ul>
    </div>
  );
}

async function Aisle({ params }: { params: PageProps<"/shop/[category]">["params"] }) {
  const { category: slug } = await params;
  if (!isCategorySlug(slug)) notFound();

  const category = getCategory(slug);
  const shelves = categoryShelves(slug);
  const count = productsInCategory(slug).length;
  const { tint, pattern } = categoryTile[slug];
  const otherAisles = categories.filter((c) => c.slug !== slug);

  return (
    <>
      <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }, { label: category.name }]} />

      <header className={cn("relative isolate mt-6 overflow-hidden rounded-card p-6 sm:p-10", tint)}>
        <span aria-hidden="true" className={cn("absolute inset-0 -z-10 [mask-image:linear-gradient(to_right,black,transparent_85%)]", pattern)} />
        <Label tone="pink">Aisle</Label>
        <h1 className="type-display mt-3 text-[2.5rem] font-extrabold leading-none sm:text-[3.5rem]">{category.name}</h1>
        <p className="mt-3 max-w-[48ch] text-[17px] text-ink-soft">{category.blurb}.</p>
        <p className="mt-6 text-[14px] font-semibold text-muted">
          {count} products on {shelves.length} shelves
        </p>
      </header>

      <div className="mt-4">
        <ShelfFilter
          label={`${category.name} shelves`}
          shelves={shelves.map((shelf) => ({ slug: shelf.slug, name: shelf.name, count: shelf.products.length }))}
          items={shelves.flatMap((shelf) =>
            shelf.products.map((product) => ({ key: product.slug, shelf: shelf.slug, card: <ProductCard product={product} /> })),
          )}
        />
      </div>

      <section aria-labelledby="other-aisles" className="mt-20">
        <h2 id="other-aisles" className="type-display text-[1.625rem] font-extrabold leading-none">
          Other aisles
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {otherAisles.map((aisle) => (
            <li key={aisle.slug}>
              <Link
                href={`/shop/${aisle.slug}`}
                className={cn("group flex items-center justify-between gap-3 rounded-tile p-4 pl-5", categoryTile[aisle.slug].tint)}
              >
                <span className="type-display text-[1.125rem] font-extrabold">{aisle.name}</span>
                <ArrowCircle />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
