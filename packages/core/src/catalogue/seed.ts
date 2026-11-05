/**
 * Proof-of-concept seed catalogue. Mirrors docs/POC-SEED-DATA.md exactly.
 * Every record is demo data (fictional brands and school) and is wiped before launch.
 */
import type { Category, Product, SchoolList } from "./types";

export const categories: readonly Category[] = [
  { slug: "writing", name: "Writing", blurb: "Pens, pencils, markers and highlighters" },
  { slug: "paper-books", name: "Paper & Books", blurb: "Exercise books, notebooks and printing paper" },
  { slug: "school", name: "School", blurb: "Bags, maths sets and everything on the list" },
  { slug: "art-craft", name: "Art & Craft", blurb: "Paint, colour, glue and making things" },
  { slug: "office-filing", name: "Office & Filing", blurb: "Staplers, files and desk essentials" },
  { slug: "gifts-planners", name: "Gifts & Planners", blurb: "2027 planners, journals and gift sets" },
];

const demo = (product: Omit<Product, "demo">): Product => ({ ...product, demo: true });

export const products: readonly Product[] = [
  // Writing
  demo({ slug: "ballpoint-pens-blue-10", name: "Ballpoint Pens, Blue, 10-pack", brand: "Northline", category: "writing", priceCents: 4999, stock: 180 }),
  demo({ slug: "gel-pens-6", name: "Gel Pens, 6 colours", brand: "Northline", category: "writing", priceCents: 7499, stock: 60 }),
  demo({ slug: "hb-pencils-12", name: "HB Pencils, 12-pack", brand: "Northline", category: "writing", priceCents: 4499, stock: 240 }),
  demo({
    slug: "mechanical-pencil-05", name: "Mechanical Pencil 0.5mm", brand: "Northline", category: "writing", priceCents: 3999,
    options: {
      kind: "colour",
      values: [
        { key: "pink", label: "Pink", stock: 40, swatch: "#B3125F" },
        { key: "black", label: "Black", stock: 55, swatch: "#1F1B1E" },
        { key: "teal", label: "Teal", stock: 0, swatch: "#1F7A7A" },
      ],
    },
  }),
  demo({ slug: "highlighters-4", name: "Highlighters, 4-pack", brand: "Northline", category: "writing", priceCents: 6999, stock: 150 }),
  demo({ slug: "fineliners-10", name: "Fineliners, 10 colours", brand: "Northline", category: "writing", priceCents: 17999, stock: 3 }),
  demo({ slug: "fountain-pen-steel", name: "Fountain Pen, Brushed Steel", brand: "Northline", category: "writing", priceCents: 44999, stock: 1 }),
  demo({ slug: "whiteboard-markers-4", name: "Whiteboard Markers, 4-pack", brand: "Northline", category: "writing", priceCents: 7999, stock: 0 }),

  // Paper & Books
  demo({
    slug: "exercise-book-a4-72", name: "A4 Exercise Book, 72 pages", brand: "Paperleaf", category: "paper-books", priceCents: 1499,
    options: {
      kind: "pack",
      values: [
        { key: "single", label: "Single", stock: 500, priceCents: 1499 },
        { key: "10-pack", label: "10-pack", stock: 60, priceCents: 12999 },
      ],
    },
  }),
  demo({ slug: "hardcover-book-a4-192", name: "A4 Hardcover Book, 192 pages", brand: "Paperleaf", category: "paper-books", priceCents: 5499, stock: 120 }),
  demo({
    slug: "notebook-a5-dotted", name: "A5 Dotted Notebook", brand: "Paperleaf", category: "paper-books", priceCents: 14999,
    options: {
      kind: "colour",
      values: [
        { key: "blush", label: "Blush", stock: 30, swatch: "#F1C6D3" },
        { key: "ink", label: "Ink", stock: 45, swatch: "#232C45" },
        { key: "sage", label: "Sage", stock: 25, swatch: "#9DB09A" },
      ],
    },
  }),
  demo({
    slug: "printing-paper-a4-80", name: "A4 Printing Paper, 80gsm, 500 sheets", brand: "Paperleaf", category: "paper-books",
    priceCents: 10999, stock: 300, bulk: { minQty: 5, priceCents: 9999 },
  }),
  demo({ slug: "sticky-notes-76-4", name: "Sticky Notes 76×76, 4 pads", brand: "Paperleaf", category: "paper-books", priceCents: 3499, stock: 200 }),
  demo({ slug: "notepad-a4-spiral", name: "A4 Spiral Notepad, Ruled", brand: "Paperleaf", category: "paper-books", priceCents: 3999, stock: 90 }),
  demo({ slug: "envelopes-dl-25", name: "DL Envelopes, 25-pack", brand: "Paperleaf", category: "paper-books", priceCents: 3999, stock: 70 }),
  demo({ slug: "graph-book-a4", name: "A4 Graph Paper Book", brand: "Paperleaf", category: "paper-books", priceCents: 2499, stock: 150 }),

  // School
  demo({
    slug: "backpack-25l", name: "School Backpack, 25L", brand: "Little Scholar", category: "school", priceCents: 54999,
    special: { priceCents: 49499 },
    options: {
      kind: "colour",
      values: [
        { key: "navy", label: "Navy", stock: 25, swatch: "#1E2A4A" },
        { key: "pink", label: "Pink", stock: 2, swatch: "#B3125F" },
        { key: "grey", label: "Grey", stock: 18, swatch: "#8A8D91" },
      ],
    },
  }),
  demo({ slug: "pencil-case-zip", name: "Zip Pencil Case", brand: "Little Scholar", category: "school", priceCents: 8999, stock: 110 }),
  demo({ slug: "maths-set-9", name: "Maths Set, 9 pieces", brand: "Little Scholar", category: "school", priceCents: 5999, stock: 140 }),
  demo({ slug: "ruler-30cm", name: "30cm Ruler, Shatterproof", brand: "Little Scholar", category: "school", priceCents: 1299, stock: 300 }),
  demo({ slug: "erasers-2", name: "Erasers, 2-pack", brand: "Little Scholar", category: "school", priceCents: 1499, stock: 260 }),
  demo({ slug: "sharpener-double", name: "Double Sharpener with Canister", brand: "Little Scholar", category: "school", priceCents: 1999, stock: 220 }),
  demo({ slug: "book-covering-5m", name: "Book Covering Roll, Clear, 5m", brand: "Little Scholar", category: "school", priceCents: 4499, stock: 180 }),
  demo({ slug: "name-labels-60", name: "Iron-on Name Labels, 60", brand: "Little Scholar", category: "school", priceCents: 5999, stock: 80 }),

  // Art & Craft
  demo({ slug: "colour-pencils-24", name: "Colour Pencils, 24", brand: "Fynbos Studio", category: "art-craft", priceCents: 9499, stock: 130 }),
  demo({ slug: "wax-crayons-24", name: "Wax Crayons, 24", brand: "Fynbos Studio", category: "art-craft", priceCents: 4499, stock: 160 }),
  demo({
    slug: "acrylic-paint-12", name: "Acrylic Paint Set, 12 × 22ml", brand: "Fynbos Studio", category: "art-craft",
    priceCents: 22999, special: { priceCents: 17999 }, stock: 55,
  }),
  demo({ slug: "brush-set-10", name: "Brush Set, 10", brand: "Fynbos Studio", category: "art-craft", priceCents: 8499, stock: 60 }),
  demo({ slug: "sketchbook-a4", name: "A4 Sketchbook, 110gsm", brand: "Fynbos Studio", category: "art-craft", priceCents: 10999, stock: 75 }),
  demo({ slug: "glue-sticks-3", name: "Glue Sticks, 3-pack", brand: "Fynbos Studio", category: "art-craft", priceCents: 2999, stock: 280 }),
  demo({ slug: "craft-scissors-13cm", name: "Craft Scissors, 13cm", brand: "Fynbos Studio", category: "art-craft", priceCents: 3999, stock: 150 }),
  demo({ slug: "modelling-clay-10", name: "Modelling Clay, 10 colours", brand: "Fynbos Studio", category: "art-craft", priceCents: 4499, stock: 90 }),

  // Office & Filing
  demo({ slug: "stapler-full-strip", name: "Full-strip Stapler", brand: "Deskwise", category: "office-filing", priceCents: 13999, stock: 45 }),
  demo({ slug: "staples-26-6-5000", name: "Staples 26/6, 5000", brand: "Deskwise", category: "office-filing", priceCents: 2499, stock: 200 }),
  demo({ slug: "punch-2-hole", name: "2-hole Punch", brand: "Deskwise", category: "office-filing", priceCents: 10999, stock: 35 }),
  demo({ slug: "lever-arch-file-a4", name: "Lever Arch File, A4", brand: "Deskwise", category: "office-filing", priceCents: 4499, stock: 150 }),
  demo({ slug: "display-book-20", name: "Display Book, 20 pockets", brand: "Deskwise", category: "office-filing", priceCents: 3499, stock: 140 }),
  demo({ slug: "desk-organiser-mesh", name: "Mesh Desk Organiser", brand: "Deskwise", category: "office-filing", priceCents: 21999, stock: 25 }),
  demo({ slug: "tape-dispenser", name: "Tape Dispenser + 2 Rolls", brand: "Deskwise", category: "office-filing", priceCents: 7499, stock: 60 }),
  demo({ slug: "paper-clips-100", name: "Paper Clips, 100", brand: "Deskwise", category: "office-filing", priceCents: 1499, stock: 300 }),

  // Gifts & Planners
  demo({
    slug: "planner-2027-a5", name: "2027 Weekly Planner, A5", brand: "Paperleaf", category: "gifts-planners",
    priceCents: 24999, special: { priceCents: 19999, endsAt: "2026-12-31T21:59:59.000Z" }, stock: 65,
  }),
  demo({ slug: "desk-calendar-2027", name: "2027 Desk Calendar", brand: "Paperleaf", category: "gifts-planners", priceCents: 12999, stock: 50 }),
  demo({ slug: "pen-gift-set", name: "Pen & Pencil Gift Set", brand: "Northline", category: "gifts-planners", priceCents: 37999, stock: 20 }),
  demo({ slug: "journal-linen-a5", name: "Linen Journal, A5", brand: "Paperleaf", category: "gifts-planners", priceCents: 22999, stock: 35 }),
  demo({ slug: "watercolour-tin-24", name: "Watercolour Gift Tin, 24", brand: "Fynbos Studio", category: "gifts-planners", priceCents: 34999, stock: 15 }),
  demo({ slug: "calligraphy-set", name: "Calligraphy Starter Set", brand: "Northline", category: "gifts-planners", priceCents: 28999, stock: 12 }),
  demo({ slug: "gift-wrap-3", name: "Gift Wrap, 3 Sheets", brand: "Paperleaf", category: "gifts-planners", priceCents: 2999, stock: 200 }),
  demo({ slug: "greeting-cards-6", name: "Blank Greeting Cards, 6", brand: "Paperleaf", category: "gifts-planners", priceCents: 5999, stock: 80 }),
];

