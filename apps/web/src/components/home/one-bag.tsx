import { formatRand, getProduct, unitPriceCents } from "@alert/core";
import { CheckIcon } from "@/components/icons";
import { cssVar } from "@/lib/style";

/* A tiny demo bag, priced by the shared core package like the real one will be. */
const startingLines = [
  { slug: "gel-pens-6", qty: 1 },
  { slug: "hb-pencils-12", qty: 2 },
  { slug: "exercise-book-a4-72", option: "single", qty: 6 },
] as const;
const addedLine = { slug: "highlighters-4", qty: 1 } as const;

function line(slug: string, qty: number, option?: string) {
  const product = getProduct(slug);
  return { name: product.name.split(",")[0] ?? product.name, qty, totalCents: unitPriceCents(product, option) * qty };
}

const rows = startingLines.map((l) => line(l.slug, l.qty, "option" in l ? l.option : undefined));
const added = line(addedLine.slug, addedLine.qty);
const subtotalBefore = rows.reduce((sum, r) => sum + r.totalCents, 0);
const subtotalAfter = subtotalBefore + added.totalCents;

function Swap({ before, after, delay }: { before: string; after: string; delay: string }) {
  return (
    <span className="inline-grid">
      <span className="sync-before col-start-1 row-start-1" style={cssVar("--d", delay)}>
        {before}
      </span>
      <span className="sync-after col-start-1 row-start-1" style={cssVar("--d", delay)}>
        {after}
      </span>
    </span>
  );
}

function BagList({ compact, delay }: { compact?: boolean; delay: string }) {
  const text = compact ? "text-[11px]" : "text-[13px]";
  return (
    <div>
      <p className={`flex items-center justify-between font-semibold ${text}`}>
        <span>Your bag</span>
        <span className="text-muted">
          <Swap before={`${rows.length} items`} after={`${rows.length + 1} items`} delay={delay} />
        </span>
      </p>
      <ul className={`mt-2 divide-y divide-line ${text}`}>
        {rows.map((row) => (
          <li key={row.name} className="flex items-center justify-between gap-2 py-2">
            <span className="min-w-0 truncate">
              {row.name}
              {compact ? null : <span className="text-muted"> ×{row.qty}</span>}
            </span>
            <span className="tabular-nums">{formatRand(row.totalCents)}</span>
          </li>
        ))}
        <li className="sync-row flex items-center justify-between gap-2 py-2 font-semibold text-pink" style={cssVar("--d", delay)}>
          <span className="min-w-0 truncate">{added.name}</span>
          <span className="tabular-nums">{formatRand(added.totalCents)}</span>
        </li>
      </ul>
      <p className={`mt-1 flex items-center justify-between border-t border-line pt-2 font-semibold ${text}`}>
        <span>Subtotal</span>
        <span className="tabular-nums">
          <Swap before={formatRand(subtotalBefore)} after={formatRand(subtotalAfter)} delay={delay} />
        </span>
      </p>
    </div>
  );
}

function SyncDemo() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-[22rem] w-full max-w-[34rem] sm:h-[24rem]">
      {/* Browser */}
      <div className="absolute left-0 top-2 w-[84%] overflow-hidden rounded-2xl bg-surface text-ink shadow-lift">
        <div className="flex h-10 items-center gap-1.5 border-b border-line px-4">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="ml-3 h-6 flex-1 truncate rounded-full bg-paper px-3 text-[11px] leading-6 text-muted">Alert Stationers · bag</span>
        </div>
        <div className="p-4 pb-5 pr-[38%] sm:pr-[34%]">
          <BagList delay="0s" />
        </div>
      </div>

      {/* Phone */}
      <div className="absolute bottom-0 right-0 w-[46%] max-w-[13.5rem] rounded-[2.25rem] bg-device p-1.5 shadow-lift">
        <div className="overflow-hidden rounded-[1.8rem] bg-surface text-ink">
          <div className="flex justify-center pt-2">
            <span className="h-5 w-16 rounded-full bg-device" />
          </div>
          <div className="px-3 pb-5 pt-3">
            <p className="sync-toast mb-2 flex items-center gap-1.5 rounded-xl bg-pink-tint px-2.5 py-1.5 text-[10px] font-semibold text-pink" style={cssVar("--d", "0.9s")}>
              <span className="live-dot" />
              Added on the website
            </p>
            <BagList compact delay="0.9s" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OneBag() {
  return (
    <section aria-labelledby="one-bag-title" className="reveal shell mt-16 lg:mt-24">
      <div className="relative isolate overflow-hidden rounded-card bg-contrast text-on-contrast">
        <span aria-hidden="true" className="rule-light pattern-dots absolute inset-0 -z-10" />
        <div className="grid grid-cols-1 items-center gap-12 p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div>
            <p className="eyebrow text-contrast-muted">One account</p>
            <h2 id="one-bag-title" className="type-display mt-3 text-[length:clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[0.98]">
              Start on your laptop. <span className="type-accent block text-pink-bright">Finish on your phone.</span>
            </h2>
            <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-contrast-muted">
              Your bag, orders and delivery tracking follow you. Add something on the website and it&rsquo;s already in the app. Pay on either, track on both.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {["Same bag", "Same orders", "Live tracking"].map((label) => (
                <li key={label} className="inline-flex h-9 items-center gap-2 rounded-full bg-on-contrast/10 px-4 text-[14px] font-medium">
                  <CheckIcon className="size-4 text-pink-bright" strokeWidth={2.5} />
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[14px] text-contrast-muted">The Alert Stationers app is coming to iOS and Android.</p>
          </div>
          <SyncDemo />
        </div>
      </div>
    </section>
  );
}
