"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Field({
  label,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  error?: string | undefined;
  hint?: string;
  className?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby": string | undefined }) => ReactNode;
}) {
  const id = useId();
  const messageId = `${id}-msg`;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[14px] font-semibold">
        {label}
      </label>
      <div className="mt-1.5">{children({ id, "aria-invalid": Boolean(error), "aria-describedby": error || hint ? messageId : undefined })}</div>
      {error ? (
        <p id={messageId} className="mt-1.5 text-[13px] font-medium text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-1.5 text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-[15px] text-ink transition-colors placeholder:text-muted hover:border-ink/40 aria-invalid:border-error";

/** A large selectable card (delivery method, payment method). */
export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  title,
  detail,
  aside,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  detail: string;
  aside?: ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors",
        checked ? "border-ink bg-surface ring-1 ring-ink" : "border-line-strong bg-surface hover:border-ink/40",
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="size-5 accent-[var(--pink)]" />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{title}</span>
        <span className="block text-[13px] text-muted">{detail}</span>
      </span>
      {aside ? <span className="shrink-0 text-[14px] font-semibold tabular-nums">{aside}</span> : null}
    </label>
  );
}

export function StepHeading({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="flex items-baseline gap-3">
      <span aria-hidden="true" className="type-accent text-[1.75rem] leading-none text-pink">
        {n}
      </span>
      <span className="type-display text-[1.375rem] font-extrabold">{title}</span>
    </h2>
  );
}
