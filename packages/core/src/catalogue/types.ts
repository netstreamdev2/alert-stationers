export type CategorySlug =
  | "writing"
  | "paper-books"
  | "school"
  | "art-craft"
  | "office-filing"
  | "gifts-planners";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** One-line description of what's in the aisle. */
  blurb: string;
}

export interface ProductOption {
  key: string;
  label: string;
  stock: number;
  /** Colour swatch for colour options. */
  swatch?: string;
  /** Overrides the product price, e.g. for pack sizes. */
  priceCents?: number;
}

export interface Special {
  priceCents: number;
  /** ISO timestamp (UTC). Present only for specials with a countdown. */
  endsAt?: string;
}

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  /** Regular price in cents, VAT inclusive. */
  priceCents: number;
  special?: Special;
  /** Stock for products without options. */
  stock?: number;
  options?: {
    kind: "colour" | "pack";
    values: ProductOption[];
  };
  /** Bulk tier: each unit costs `priceCents` when buying `minQty` or more. */
  bulk?: { minQty: number; priceCents: number };
  /** Public path to the main image. Absent until real or generated photos exist. */
  image?: string;
  /** Every seed record is demo data and gets wiped before launch. */
  demo: true;
}

export interface SchoolListItem {
  product: string;
  option?: string;
  qty: number;
}

export interface SchoolList {
  slug: string;
  school: string;
  grade: string;
  items: SchoolListItem[];
}

export type StockState = "in" | "low" | "out";
