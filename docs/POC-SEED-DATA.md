# Alert Stationers: Proof-of-Concept Seed Data

**Status:** Proposal. This is a fictional catalogue for the proof of concept (POC). None of it is real stock, and none of it ships to production. Every seed record is flagged as demo data so it can be wiped in one step before launch.

---

## What the POC has to prove

The seed data is built around one demo script, and every product in it is there for a reason.

1. **One account, two devices.** Sign in as the same customer on the web store and in the app, side by side.
2. **Cart sync.** Add the gel pens on web, and they appear in the app's bag within about a second. Change the quantity in the app, and web updates.
3. **Live CMS.** In the admin, put the highlighters on special. The price and sale badge update on both screens without a refresh.
4. **The last one.** Two shoppers check out the fountain pen (stock: 1) at the same moment. Exactly one gets it. The other sees "sold out" before paying.
5. **Pay on one, track on the other.** Pay in the app (sandbox payment). The order appears on the web order page, and its status updates live.
6. **Fulfilment.** Mark the order shipped in the admin. A push notification arrives on the phone, and the web order timeline updates.
7. **Stock is true everywhere.** The admin stock screen shows every sale and reservation as it happens.

Also on show: colour variants with one colour sold out, pack sizes, bulk pricing, low-stock and back-in-stock states, a countdown special, and adding a whole school list in one tap.

---

## Catalogue: 48 products in 6 categories

Prices are in rand, VAT inclusive, and roughly realistic for SA retail. **Brands are fictional.** Check that none clash with a real stationery brand before the demo. "Image notes" feed the image brief (`docs/astra/POC-PRODUCT-IMAGES-BRIEF.md`). **Gallery** products get three images.

### Writing
| # | Slug | Product | Brand | Price | Stock | Demo role | Image notes |
|---|---|---|---|---|---|---|---|
| 1 | `ballpoint-pens-blue-10` | Ballpoint Pens, Blue, 10-pack | Northline | 49.99 | 180 | School list | Clear barrels, blue caps, fanned out (10 pens) |
| 2 | `gel-pens-6` | Gel Pens, 6 colours | Northline | 74.99 | 60 | **Cart-sync demo** | Six pens in a row, rainbow order |
| 3 | `hb-pencils-12` | HB Pencils, 12-pack | Northline | 44.99 | 240 | School list | Hexagonal, sharpened, ink-black bodies (12) |
| 4 | `mechanical-pencil-05` | Mechanical Pencil 0.5mm | Northline | 39.99 | pink 40 · black 55 · teal **0** | **Variants, one sold out** | Same pose for each colour |
| 5 | `highlighters-4` | Highlighters, 4-pack | Northline | 69.99 (special R54.99 applied live in step 3) | 150 | **Live special** | Chisel tips: yellow, pink, green, orange |
| 6 | `fineliners-10` | Fineliners, 10 colours | Northline | 179.99 | **3** | **Low stock** | Fan of slim pens in a soft wallet |
| 7 | `fountain-pen-steel` | Fountain Pen, Brushed Steel | Northline | 449.99 | **1** | **The last one** · Gallery | Uncapped, nib visible |
| 8 | `whiteboard-markers-4` | Whiteboard Markers, 4-pack | Northline | 79.99 | **0** | **Back-in-stock alert** | Black, blue, red, green, bullet tips |

### Paper & Books
| # | Slug | Product | Brand | Price | Stock | Demo role | Image notes |
|---|---|---|---|---|---|---|---|
| 9 | `exercise-book-a4-72` | A4 Exercise Book, 72 pages | Paperleaf | single 14.99 · 10-pack 129.99 | 500 · 60 | **Pack sizes** · School list | Pale cover with a blank name-label box; the 10-pack is a tied stack of 10 |
| 10 | `hardcover-book-a4-192` | A4 Hardcover Book, 192 pages | Paperleaf | 54.99 | 120 | School list | Navy hardcover at a slight angle |
| 11 | `notebook-a5-dotted` | A5 Dotted Notebook | Paperleaf | 149.99 | blush 30 · ink 45 · sage 25 | Variants · Gallery | Linen cover, elastic band |
| 12 | `printing-paper-a4-80` | A4 Printing Paper, 80gsm, 500 sheets | Paperleaf | 109.99, or 99.99 each for 5+ reams | 300 | **Bulk pricing** | Wrapped ream, plain wrapper |
| 13 | `sticky-notes-76-4` | Sticky Notes 76×76, 4 pads | Paperleaf | 34.99 | 200 | — | Four pastel pads, staggered, top-down |
| 14 | `notepad-a4-spiral` | A4 Spiral Notepad, Ruled | Paperleaf | 39.99 | 90 | — | Top-bound spiral, ruled lines visible |
| 15 | `envelopes-dl-25` | DL Envelopes, 25-pack | Paperleaf | 39.99 | 70 | — | White envelopes, fanned |
| 16 | `graph-book-a4` | A4 Graph Paper Book | Paperleaf | 24.99 | 150 | — | Open to show the grid |

