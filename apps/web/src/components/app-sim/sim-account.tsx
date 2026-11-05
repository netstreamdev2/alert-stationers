"use client";

import { ChevronRightIcon } from "@/components/icons";
import { ScreenHeader } from "./sim-ui";
import { useSim } from "./sim-store";

const rows = ["Orders", "Saved school lists", "Addresses", "Payment methods", "Notifications"];

export function SimAccount() {
  const sim = useSim();
  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="Account" />
      <div className="px-5 pb-32">
        <div className="relative isolate overflow-hidden rounded-[24px] bg-contrast p-5 text-on-contrast">
          <span aria-hidden="true" className="rule-light pattern-ruled absolute inset-0 -z-10" />
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-pink-bright">Guest</p>
          <p className="type-display mt-1 text-[1.4rem] font-extrabold leading-tight">You&rsquo;re browsing as a guest.</p>
          <p className="mt-2 text-[13px] text-contrast-muted">Sign-in, saved lists and order tracking come with the full app.</p>
        </div>
        <ul className="mt-5 divide-y divide-line rounded-[22px] bg-surface px-4 ring-1 ring-line">
          {rows.map((row) => (
            <li key={row}>
              <button
                type="button"
                onClick={() => sim.toast(`${row} come with the full app`)}
                className="flex w-full items-center justify-between py-4 text-left text-[14px] font-medium"
              >
                {row}
                <ChevronRightIcon className="size-4 text-muted" />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={sim.restart} className="mt-6 w-full text-center text-[13px] font-semibold text-pink">
          Restart the preview
        </button>
      </div>
    </div>
  );
}
