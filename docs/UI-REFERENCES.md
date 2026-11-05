# UI References: What "Premium" Means for Alert Stationers

**For:** everyone building screens or assets (the team and Astra).
**Source:** six reference app designs the team picked on 2026-11-05. The screenshots belong in `docs/ui-references/`.

We take the **feel and the patterns** from these references, then apply our own brand: dark pink, ink, warm paper, our icons, our photography. We never copy their layouts pixel for pixel, or their artwork, products or illustrations.

---

## The six references, and what we take from each

| Reference | What we take |
|---|---|
| **Electronics store** (soft lavender) | A search pill with a scan button inside it. A promo banner carousel with a product breaking out of the card. Category tiles with product cut-outs. Colour options as pill chips with a swatch. A quantity stepper. A cart with a promo-code field and a clear totals block. |
| **Local market** (warm cream, deep red) | **Warm cream page background.** The brand colour used as a big surface (the top half of onboarding). A dark ink banner card with a white pill button. Product tiles on soft coloured backgrounds with a **white circular heart button** in the corner. Elegant display type. An icon-only bottom tab bar. |
| **Luxury auction** (light grey) | Restraint: lots of air, thin type, small uppercase labels, quiet pill buttons. |
| **Virtual try-on** (white, glass) | **Big headline with an italic second line**, which fits our italic wordmark. Frosted-glass info cards over imagery. **A floating dark pill tab bar** with one accent button. Filter chips as soft pills. |
| **Fresh grocery** (pastel tiles) | Each product on its own **pastel tile**. A **dark "% OFF" pill** at top left. A **"+" quick-add button in a notch cut into the tile corner.** Prices with "(was R…)". A vertical category rail. |
| **Shopping-list sheet** | **A bottom sheet for adding a whole list: Upload image · Take photo · Type your list,** plus saved lists. This is our school-list feature almost exactly. |

---

## Principles

1. **Warm paper, not white.** Pages sit on warm paper (`--paper`); cards are white or softly tinted.
2. **Products live on tinted tiles.** Every product image is a cut-out on a rounded tile in one of six soft tints (blush, sand, sage, sky, lilac, butter). That's why Astra delivers product photos on transparent backgrounds.
3. **Big radii, pill controls.** Cards about 24–32px radius. Buttons, chips, search and badges are full pills. Icon buttons are circles.
4. **Ink is the primary action.** Primary buttons are ink pills (they invert in dark mode). On ink or pink surfaces, buttons are white pills. **Dark pink marks brand moments:** specials, prices on sale, active states, counts and highlights.
5. **Brand colour as a surface.** Hero cards, onboarding tops and special promos use solid ink or dark pink as the background, with type knocked out in white or paper.
6. **Bold headline, italic accent.** Display type is heavy, with the key phrase in italic. That echoes the logo's forward-leaning wordmark.
7. **Corner buttons on tiles.** The white circular heart (wishlist) and the notched "+" (quick add) sit in tile corners. They appear only once they actually work. We never show a control that does nothing.
8. **Floating dark tab bar in the app.** A pill-shaped tab bar floating above the content, icons only, with the bag as the accent.
9. **Bottom sheets for quick tasks** in the app: add a school list, choose a colour, pick delivery.
10. **Calm motion.** Elements arrive quickly and settle (§2.4 of the asset brief). Nothing loops for attention except live indicators.

---

## Typefaces

These are the closest Google Fonts to the references, in use until the client confirms a brand typeface.

| Role | Font | Closest to |
|---|---|---|
| Headings and all UI text | **Plus Jakarta Sans** (200–800, with true italics) | The friendly geometric sans of the electronics, grocery and shopping-list screens. Its heavy italic echoes the logo's wordmark. |
| Accent phrases only ("One tap.", "Sorted.", grade names, product placeholders) | **Fraunces italic** | The elegant serif of the local-market screen. |

Those screens look like they use Google Sans itself, but that's Google's own brand typeface and only goes to weight 700. We don't use it for a client's brand.

## What this means for Astra's assets
- **Product photos:** cut-outs on transparent backgrounds that look great on any of the six tints. No baked-in backgrounds (already in the POC brief).
- **Banners:** compose product clusters as transparent cut-outs, so the UI can place them on brand-coloured rounded cards and let a product break out of the card edge (see the POC brief).
- **Onboarding art** sits on a **dark pink or ink** surface, as in the local-market reference. Palettes must hold up on both.
- **Icons:** clean, medium-weight line icons that read well inside white circular buttons and inside a dark floating tab bar.
- **Needed icons this confirms:** `scan-document`, `camera`, `upload`, `edit` (type your list), `heart` in outline and filled, `plus` for quick add, `minus` and `plus` for steppers, and `voucher` for the promo-code field.