### School
| # | Slug | Product | Brand | Price | Stock | Demo role | Image notes |
|---|---|---|---|---|---|---|---|
| 17 | `backpack-25l` | School Backpack, 25L | Little Scholar | 549.99, on special at 494.99 (10% off) | navy 25 · pink **2** · grey 18 | Variants · Special · Low stock · Gallery | Front three-quarter view |
| 18 | `pencil-case-zip` | Zip Pencil Case | Little Scholar | 89.99 | 110 | School list | Fabric case, half open with pencils |
| 19 | `maths-set-9` | Maths Set, 9 pieces | Little Scholar | 59.99 | 140 | School list | Open tin: compass, protractor, set squares |
| 20 | `ruler-30cm` | 30cm Ruler, Shatterproof | Little Scholar | 12.99 | 300 | School list | Clear ruler, evenly spaced ticks |
| 21 | `erasers-2` | Erasers, 2-pack | Little Scholar | 14.99 | 260 | School list | White blocks, one in a sleeve |
| 22 | `sharpener-double` | Double Sharpener with Canister | Little Scholar | 19.99 | 220 | School list | Translucent canister |
| 23 | `book-covering-5m` | Book Covering Roll, Clear, 5m | Little Scholar | 44.99 | 180 | School list | Rolled clear film with a slight sheen |
| 24 | `name-labels-60` | Iron-on Name Labels, 60 | Little Scholar | 59.99 | 80 | School list (Gr 1) | Sheet of blank labels |

### Art & Craft
| # | Slug | Product | Brand | Price | Stock | Demo role | Image notes |
|---|---|---|---|---|---|---|---|
| 25 | `colour-pencils-24` | Colour Pencils, 24 | Fynbos Studio | 94.99 | 130 | School list | Open tin, spectrum order (24) |
| 26 | `wax-crayons-24` | Wax Crayons, 24 | Fynbos Studio | 44.99 | 160 | School list (Gr 1) | Open box, crayons fanned |
| 27 | `acrylic-paint-12` | Acrylic Paint Set, 12 × 22ml | Fynbos Studio | 229.99, on special at 179.99 | 55 | Special · Gallery | Tubes in a row, one squeezed |
| 28 | `brush-set-10` | Brush Set, 10 | Fynbos Studio | 84.99 | 60 | — | Wooden handles, fanned |
| 29 | `sketchbook-a4` | A4 Sketchbook, 110gsm | Fynbos Studio | 109.99 | 75 | — | Black cover, wire-bound |
| 30 | `glue-sticks-3` | Glue Sticks, 3-pack | Fynbos Studio | 29.99 | 280 | School list | One stick uncapped |
| 31 | `craft-scissors-13cm` | Craft Scissors, 13cm | Fynbos Studio | 39.99 | 150 | School list | Rounded tips, dark-pink handles |
| 32 | `modelling-clay-10` | Modelling Clay, 10 colours | Fynbos Studio | 44.99 | 90 | — | Bars laid out in a spectrum |

### Office & Filing
| # | Slug | Product | Brand | Price | Stock | Demo role | Image notes |
|---|---|---|---|---|---|---|---|
| 33 | `stapler-full-strip` | Full-strip Stapler | Deskwise | 139.99 | 45 | — | Ink-black metal, three-quarter view |
| 34 | `staples-26-6-5000` | Staples 26/6, 5000 | Deskwise | 24.99 | 200 | — | Small box with a strip beside it |
| 35 | `punch-2-hole` | 2-hole Punch | Deskwise | 109.99 | 35 | — | Metal punch, guide bar out |
| 36 | `lever-arch-file-a4` | Lever Arch File, A4 | Deskwise | 44.99 | 150 | Business buyer | Blank spine label |
| 37 | `display-book-20` | Display Book, 20 pockets | Deskwise | 34.99 | 140 | — | Translucent cover |
| 38 | `desk-organiser-mesh` | Mesh Desk Organiser | Deskwise | 219.99 | 25 | — | Black mesh, filled with pens |
| 39 | `tape-dispenser` | Tape Dispenser + 2 Rolls | Deskwise | 74.99 | 60 | — | Weighted base |
| 40 | `paper-clips-100` | Paper Clips, 100 | Deskwise | 14.99 | 300 | — | Small silver heap, top-down |

