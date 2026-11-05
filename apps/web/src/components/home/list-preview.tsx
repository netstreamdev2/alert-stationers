import { formatRand, getProduct, schoolListTotalCents, schoolListUnitCount, type SchoolList } from "@alert/core";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { LiveLabel } from "@/components/ui";
import { cssVar } from "@/lib/style";

/** The hero's taped-down checklist card: ticks fill in one by one on load. */
export function ListPreview({ list }: { list: SchoolList }) {
  const total = schoolListTotalCents(list);
  const units = schoolListUnitCount(list);
  const preview = list.items.slice(0, 6);
  const more = list.items.length - preview.length;

  return (
    <Link
      href={`/school-lists/${list.slug}`}
      aria-label={`${list.grade} list for ${list.school}: ${list.items.length} items, ${formatRand(total)}. View the list.`}
      className="group relative block w-full max-w-[22.5rem] -rotate-2 rounded-[1.5rem] bg-surface p-5 text-ink shadow-lift transition-transform duration-500 ease-snap hover:-translate-y-1 hover:-rotate-1"
    >
      <span aria-hidden="true" className="tape absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-3" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium text-muted">{list.school}</p>
          <p className="type-accent mt-0.5 text-[1.875rem] leading-none">{list.grade}</p>
        </div>
        <LiveLabel className="shrink-0 pt-1">Live</LiveLabel>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {preview.map((item, index) => (
          <li key={item.product} className="flex items-center gap-3 py-2.5 text-[14px]">
            <span
              aria-hidden="true"
              className="tick inline-flex size-[18px] shrink-0 items-center justify-center rounded-md border border-line-strong text-on-brand"
              style={cssVar("--d", `${700 + index * 140}ms`)}
            >
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </span>
            <span className="min-w-0 flex-1 truncate">{getProduct(item.product).name}</span>
            <span className="tabular-nums text-muted">×{item.qty}</span>
          </li>
        ))}
      </ul>
      <p className="pb-1 pt-2 text-[13px] text-muted">+ {more} more items on the list</p>

      <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-paper p-3 pl-4">
        <div>
          <p className="text-[12px] text-muted">
            {list.items.length} items · {units} units
          </p>
          <p className="text-[17px] font-semibold tabular-nums">{formatRand(total)}</p>
        </div>
        <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-[14px] font-semibold text-paper">
          View list
          <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
