# POC Product Images: Brief for Astra

**For:** Astra
**Status:** v2 (2026-11-05). Now covers the full 120-product catalogue. These are temporary images for the proof of concept. Real product photos replace them before launch.

---

## What and why

We need placeholder product photos for all **120 fictional products in `seed/data/products.json`** (the inventory you built), so the demo web store and app look like a real shop. Every image must look like real studio product photography, and the whole set must look like it came from the same studio on the same day.

**`seed/data/products.json` is the shot list.** For each product, use its `slug`, `name` and `specs`, and above all its `imageNotes`. For products with options, use `options.values[].key`, `label` and `swatch`.

That's **150 product images and 8 banner images** (counts below).

---

## Process

1. **Style test first.** Make these 6 images and put them in `seed/images/_test/`:
   - `hb-pencils-12`
   - `notebook-a5-dotted--blush`
   - `backpack-25l--navy`
   - `maths-set-9`
   - `acrylic-paint-12`
   - `stapler-full-strip`

   Then **stop and report.** We approve the look before you make the rest.
2. **Batch 1:** Writing and Paper & Books (40 products).
3. **Batch 2:** School and Art & Craft (40 products).
4. **Batch 3:** Office & Filing and Gifts & Planners (40 products), the gallery extras, and the banners.

Report after each batch.

---

## Photo style

- **Size:** square, 2000×2000px.
- **Background:** transparent (PNG with alpha), product only, no shadow. The UI adds a consistent shadow and tile colour, so the images work in both light and dark mode. If transparency isn't possible, use pure white and tell us.
- **Light:** soft studio key light from the top left, gentle fill, no harsh reflections. The same light on every image.
- **Camera:** front three-quarter view from slightly above (about 15–20°). Flat items read better top-down (paper clips, sticky notes, label sheets); the image notes say which.
- **Framing:** the product fills about 75% of the frame, centred, with the same margin on every image.
- **Materials:** realistic. Paper fibre, matte plastic, brushed metal, linen, wood grain. Real-world proportions.
- **Colours:** realistic. A few products use the brand's dark pink (`#B3125F`) or blush where the image notes say so. Don't make everything pink.

---

## Variants, pack sizes and galleries

- **Colour variants and pack sizes:** one image per option, identical pose and framing. Only the colour or quantity changes. Name them `<slug>--<option key>.png`, using the exact `key` from `products.json`, for example `backpack-25l--pink.png` or `exercise-book-a4-72--10-pack.png`. Match each colour to its `swatch` hex. Products with options don't get a plain `<slug>.png`.
- **Galleries** (the 6 products marked Gallery in the seed doc) get two extra images:
  - `<slug>--detail.png`: a close-up of what makes the product good (nib, stitching, texture, mechanism). Transparent background.
  - `<slug>--in-use.png`: the product styled on a desk surface, with a background (not transparent). Warm paper tones with dark-pink accents.
  - For a gallery product that has colour options, use its first-listed colour.

**Counts:** 110 single products, 28 option images (10 products with options) and 12 gallery extras make **150 product images**. The products with options are:
- `mechanical-pencil-05`, `exercise-book-a4-72`, `notebook-a5-dotted`, `backpack-25l`
- `ballpoint-pen-retractable`, `notebook-a6-ruled`, `backpack-18l`
- `poster-paint-500ml`, `ring-binder-a4-2ring`, `diary-2027-a5-daily`

---

## Hero banners (for the CMS home screen)

Four scenes: **back to school**, **office essentials**, **art & craft**, and **specials**. Each comes in two crops:
- **Web:** 2400×1200. Keep the left 45% calm and uncluttered for overlaid text.
- **Mobile:** 1200×1500. Keep the top 40% calm.

Make them desk flat-lays and arrangements of products from the seed catalogue. Natural light, warm paper tones, dark-pink accents, no people. That's **8 banner images**.

---

## Hard rules

- **No real brands.** No logos, brand names, or recognisable product designs (a famous pen's barrel shape, a pencil maker's stripes, a well-known notebook's elastic-and-pocket look). Use generic or fictional designs only.
- **No text** on products or packaging. Labels and covers are blank or plain colour blocks. Where an item naturally carries markings (ruler ticks, protractor scale, calculator keys), they must be correct and evenly spaced, or cleanly left off.
- **No AI tells.** Reject and redo anything with:
  - garbled glyphs
  - melted or merged parts
  - wrong counts: a 10-pack shows 10, a 24-tin shows 24
  - impossible reflections or warped perspective
  - mismatched spiral coils or hexagon faces
- **No people and no hands.**
- **Never use images taken from the web,** not even as a starting point.

---

## Delivery

```
seed/images/
  _test/                            style test (step 1)
  products/<slug>.png               single products
  products/<slug>--<option>.png     colour variants and pack sizes
  products/<slug>--detail.png       gallery extras
  products/<slug>--in-use.png
  banners/banner-<scene>-web.jpg
  banners/banner-<scene>-mobile.jpg
  credits.md
```

- **File formats:** product cut-outs as PNG; banners and `--in-use` shots as high-quality JPEG (about 85% quality).
- **`credits.md`:** one line per image with the filename, the tool or model used, and the full prompt. This lets us regenerate or tweak any image consistently later.

---

## QA before every hand-back

- [ ] Laid out in one grid, all images share the same light, angle, margin and colour temperature, so they read as one shoot.
- [ ] Every image matches its product in the seed doc: count, colours, size.
- [ ] No text, logos or AI artefacts at 100% zoom.
- [ ] Option images are identical except for the colour or quantity.
- [ ] Filenames match the slugs exactly.