export const schoolLists: readonly SchoolList[] = [
  {
    slug: "protea-heights-grade-4",
    school: "Protea Heights Primary (Demo)",
    grade: "Grade 4",
    items: [
      { product: "hb-pencils-12", qty: 1 },
      { product: "ballpoint-pens-blue-10", qty: 1 },
      { product: "erasers-2", qty: 1 },
      { product: "sharpener-double", qty: 1 },
      { product: "ruler-30cm", qty: 1 },
      { product: "maths-set-9", qty: 1 },
      { product: "exercise-book-a4-72", option: "single", qty: 6 },
      { product: "hardcover-book-a4-192", qty: 2 },
      { product: "colour-pencils-24", qty: 1 },
      { product: "glue-sticks-3", qty: 1 },
      { product: "craft-scissors-13cm", qty: 1 },
      { product: "book-covering-5m", qty: 1 },
      { product: "pencil-case-zip", qty: 1 },
    ],
  },
  {
    slug: "protea-heights-grade-1",
    school: "Protea Heights Primary (Demo)",
    grade: "Grade 1",
    items: [
      { product: "wax-crayons-24", qty: 1 },
      { product: "hb-pencils-12", qty: 1 },
      { product: "erasers-2", qty: 1 },
      { product: "sharpener-double", qty: 1 },
      { product: "glue-sticks-3", qty: 2 },
      { product: "craft-scissors-13cm", qty: 1 },
      { product: "exercise-book-a4-72", option: "single", qty: 4 },
      { product: "pencil-case-zip", qty: 1 },
      { product: "name-labels-60", qty: 1 },
    ],
  },
];
