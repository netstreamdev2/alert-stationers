import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/*
 * Closest Google Fonts to the UI references (docs/UI-REFERENCES.md), until the client
 * confirms a brand typeface. Plus Jakarta Sans carries headings and UI; Fraunces italic
 * is reserved for short accent phrases.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Alert Stationers · School, office and art supplies",
    template: "%s · Alert Stationers",
  },
  description: "Stationery for school, office and everything creative, with school lists in one tap and live stock.",
  // Proof of concept with demo data: keep it out of search engines.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#151214" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a
          href="#main"
          className="sr-only rounded-full bg-ink px-5 py-3 font-semibold text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to content
        </a>
        {/* The shop's chrome lives in (shop)/layout.tsx; the admin has its own. */}
        {children}
      </body>
    </html>
  );
}
