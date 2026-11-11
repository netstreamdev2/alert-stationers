import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · Alert Stationers" },
  robots: { index: false, follow: false },
};

/** Staff area. In the proof of concept it isn't behind a sign-in; the real admin is a separate app with staff roles and MFA. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-dvh lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex flex-wrap items-center gap-4 px-4 py-3 lg:flex-col lg:items-stretch lg:gap-6 lg:p-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="relative size-10 shrink-0">
              <Image src="/brand/logo-badge.svg" alt="" fill sizes="40px" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold">Alert Stationers</span>
              <span className="block text-[12px] text-muted">Staff admin</span>
            </span>
          </Link>
          <div className="order-last w-full overflow-x-auto lg:order-none">
            <AdminNav />
          </div>
          <div className="ml-auto lg:ml-0 lg:mt-auto">
            <p className="hidden rounded-xl bg-pink-tint px-3 py-2 text-[12px] text-pink lg:block">Demo admin. Not signed in or secured.</p>
            <Link href="/" className="mt-3 block text-[13px] font-semibold text-ink-soft hover:text-pink">
              ← Back to the shop
            </Link>
          </div>
        </div>
      </aside>
      <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {children}
      </main>
    </div>
  );
}
