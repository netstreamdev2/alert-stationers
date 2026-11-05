import {
  formatRand,
  getProduct,
  schoolListTotalCents,
  schoolListUnitCount,
  schoolLists,
  type SchoolList,
} from "@alert/core";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { ArrowCircle } from "@/components/ui";

const steps = [
  { title: "Find your school", body: "Search for your school, or pick it from the list." },
  { title: "Choose the grade", body: "See every item and quantity the school asks for." },
  { title: "Add it all in one tap", body: "Then swap brands or remove what you already have." },
];

function SchoolListTile({ list }: { list: SchoolList }) {
  const total = schoolListTotalCents(list);
  const preview = list.items.slice(0, 4);

  return (
    <Link
      href={`/school-lists/${list.slug}`}
      aria-label={`${list.grade} list for ${list.school}: ${list.items.length} items, ${formatRand(total)}. View the list.`}
      className="group flex flex-col rounded-card border border-line bg-surface p-6 transition-[box-shadow,transform] duration-300 ease-glide hover:-translate-y-0.5 hover:shadow-lift lg:col-span-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">{list.school}</p>
          <p className="type-accent mt-1 text-[2.375rem] leading-none">{list.grade}</p>
        </div>
        <ArrowCircle tone="paper" />
      </div>

      <ul className="mt-6 space-y-2.5">
        {preview.map((item) => (
          <li key={item.product} className="flex items-center gap-3 text-[14px]">
            <span aria-hidden="true" className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-pink-tint text-pink">
              <CheckIcon className="size-3" strokeWidth={3} />
            </span>
            <span className="min-w-0 flex-1 truncate">{getProduct(item.product).name}</span>
            <span className="tabular-nums text-muted">×{item.qty}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] text-muted">+ {list.items.length - preview.length} more</p>

      <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-4">
        <div>
          <p className="text-[12px] text-muted">
            {list.items.length} items · {schoolListUnitCount(list)} units
          </p>
          <p className="text-xl font-semibold tabular-nums">{formatRand(total)}</p>
        </div>
        <span className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[14px] font-semibold text-paper">View list</span>
      </div>
    </Link>
  );
}

export function SchoolListsSection() {
  return (
    <section aria-labelledby="lists-title" className="reveal shell mt-16 lg:mt-24">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col justify-center pb-4 lg:col-span-4 lg:pb-0 lg:pr-8">
          <p className="eyebrow text-muted">School lists</p>
          <h2 id="lists-title" className="type-display mt-2 text-[2rem] font-extrabold leading-none sm:text-[2.5rem]">
            Every item on the list. <span className="type-accent text-pink">Sorted.</span>
          </h2>
          <ol className="mt-7 space-y-5">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="type-display inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-[15px] font-extrabold text-paper">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-[14px] text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        {schoolLists.map((list) => (
          <SchoolListTile key={list.slug} list={list} />
        ))}
      </div>
    </section>
  );
}
