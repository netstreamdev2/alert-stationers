import Link from "next/link";
import type { ReactNode } from "react";
import { BagIcon, HeartIcon, SchoolListIcon, UserIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { aisleLinks } from "./nav-links";
import { SearchForm } from "./search-form";

function IconLink({
  href,
  label,
  onPhones = true,
  className,
  children,
}: {
  href: string;
  label: string;
  /** False hides the icon below the sm breakpoint (it lives in the menu there). */
  onPhones?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        onPhones ? "inline-flex" : "hidden sm:inline-flex",
        "size-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/6",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/**
 * Rendered as siblings (not one wrapper) so the main bar can stay sticky for the whole page
 * while the search row and aisle chips scroll away.
 */
export function SiteHeader() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-xl">
        <div className="shell flex h-16 items-center gap-2 lg:h-[76px] lg:gap-8">
          <MobileNav />
          <Logo preload />
          <SearchForm id="search-desktop" className="hidden max-w-[560px] flex-1 lg:flex" />
          <nav aria-label="Account and bag" className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
            <IconLink href="/account" label="Account" onPhones={false}>
              <UserIcon />
            </IconLink>
            <IconLink href="/wishlist" label="Wishlist" onPhones={false}>
              <HeartIcon />
            </IconLink>
            <IconLink href="/bag" label="Bag, empty" className="-mr-2 sm:mr-0">
              <BagIcon />
            </IconLink>
          </nav>
        </div>
      </header>

      <div className="shell pt-3 lg:hidden">
        <SearchForm id="search-mobile" className="flex" />
      </div>

      <nav aria-label="Aisles" className="shell">
        <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <li className="shrink-0">
            <Link
              href="/specials"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-on-brand transition-transform active:scale-[0.97]"
            >
              Specials
            </Link>
          </li>
          <li className="shrink-0">
            <Link
              href="/school-lists"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-contrast px-4 text-sm font-semibold text-on-contrast transition-transform active:scale-[0.97]"
            >
              <SchoolListIcon className="size-4" />
              School lists
            </Link>
          </li>
          {aisleLinks.map((link) => (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                className="inline-flex h-9 items-center rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-line-strong active:scale-[0.97]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
