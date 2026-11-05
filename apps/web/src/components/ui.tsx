import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const buttonBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-[transform,background-color,box-shadow] duration-200 ease-glide hover:-translate-y-px active:translate-y-0 active:scale-[0.98]";

/** Pill buttons. Ink is the primary action; "inverse" sits on ink surfaces, "on-brand" on pink. */
const buttonVariants = {
  ink: "bg-ink text-paper hover:bg-ink-soft hover:shadow-lift",
  inverse: "bg-on-contrast text-contrast hover:shadow-lift",
  "on-brand": "bg-on-brand text-brand hover:shadow-lift",
  outline: "border border-line-strong bg-surface text-ink hover:border-ink",
  "ghost-on-contrast": "text-on-contrast ring-1 ring-inset ring-on-contrast/25 hover:bg-on-contrast/10",
} as const;

export function ButtonLink({
  variant = "ink",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof buttonVariants }) {
  return <Link className={cn(buttonBase, buttonVariants[variant], className)} {...props} />;
}

const badgeTones = {
  ink: "bg-ink text-paper",
  pink: "bg-pink-tint text-pink",
  muted: "bg-surface text-muted",
  glass: "bg-surface/90 text-ink backdrop-blur",
} as const;

export function Badge({ tone, children, className }: { tone: keyof typeof badgeTones; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-xs font-semibold tabular-nums",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const arrowTones = {
  surface: "bg-surface text-ink",
  paper: "bg-paper text-ink",
  "on-brand": "bg-on-brand text-brand",
} as const;

/** Decorative corner arrow; turns to point right when its group is hovered. */
export function ArrowCircle({ className, tone = "surface" }: { className?: string; tone?: keyof typeof arrowTones }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full shadow-[0_1px_2px_rgb(0_0_0/0.06)] transition-transform duration-300 ease-snap group-hover:rotate-45",
        arrowTones[tone],
        className,
      )}
    >
      <ArrowUpRightIcon className="size-[18px]" />
    </span>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        {eyebrow ? <p className="eyebrow flex items-center gap-2 text-muted">{eyebrow}</p> : null}
        <h2 id={id} className="type-display mt-2 text-[2rem] font-extrabold leading-none sm:text-[2.5rem]">
          {title}
        </h2>
      </div>
      {href && linkLabel ? (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full py-2 text-sm font-semibold text-ink transition-colors hover:text-pink"
        >
          {linkLabel}
          <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
