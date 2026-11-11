import { categories, getProduct, getSchoolList, products, toPublicProduct } from "@alert/core";
import type { Metadata } from "next";
import { AppSimulator } from "@/components/app-sim/app-simulator";
import type { SimData } from "@/components/app-sim/sim-store";
import { CheckIcon } from "@/components/icons";
import { Breadcrumbs, Label } from "@/components/ui";

export const metadata: Metadata = {
  title: "Try the app",
  description: "A working preview of the Alert Stationers app, in your browser.",
};

const tips = [
  "Swipe through the intro, then continue as a guest",
  "Tap + on any product, or open one to choose a colour",
  "Tap the pink Scan button to add a whole school list",
];

export default function AppPreviewPage() {
  const list = getSchoolList("protea-heights-grade-4");
  // Only the shopper-safe product view crosses into the preview (no cost prices or supplier data).
  const data: SimData = {
    products: products.map(toPublicProduct),
    categories: categories.map((c) => ({ slug: c.slug, name: c.name, blurb: c.blurb, subcategories: c.subcategories })),
    list: {
      school: list.school,
      grade: list.grade,
      items: list.items.map((item) => ({
        slug: item.product,
        ...(item.option ? { option: item.option } : {}),
        qty: item.qty,
        name: getProduct(item.product).name,
      })),
    },
  };

  return (
    <div className="shell pt-4">
      <Breadcrumbs trail={[{ href: "/", label: "Home" }, { label: "The app" }]} />
      <div className="mt-4 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-6">
        <div className="lg:pt-24">
          <Label>The Alert Stationers app</Label>
          <h1 className="type-display mt-3 text-[2.5rem] font-extrabold leading-[1] sm:text-[3.25rem]">
            Take the app <span className="type-accent text-pink">for a spin.</span>
          </h1>
          <p className="mt-5 max-w-[42ch] text-[17px] leading-relaxed text-ink-soft">
            This is a working preview of the app, right in your browser. Shop the real catalogue, scan a school list, and fill a bag. Checkout is switched off in
            the preview.
          </p>
          <ul className="mt-7 space-y-3">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-3 text-[15px]">
                <CheckIcon className="mt-0.5 size-5 shrink-0 text-pink" strokeWidth={2.25} />
                {tip}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[14px] text-muted">Coming soon to iPhone and Android.</p>
        </div>
        <AppSimulator data={data} />
      </div>
    </div>
  );
}
