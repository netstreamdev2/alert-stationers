# POC Inventory Data: Brief for Astra

**For:** Astra
**Status:** v1, 2026-11-05. Fictional data for the proof of concept. It's wiped before launch and replaced with the client's real catalogue from Sage.

---

## What and why

The web store and admin currently run on 48 fictional products (`packages/core/src/catalogue/seed.ts`, described in `docs/POC-SEED-DATA.md`). That's enough for the homepage, but not for category pages, search, filters, the admin stock screens or the stock history.

Your job is to expand it into a **believable stationery inventory**:
- **120 products** (20 per category)
- suppliers
- 6 school lists
- three months of stock movements that add up exactly to today's stock

You produce **data files only**. The team wires them into the code.

---

## Hard rules

1. **Keep the existing 48 products exactly as they are.** Slug, name, brand, category, price, special, stock, options and bulk tier must not change. The homepage and the demo script depend on them. Add the new fields below to them, and add **72 new products** (12 per category).
2. **Everything is fictional.**
   - No real brands, products, schools, people, companies, phone numbers or addresses.
   - Use the five existing fictional brands (Northline, Paperleaf, Little Scholar, Fynbos Studio, Deskwise). You may add up to three more, after checking they aren't real stationery brands.
   - Every school name ends in "(Demo)".
3. **Money is integer cents in ZAR, VAT inclusive (15%).** Never decimals. Prices should be realistic for South African stationery retail in late 2026.
4. **Timestamps are UTC ISO strings**, e.g. `2026-09-14T08:30:00.000Z`.
5. **Every record has `"demo": true`.**
6. **Don't edit anything in `apps/` or `packages/`.** Write only to `seed/data/`.

---

## Files to deliver (in `seed/data/`)

### `categories.json`
The six existing categories, unchanged (`slug`, `name`, `blurb`), each with a `subcategories` array of `{ "slug", "name" }`. Use these subcategories:

| Category | Subcategory slugs |
|---|---|
| `writing` | `ballpoint-pens`, `gel-pens`, `pencils`, `mechanical-pencils`, `markers`, `highlighters`, `fineliners`, `premium-pens`, `correction` |
| `paper-books` | `exercise-books`, `hardcover-books`, `notebooks-journals`, `printing-paper`, `sticky-notes`, `notepads`, `envelopes`, `graph-paper` |
| `school` | `bags`, `pencil-cases`, `maths-sets`, `rulers`, `erasers-sharpeners`, `book-covering`, `name-labels`, `calculators` |
| `art-craft` | `colouring`, `paint`, `brushes`, `sketching`, `glue`, `scissors-cutting`, `modelling`, `craft-supplies` |
| `office-filing` | `staplers`, `punches`, `clips-pins`, `tape`, `files-folders`, `desk-organisers`, `labels`, `laminating-binding` |
| `gifts-planners` | `planners-diaries`, `calendars`, `journals`, `gift-sets`, `cards-wrap` |

Every subcategory should have at least one product.

### `products.json`
An array of 120 products. Required fields are unmarked; optional fields are marked "optional".

