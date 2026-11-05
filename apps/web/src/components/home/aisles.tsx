import { categories, productsInCategory } from "@alert/core";
import Link from "next/link";
import { categoryTile } from "@/components/product/tile";
import { ArrowCircle, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/cn";

export function Aisles() {
  return (
    <section aria-labelledby="aisles-title" className="reveal shell mt-16 lg:mt-24">
      <SectionHeading id="aisles-title" eyebrow="Browse" title="Shop by aisle" href="/shop" linkLabel="All aisles" />
      <AisleGrid className="mt-6" />
    </section>
  );
}

/** The six aisle tiles, each in its own tint and paper texture. */
export function AisleGrid({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6", className)}>
        {categories.map((category) => {
          const { tint, pattern } = categoryTile[category.slug];
          const count = productsInCategory(category.slug).length;
          return (
            <li key={category.slug}>
              <Link
                href={`/shop/${category.slug}`}
                className={cn(
                  "group relative isolate flex aspect-[4/5] flex-col overflow-hidden rounded-card p-4 sm:aspect-square sm:p-5 xl:aspect-[4/5]",
                  tint,
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]", pattern)}
                />
                <ArrowCircle className="self-end" />
                <div className="mt-auto">
                  <h3 className="type-display text-[1.375rem] font-extrabold leading-[1.05] sm:text-2xl">{category.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-ink-soft">{category.blurb}</p>
                  <p className="mt-3 text-[12px] font-semibold text-muted">{count} products</p>
                </div>
              </Link>
            </li>
          );
        })}
    </ul>
  );
}
