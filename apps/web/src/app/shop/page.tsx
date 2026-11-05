import { categories, products, productsInCategory } from "@alert/core";
import type { Metadata } from "next";
import { AisleGrid } from "@/components/home/aisles";
import { ProductGrid } from "@/components/product/product-grid";
import { Breadcrumbs, Label, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Shop everything",
  description: "Stationery for school, office and everything creative, aisle by aisle.",
};

export default function ShopPage() {
  return (
    <div className="shell pt-4">
      <Breadcrumbs trail={[{ href: "/", label: "Home" }, { label: "Shop" }]} />

      <header className="mt-6">
        <Label>Shop everything</Label>
        <h1 className="type-display mt-3 text-[2.5rem] font-extrabold leading-none sm:text-[3.25rem]">
          Every aisle, <span className="type-accent text-pink">one shop.</span>
        </h1>
        <p className="mt-4 text-[17px] text-ink-soft">
          {products.length} products across {categories.length} aisles, with stock shown live.
        </p>
      </header>

      <AisleGrid className="mt-8" />

      {categories.map((category) => {
        const inAisle = productsInCategory(category.slug);
        return (
          <section key={category.slug} aria-labelledby={`aisle-${category.slug}`} className="reveal mt-16 lg:mt-20">
            <SectionHeading
              id={`aisle-${category.slug}`}
              eyebrow={`${inAisle.length} products`}
              title={category.name}
              href={`/shop/${category.slug}`}
              linkLabel={`See all ${category.name}`}
            />
            <ProductGrid products={inAisle.slice(0, 4)} className="mt-6" />
          </section>
        );
      })}
    </div>
  );
}
