import { getProducts } from "@alert/core";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui";

export function ProductSection({
  id,
  eyebrow,
  title,
  href,
  linkLabel,
  slugs,
}: {
  id: string;
  eyebrow: string;
  title: string;
  href: string;
  linkLabel: string;
  slugs: readonly string[];
}) {
  return (
    <section aria-labelledby={id} className="reveal shell mt-16 lg:mt-24">
      <SectionHeading id={id} eyebrow={eyebrow} title={title} href={href} linkLabel={linkLabel} />
      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-4">
        {getProducts(slugs).map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
