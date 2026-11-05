import { formatRand, getProduct, getSchoolList, schoolListTotalCents, schoolListUnitCount } from "@alert/core";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { ButtonLink, Label } from "@/components/ui";
import { ScanDemo } from "./scan-demo";

const benefits = ["Reads printed and photographed lists", "Matches every line to live stock", "Swap brands or skip what you already have"];

export function AppPromo() {
  const list = getSchoolList("protea-heights-grade-4");
  const rows = list.items.map((item) => ({ name: getProduct(item.product).name, qty: item.qty }));

  return (
    <section aria-labelledby="app-title" className="reveal shell mt-16 lg:mt-24">
      <div className="relative isolate overflow-hidden rounded-card bg-contrast text-on-contrast">
        <span aria-hidden="true" className="rule-light pattern-dots absolute inset-0 -z-10" />
        <div className="grid grid-cols-1 items-center gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-14">
          <div>
            <Label tone="on-contrast">The Alert Stationers app</Label>
            <h2 id="app-title" className="type-display mt-3 text-[length:clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[0.98]">
              Snap the list. <span className="type-accent block text-pink-bright">We&rsquo;ll pack the bag.</span>
            </h2>
            <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-contrast-muted">
              Point your camera at your school&rsquo;s printed stationery list. The app reads every line, matches it to what&rsquo;s on our shelves right now, and fills your bag in seconds.
            </p>
            <ul className="mt-7 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-[15px] font-semibold">
                  <CheckIcon className="size-[18px] shrink-0 text-pink-bright" strokeWidth={2.5} />
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ButtonLink href="/app" variant="inverse">
                Try the app in your browser
                <ArrowRightIcon className="size-[18px]" />
              </ButtonLink>
              <p className="text-[14px] text-contrast-muted">Coming soon to iPhone and Android.</p>
            </div>
            <p className="sr-only">
              Animation: a phone scans a printed {list.grade} stationery list, ticks off each item, and adds all {list.items.length} to the bag.
            </p>
          </div>

          <ScanDemo
            school={list.school}
            grade={list.grade}
            rows={rows}
            totalLabel={formatRand(schoolListTotalCents(list))}
            units={schoolListUnitCount(list)}
          />
        </div>
      </div>
    </section>
  );
}
