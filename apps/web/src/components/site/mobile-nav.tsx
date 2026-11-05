"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronRightIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { accountLinks, aisleLinks, featureLinks } from "./nav-links";

/**
 * Mobile menu as a native modal <dialog>: focus trapping, Escape to close and an
 * inert background come from the browser, so they can't break.
 */
export function MobileNav() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="-ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/6 lg:hidden"
      >
        <MenuIcon />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="drawer shadow-lift"
        onClick={(event) => {
          // A click on the backdrop targets the dialog itself.
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
            <p className="type-display text-xl font-extrabold">Menu</p>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-ink/6"
            >
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 pb-10 pt-6">
            <ul className="flex gap-2">
              {featureLinks.map((link) => (
                <li key={link.href} className="flex-1">
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex h-12 items-center justify-center rounded-full bg-contrast px-4 text-sm font-semibold text-on-contrast"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-8 text-muted">Aisles</p>
            <ul className="mt-2 divide-y divide-line">
              {aisleLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={close} className="flex items-center justify-between gap-4 py-3.5">
                    <span>
                      <span className="block text-[17px] font-semibold">{link.label}</span>
                      <span className="block text-[13px] text-muted">{link.description}</span>
                    </span>
                    <ChevronRightIcon className="size-5 shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-8 text-muted">Your account</p>
            <ul className="mt-2 divide-y divide-line">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={close} className="flex items-center justify-between py-3.5 text-[17px] font-semibold">
                    {link.label}
                    <ChevronRightIcon className="size-5 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  );
}
