import { getCategory, products, toPublicProduct } from "@alert/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductGrid } from "@/components/product/product-grid";
import { categoryTile } from "@/components/product/tile";
import { Breadcrumbs, SectionHeading } from "@/components/ui";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

/*
 * Same pattern as the aisle pages: an instant shell, the URL param read inside Suspense,
 * and all 120 products prerendered at build. Unknown slugs show the branded not-found
 * page (status 200 until proxy.ts adds hard 404s; see shop/[category]/page.tsx).
 */
export default function ProductPage({ params }: PageProps<"/product/[slug]">) {
  return (
    <div className="shell pt-4">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductView params={params} />
      </Suspense>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product" className="animate-pulse">
      <div className="h-4 w-56 rounded bg-line" />
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="aspect-square rounded-card bg-line/60" />
        <div>
          <div className="h-3 w-24 rounded bg-line" />
          <div className="mt-3 h-10 w-4/5 rounded bg-line/80" />
          <div className="mt-6 h-8 w-32 rounded bg-line/80" />
          <div className="mt-10 h-14 w-full rounded-full bg-line/60" />
        </div>
      </div>
    </div>
  );
}

async function ProductView({ params }: { params: PageProps<"/product/[slug]">["params"] }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const shelf = category.subcategories.find((s) => s.slug === product.subcategory);
  const { tint, pattern } = categoryTile[product.category];
  const sameShelf = products.filter((p) => p.subcategory === product.subcategory && p.slug !== product.slug);
  const sameAisle = products.filter((p) => p.category === product.category && p.subcategory !== product.subcategory);
  const related = [...sameShelf, ...sameAisle].slice(0, 4);

  return (
    <>
      <Breadcrumbs
        trail={[
          { href: "/", label: "Home" },
          { href: "/shop", label: "Shop" },
          { href: `/shop/${category.slug}`, label: category.name },
          { label: product.name },
        ]}
      />

      <div className="mt-6">
        <ProductDetail product={toPublicProduct(product)} tintClass={tint} patternClass={pattern}>
          <div className="mt-10 border-t border-line pt-8">
            <h2 className="type-display text-[1.375rem] font-extrabold">About this product</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{product.description}</p>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-6 py-3 text-[14px]">
                  <dt className="text-muted">{spec.label}</dt>
                  <dd className="text-right font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[13px] text-muted">
              {category.name}
              {shelf ? ` · ${shelf.name}` : ""} · {product.brand}
            </p>
          </div>
        </ProductDetail>
      </div>

      {related.length ? (
        <section aria-labelledby="related-title" className="mt-20">
          <SectionHeading id="related-title" eyebrow={category.name} title="From the same shelf" href={`/shop/${category.slug}`} linkLabel={`All ${category.name}`} />
          <ProductGrid products={related} className="mt-6" />
        </section>
      ) : null}
    </>
  );
}
