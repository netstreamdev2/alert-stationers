import { categories } from "@alert/core";

export interface NavLink {
  href: string;
  label: string;
  description?: string;
}

/** One list of aisle links, shared by the header chips, the mobile menu and the footer. */
export const aisleLinks: NavLink[] = categories.map((c) => ({
  href: `/shop/${c.slug}`,
  label: c.name,
  description: c.blurb,
}));

export const featureLinks: NavLink[] = [
  { href: "/specials", label: "Specials" },
  { href: "/school-lists", label: "School lists" },
];

export const accountLinks: NavLink[] = [
  { href: "/wishlist", label: "Wishlist" },
  { href: "/account/orders", label: "Orders" },
];
