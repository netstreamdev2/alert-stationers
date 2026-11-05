import { formatRand, getProduct, getSchoolList, percentOff } from "@alert/core";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";
import { Countdown } from "@/components/product/countdown";
import { ArrowCircle, ButtonLink } from "@/components/ui";
import { cssVar } from "@/lib/style";
import { ListPreview } from "./list-preview";

function PlannerDeal() {
  const planner = getProduct("planner-2027-a5");
  const special = planner.special;
  if (!special?.endsAt) throw new Error("Seed data: the planner must be a countdown special");
  const discount = percentOff(planner.priceCents, special.priceCents);

  return (
    <Link
      href={`/product/${planner.slug}`}
      className="group relative isolate flex min-h-[15rem] flex-col overflow-hidden rounded-card bg-brand p-6 text-on-brand sm:min-h-[17rem] sm:p-7"
    >
      <span aria-hidden="true" className="rule-light pattern-ruled absolute inset-0 -z-10" />
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex h-8 items-center rounded-full bg-on-brand/15 px-3 text-[12px] font-semibold uppercase tracking-[0.12em]">
          Planner deal
        </span>
        <ArrowCircle tone="on-brand" />
      </div>
      <p className="type-display mt-auto pt-8 text-[length:clamp(4rem,9vw,5.25rem)] font-extrabold italic leading-[0.85]">
        −{discount}%
      </p>
      <p className="mt-3 text-[17px] font-semibold">{planner.name}</p>
      <p className="mt-1 text-[15px]">
        <span className="font-semibold tabular-nums">{formatRand(special.priceCents)}</span>
        <span className="sr-only">, was</span> <s className="tabular-nums opacity-75">{formatRand(planner.priceCents)}</s>
      </p>
      <p className="mt-4 inline-flex h-8 w-fit items-center gap-2 rounded-full bg-on-brand/15 px-3 text-[13px] font-medium">
        <ClockIcon className="size-4" />
        <Countdown endsAt={special.endsAt} seconds />
      </p>
    </Link>
  );
}

function LiveStock() {
  return (
    <div className="relative isolate flex min-h-[15rem] flex-col overflow-hidden rounded-card bg-tint-sky p-6 sm:min-h-[17rem] sm:p-7">
      <span aria-hidden="true" className="pattern-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <p className="inline-flex h-8 w-fit items-center gap-2 rounded-full bg-surface px-3 text-[13px] font-semibold">
        <span aria-hidden="true" className="live-dot" />
        Live stock
      </p>
      <p className="type-display mt-auto pt-8 text-[1.75rem] font-extrabold leading-[1.05]">What you see is on the shelf.</p>
      <p className="mt-2 text-[15px] text-ink-soft">Stock updates the moment something sells, on the website and in the app.</p>
    </div>
  );
}

export function Hero() {
  const list = getSchoolList("protea-heights-grade-4");

  return (
    <section aria-labelledby="hero-title" className="shell pt-1 lg:pt-3">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="@container relative isolate overflow-hidden rounded-card bg-contrast text-on-contrast xl:col-span-8">
          {/* Exercise-book page: faint rules and a pink margin line */}
          <span
            aria-hidden="true"
            className="rule-light pattern-ruled absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_35%,transparent)]"
          />
          <span aria-hidden="true" className="absolute inset-y-0 left-3 -z-10 w-px bg-magenta/45 sm:left-7 lg:left-9" />

          <div className="grid grid-cols-1 gap-10 p-6 pb-8 sm:p-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:p-12">
            <div className="flex flex-col">
              <p className="rise inline-flex h-8 w-fit items-center gap-2 rounded-full bg-on-contrast/10 px-3 text-[13px] font-medium">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-pink-bright" />
                Back to school 2027
              </p>
              <h1
                id="hero-title"
                className="type-display mt-6 text-[length:clamp(2.5rem,7.2cqi,4.25rem)] font-extrabold leading-[0.95]"
              >
                {/* Explicit spaces keep the lines as separate words for screen readers */}
                <span className="rise block" style={cssVar("--delay", "80ms")}>
                  Your whole
                </span>{" "}
                <span className="rise block" style={cssVar("--delay", "160ms")}>
                  school list.
                </span>{" "}
                <span className="rise block" style={cssVar("--delay", "240ms")}>
                  <span className="swipe type-accent">One tap.</span>
                </span>
              </h1>
              <p className="rise mt-6 max-w-[36ch] text-[17px] leading-relaxed text-contrast-muted" style={cssVar("--delay", "320ms")}>
                Pick your school and grade, and the whole list lands in your bag at today&rsquo;s prices, checked against live stock.
              </p>
              <div className="rise mt-8 flex flex-wrap gap-3" style={cssVar("--delay", "400ms")}>
                <ButtonLink href="/school-lists" variant="inverse">
                  Find your school list
                  <ArrowRightIcon className="size-[18px]" />
                </ButtonLink>
                <ButtonLink href="/shop" variant="ghost-on-contrast">
                  Shop everything
                </ButtonLink>
              </div>
            </div>

            <div className="flex items-end justify-center md:items-center">
              <ListPreview list={list} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1 xl:grid-rows-2">
          <PlannerDeal />
          <LiveStock />
        </div>
      </div>
    </section>
  );
}
