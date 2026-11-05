import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Header lockup: the client's badge (brand/derived/logo-badge.svg) plus a readable wordmark,
 * because the badge's own lettering is too small to read at header size.
 * Replace with an approved horizontal lockup when one exists (see ASSET-BRIEF §2.2).
 */
export function Logo({ className, preload = false }: { className?: string; preload?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Alert Stationers, home"
      className={cn("inline-flex shrink-0 items-center gap-2.5 rounded-full", className)}
    >
      <Image
        src="/brand/logo-badge.svg"
        alt=""
        width={48}
        height={48}
        preload={preload}
        className="size-10 sm:size-11 lg:size-12"
      />
      <span aria-hidden="true" className="type-display text-[1rem] font-extrabold italic leading-[0.9]">
        <span className="block text-pink">ALERT</span>
        <span className="block text-ink">STATIONERS</span>
      </span>
    </Link>
  );
}