### Gifts & Planners
| # | Slug | Product | Brand | Price | Stock | Demo role | Image notes |
|---|---|---|---|---|---|---|---|
| 41 | `planner-2027-a5` | 2027 Weekly Planner, A5 | Paperleaf | 249.99, on special at 199.99 | 65 | **Countdown special** · Gallery | Dark-pink cloth cover, ribbon marker, no year printed |
| 42 | `desk-calendar-2027` | 2027 Desk Calendar | Paperleaf | 129.99 | 50 | — | Tent calendar, grid with no legible text |
| 43 | `pen-gift-set` | Pen & Pencil Gift Set | Northline | 379.99 | 20 | Gallery | Open gift box, satin lining |
| 44 | `journal-linen-a5` | Linen Journal, A5 | Paperleaf | 229.99 | 35 | — | Oatmeal linen, debossed shape (no text) |
| 45 | `watercolour-tin-24` | Watercolour Gift Tin, 24 | Fynbos Studio | 349.99 | 15 | — | Open tin with pans and a water brush |
| 46 | `calligraphy-set` | Calligraphy Starter Set | Northline | 289.99 | 12 | — | Nib holder, nibs, ink bottle with a blank label |
| 47 | `gift-wrap-3` | Gift Wrap, 3 Sheets | Paperleaf | 29.99 | 200 | — | Folded sheets, dark-pink pattern |
| 48 | `greeting-cards-6` | Blank Greeting Cards, 6 | Paperleaf | 59.99 | 80 | — | Fanned cards with envelopes |

### Scenario summary
| Scenario | Products |
|---|---|
| Last unit (race to buy) | `fountain-pen-steel` (1) |
| Out of stock / back-in-stock alert | `whiteboard-markers-4` (0); `mechanical-pencil-05` teal (0) |
| Low stock badge | `fineliners-10` (3); `backpack-25l` pink (2) |
| Specials | `backpack-25l`, `acrylic-paint-12`, `planner-2027-a5` (with countdown), `highlighters-4` (applied live in the demo) |
| Colour variants | `mechanical-pencil-05`, `notebook-a5-dotted`, `backpack-25l` |
| Pack sizes | `exercise-book-a4-72` (single, 10-pack) |
| Bulk pricing | `printing-paper-a4-80` (5+ reams) |
| Image galleries | `fountain-pen-steel`, `notebook-a5-dotted`, `backpack-25l`, `acrylic-paint-12`, `planner-2027-a5`, `pen-gift-set` |

---

## School lists

Both lists belong to a fictional school: **Protea Heights Primary (Demo)**. It always shows with "(Demo)" so nobody mistakes it for a real school partnership.

**Grade 4:** `hb-pencils-12` ×1 · `ballpoint-pens-blue-10` ×1 · `erasers-2` ×1 · `sharpener-double` ×1 · `ruler-30cm` ×1 · `maths-set-9` ×1 · `exercise-book-a4-72` (single) ×6 · `hardcover-book-a4-192` ×2 · `colour-pencils-24` ×1 · `glue-sticks-3` ×1 · `craft-scissors-13cm` ×1 · `book-covering-5m` ×1 · `pencil-case-zip` ×1

**Grade 1:** `wax-crayons-24` ×1 · `hb-pencils-12` ×1 · `erasers-2` ×1 · `sharpener-double` ×1 · `glue-sticks-3` ×2 · `craft-scissors-13cm` ×1 · `exercise-book-a4-72` (single) ×4 · `pencil-case-zip` ×1 · `name-labels-60` ×1

---

## Demo people

| Person | Role in the demo |
|---|---|
| Thandi M. | Parent. Buys the Grade 4 list and uses both web and app. |
| Sam K. | Second shopper in the fountain-pen race. |
| Pieter V. | Office manager with a business account. Buys printing paper in bulk. |
| Staff: owner, stock clerk, content editor | One admin login for each role, to show permissions. |

- **Emails:** use a domain we control so order and shipping emails really arrive during the demo. Otherwise use `example.com`.
- **Addresses:** real suburb names and postal codes, which courier sandbox quotes need, with fictional street addresses. Use the client's city once we know it.
- No real people, schools or businesses appear anywhere.

---

## Images

All product and banner images are **placeholders** generated for the POC (see `docs/astra/POC-PRODUCT-IMAGES-BRIEF.md`). They live in `seed/images/` and are replaced with real product photos before launch. Selling with pictures that aren't the actual product would mislead buyers.
