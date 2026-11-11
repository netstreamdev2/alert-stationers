import { cacheLife } from "next/cache";
import Link from "next/link";
import { PulseIcon, SchoolListIcon, ShieldCheckIcon } from "@/components/icons";
import { Logo } from "./logo";
import { aisleLinks, type NavLink } from "./nav-links";

const promises = [
  { Icon: PulseIcon, title: "Live stock", body: "Updated the moment something sells." },
  { Icon: SchoolListIcon, title: "School lists in one tap", body: "Every item for the grade, at today's prices." },
  { Icon: ShieldCheckIcon, title: "Secure checkout", body: "Card details never touch our servers." },
];

const columns: { title: string; links: NavLink[] }[] = [
  { title: "Shop", links: aisleLinks },
  {
    title: "Help",
    links: [
      { href: "/help/delivery", label: "Delivery" },
      { href: "/help/returns", label: "Returns" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of sale" },
      { href: "/admin", label: "Staff admin (demo)" },
    ],
  },
];

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-surface lg:mt-28">
      <div className="shell">
        <ul className="grid grid-cols-1 gap-6 border-b border-line py-10 sm:grid-cols-3">
          {promises.map(({ Icon, title, body }) => (
            <li key={title} className="flex gap-3.5">
              <Icon className="mt-0.5 size-6 shrink-0 text-pink" />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-[14px] text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[32ch] text-[14px] text-muted">School, office and art supplies, on the website and in the app.</p>
            <p className="mt-3 text-[13px] text-muted">Proof of concept. Products and prices are demo data.</p>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="eyebrow text-muted">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[15px] text-ink-soft transition-colors hover:text-pink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-6 text-[13px] text-muted sm:flex-row sm:justify-between">
          <p>
            © <CopyrightYear /> Alert Stationers
          </p>
          <p>All prices are in rand and include VAT.</p>
        </div>
      </div>
    </footer>
  );
}