| Field | Type | Rules |
|---|---|---|
| `slug` | string | kebab-case, unique |
| `sku` | string | `AS-<CAT>-<4 digits>`, unique. CAT is `WRT` (writing), `PAP` (paper-books), `SCH` (school), `ART` (art-craft), `OFF` (office-filing) or `GFT` (gifts-planners). |
| `barcode` | string | 13-digit EAN-13 **starting with 20–29** (GS1's restricted-circulation range, so it can never match a real product). The check digit must be correct. Unique. |
| `name` | string | How a shop would list it, e.g. "Gel Pens, 6 colours" |
| `brand` | string | One of the fictional brands |
| `category` | string | One of the six category slugs |
| `subcategory` | string | One of that category's subcategory slugs |
| `description` | string | 2–3 sentences of plain South African English. No invented certifications, safety claims or awards. |
| `specs` | array | 3–6 items of `{ "label", "value" }`, e.g. `{ "label": "Tip size", "value": "0.7mm" }` |
| `priceCents` | integer | Regular price, VAT inclusive |
| `special` | object, optional | `{ "priceCents" }`, plus `"endsAt"` only for countdown specials |
| `costPriceCents` | integer | What the shop pays, excluding VAT: 50–70% of (priceCents ÷ 1.15), rounded |
| `stock` | integer | Only for products without options |
| `options` | object, optional | `{ "kind": "colour" \| "pack", "values": [...] }`. Each value has `key`, `label`, `stock`, its own `sku` (product SKU + `-` + key in uppercase) and its own `barcode`. Add `swatch` (hex) for colours and `priceCents` for pack sizes. |
| `bulk` | object, optional | `{ "minQty", "priceCents" }`, where the per-unit price is lower than regular |
| `reorderPoint` | integer | The stock level that triggers a reorder |
| `reorderQty` | integer | How many to order |
| `supplier` | string | A supplier slug from `suppliers.json` |
| `binLocation` | string | `A<2 digits>-S<1 digit>-B<1 digit>`, e.g. `A03-S2-B4` (aisle, shelf, bin) |
| `weightGrams` | integer | Realistic shipped weight (couriers price on it) |
| `dimensionsMm` | object | `{ "l", "w", "h" }`, the realistic packed size |
| `tags` | array | Any of `school-list`, `bestseller`, `new`, `gift`, `eco`, `office-favourite` |
| `imageNotes` | string | One line for a future product photo, in the style of the POC image brief |
| `demo` | `true` | |

**Spread across the 72 new products:**
- **Stock:** about 5 low-stock (1–5 units), about 4 sold out (0), the rest healthy (15–400, depending on the item).
- **Options:** about 6 new products with options, including 2 where one option is sold out.
- **Specials:** about 7 new specials (roughly 10% of the full catalogue), at most 1 with a countdown (`endsAt` between 2026-12-15 and 2027-01-31).
- **Bulk tiers:** 3–4 new bulk tiers (printing, filing and office consumables).
- **Calculators:** at least 2 (scientific and basic), because they're a big back-to-school item.

### `suppliers.json`
5–7 fictional suppliers, each with:
- `slug` and `name`
- `leadTimeDays` (2–21)
- `contactEmail` (an `@example.com` address)
- `categories`: the category slugs they supply

### `school-lists.json`
- The 2 existing lists for Protea Heights Primary (Demo), unchanged.
- 4 new lists across 2 new fictional schools (names ending in "(Demo)"): Grade R, Grade 2, Grade 7, and one high-school Grade 8.
- Each list has `slug`, `school` and `grade`, plus `items` of `{ "product", "option"? , "qty" }`. Every item references a real product slug and option key.
- Make each list realistic for that grade. A Grade 8 list needs a scientific calculator, a maths set, hardcover books and more.

### `stock-movements.json`
The stock history from **2026-08-01 to 2026-11-04**. Each movement:

| Field | Rules |
|---|---|
| `id` | `MV-000001` onwards, unique |
| `sku` | A product SKU, or an option SKU for products with options |
| `type` | `opening`, `receive`, `sale`, `return`, `adjust` or `stocktake` |
| `qty` | A signed integer: positive in, negative out |
| `at` | UTC ISO timestamp during SA trading hours (06:00–16:00 UTC). Mostly Monday to Saturday. |
| `reference` | `PO-1xxx` for receipts, `ORD-2xxxx` for sales and returns, and a short reason for adjustments (e.g. "Damaged in store") |

**Rules:**
- **Every SKU starts with one `opening` movement on 2026-08-01, and its movements add up exactly to its current stock.** This is the most important check.
- **Stock never goes negative** at any point in time.
- **Receipts follow the reorder rules:** when stock drops near `reorderPoint`, a receipt of about `reorderQty` arrives after the supplier's lead time.
- **Seasonal patterns should be believable:** planners, diaries and calendars pick up in October and November, gifts in November, and school items steady with a rise from late October.
- **Low-stock and sold-out products end where `products.json` says they are,** and the history should show why (sold down, with no receipt yet).
- **Volume:** roughly 15–40 movements per SKU, so about 2,500–4,500 in total.

### `README.md`
A short summary covering:
- counts per category and per subcategory
- the list of products in each scenario (low stock, sold out, specials, options, bulk)
- any judgement calls you made
- the validation results below

---

## Validation (run these yourself before reporting)

- [ ] All 48 original products are byte-for-byte identical in the original fields.
- [ ] 120 products, 20 per category, and every subcategory has at least one.
- [ ] Slugs, SKUs and barcodes are all unique, and every EAN-13 check digit is correct with a 20–29 prefix.
- [ ] All money fields are integers. A special or bulk price is always lower than the regular price. Cost is below the ex-VAT price.
- [ ] For every SKU, the movements add up to current stock and never go below zero.
- [ ] Every school-list item, supplier reference, category and subcategory resolves to a real record.
- [ ] No real brand, school, company or person names. A quick search on each new brand and school name finds no real stationery brand or SA school.
- [ ] Every file is valid JSON (UTF-8, 2-space indent).

---

## Report back with

- the README summary
- the validation checklist, ticked
- anything you couldn't satisfy, and why

Don't edit any code. The team wires the data in.
