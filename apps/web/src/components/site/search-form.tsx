import Form from "next/form";
import { SearchIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** Display is set by the caller ("flex", or "hidden lg:flex") so the two never conflict. */
export function SearchForm({ id, className }: { id: string; className: string }) {
  return (
    <Form action="/search" role="search" className={cn("relative items-center", className)}>
      <label htmlFor={id} className="sr-only">
        Search the store
      </label>
      <SearchIcon className="pointer-events-none absolute left-4 size-5 text-muted" />
      <input
        id={id}
        name="q"
        type="search"
        placeholder="Search pens, paper, school lists…"
        autoComplete="off"
        enterKeyHint="search"
        className="h-12 w-full rounded-full border border-line bg-surface pl-12 pr-5 text-[15px] text-ink transition-colors placeholder:text-muted hover:border-line-strong"
      />
    </Form>
  );
}
