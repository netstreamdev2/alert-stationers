# Alert Stationers: Brand Asset Brief

**For:** Astra (asset design)
**From:** the Alert Stationers build team
**Status:** Draft v2. §2 is filled in provisionally from low-resolution logo images. The master SVG logo is on its way. Phases 0 and 1 can start from the reference images, but final production waits for the master file and the client's confirmed colours.

---

## 0. How to work through this brief

You're designing every custom visual asset for a new stationery e-commerce platform: a website, an iOS/Android app, and a staff admin. That's roughly **300 icons, 22 illustrations, a 5-slide onboarding sequence, about 35 decorative pieces, and the full set of app-store and web platform assets.**

Work in gated phases. **Stop at the end of each phase and report back.** Don't skip ahead: 300 icons in an unapproved style means redoing all 300.

| Phase | What | Output |
|---|---|---|
| 0 | Study the logo and write geometry notes | `brand/exploration/00-logo-analysis.md` |
| 1 | Three style directions on a small test set | `brand/exploration/direction-a/`, `-b/`, `-c/` |
| — | **Stop.** We pick a direction (possibly a mix) and send notes. | |
| 2 | Production in five batches (§12) | folders per §4 |

After each batch: update the manifest (§10), regenerate the preview sheets, run the QA checklist (§11), and report what's done, what's open, and any judgement calls you made.

### Phase 0: Logo analysis
The team's starting notes are in §2.2. Before drawing anything, check them against the files in `brand/source/` (and the master SVG once it arrives). Then write a one-page `00-logo-analysis.md` that confirms, corrects and extends them. Cover:
- **Geometry:** dominant shapes, angles, corner treatment (sharp or rounded, and how much), stroke terminals (round, flat, angled), stroke contrast, proportions. Measure the wordmark's slant angle, and the radius and taper of the arrow curves.
- **Family resemblance:** 3–5 concrete rules that would make the icons feel related to the logo.
- **Colour:** which §2 colours the logo uses and how they're balanced.
- **What not to imitate:** anything in the logo too decorative to survive at 16px.

### Phase 1: Style exploration
For each of directions A, B and C (§3), make the same test set:
- **13 UI icons (outline):** `home`, `search`, `bag` (also the pencil signature version, see §6.1), `heart`, `user`, `school-list`, `truck`, `edit`, `tag-sale`, `check-circle`, `package`, `bell`, and `refresh` in the logo's arrow style (§2.2). Also filled versions of `home`, `bag`, `heart`, `user`.
- **4 spot icons:** `cat-notebooks`, `cat-pencils`, `spot-free-delivery`, `spot-school-lists`.
- **1 empty state:** `empty-bag`.
- **1 onboarding slide:** `onboarding-01-welcome` (layers not required yet).
- **1 symbol-only mark and 1 app icon concept**, for client approval (see §2.2): the mark as SVG and the app icon as a 1024px PNG, each with a mock at 40px and at 16px.
- **1 preview sheet** with all of the above on both paper and ink backgrounds.
- **A rationale** of 5 sentences or fewer: how it ties to the logo, where it's strongest, and its main risk.

Then **stop and report.**

---

## 1. The project

Alert Stationers is a South African stationery retailer moving to a new platform:
- **Web store** (Next.js): customers browse, buy and track orders.
- **Mobile app** (Expo / React Native, iOS + Android): the same store, plus push notifications, school-list tools and richer animation.
- **Admin / CMS** (web): staff manage stock, orders, specials, and what appears on the home screens.

Customers range from parents buying a child's school list in January, to students and artists, to offices ordering supplies on account. Prices are in rand (R). Delivery is by courier, pickup point or locker, or collection in store.

Everything you make gets rendered in code. SVGs become React and React Native components, they're recoloured by theme (light and dark), and many are animated. That's why the technical rules in §4 matter as much as the drawing.

---

## 2. Brand inputs

### 2.1 Logo files
- `brand/source/reference/logo-digital-lowres.png`: the digital logo, in bright magenta. Low resolution, for reference only.
- `brand/source/reference/logo-signage-photo.png`: a photo of the backlit store sign, in dark raspberry. It shows how the brand looks in the real shop.
- **`brand/source/alert-stationers-logo-master.svg`: the client's master logo (received 2026-11-05).** This is the source of truth. It's a flat version (no drop shadow) on a white square. It appears to be auto-traced, so check edge quality at large sizes and flag anything lumpy.
- `brand/derived/logo-badge.svg`: the web copy, cropped to the badge, with a transparent outside and a white disc behind it.

Everything in `brand/source/` is read-only. Never edit or re-export these files.

### 2.2 What the logo tells us (team's starting notes; confirm them in Phase 0)
- **Form:** a circular badge: outer ink ring, inner pink ring, white field. The digital version adds an offset grey drop shadow. That's a print/signage effect; don't carry it into icons.
- **Signature motif:** two thick curved arrows chasing each other around the circle. The ink arrow on top runs clockwise and the pink arrow below comes back round. Each body is a crescent: it swells from a thin tail to a thick middle and ends in a chunky, slightly blunt arrowhead. It reads as always moving, always restocked, "we've got it". **This is the most ownable shape in the brand.**
- **Wordmark:** heavy, slightly condensed italic sans with a forward slant (roughly 10–12°; measure it). Two-tone: ALERT in pink (attention), STATIONERS in ink (substance). The energy is fast, bold and sporty, not delicate.
- **Colour logic:** pink means attention and action, ink carries everything solid. The UI does the same: pink marks what you should notice or tap.
- **Two colour versions exist:** bright magenta on the digital logo and dark raspberry on the store sign. We're asking the client which one is official. The UI uses a dark pink that sits between the two (§2.3).

What this means for the assets:
1. **Lean bold.** Confident stroke weights, chunky shapes, high contrast. Hairline, delicate styles clash with this logo.
2. **Every circular or returning arrow uses the logo's arrow:** crescent body, chunky head. That covers `refresh`, `sync`, `reorder`, `return`, `refund` and the loaders. It's the brand's signature gesture.
3. **One forward angle.** Decorative elements (highlight swipes, washi tape, sale tags, doodle arrows) tilt at the wordmark's slant angle. Measure it once and use it everywhere.
4. **UI icons stay upright.** Never italicise an icon.
5. **Small sizes need a symbol-only mark.** The full badge with its wordmark won't read below about 64px. Favicons, the app icon, the notification icon and the loaders need the two arrows in the ring, with no wordmark and no drop shadow. That changes the logo, so propose it in Phase 1; it's used only after the client approves it.

### 2.3 Colour (provisional)
The logo colours are now exact, taken from the master SVG. The UI colours are ours. They're live as design tokens in `apps/web/src/app/globals.css`, and that file wins if the two ever differ.

| Role | Light mode | Dark mode | Use |
|---|---|---|---|
| **Dark pink** (primary) | `#B3125F` | `#F2559A` | Buttons, links, active states, key UI accents. White text on `#B3125F` is about 6.6:1. |
| Dark pink, pressed | `#940E4E` | `#FF7AB3` | Pressed and hover states |
| Pink tint | `#FCE9F2` | `#3A1528` | Soft backgrounds, selected rows |
| **Highlighter magenta** | `#F805F7` (exact logo value) | same | Large decorative accent shapes only: highlight swipes, spot-icon accents. Never text or thin lines, because its contrast is too low. |
| Orchid | `#A7538E` (exact, the logo's lower arrow) | `#C97BC0` | Secondary illustration colour. Use sparingly. |
| **Ink** | `#1F1B1E` | `#F4EFF2` | Strokes and text |
| **Paper** | `#FAF7F2` (warm, per the UI references) | `#151214` | Page background |
| Surface | `#FFFFFF` | `#1E1A1D` | Cards and sheets |
| Success | `#1E7A4C` | `#4CC38A` | Always shown with an icon and text |
| Warning | `#A86200` | `#F0A43A` | Always shown with an icon and text |
| Error | `#C8410F` | `#FF7A4D` | Deliberately orange-red so it never reads as brand pink. Always shown with an icon and text. |

The logo itself (exact, from the master SVG): ink `#2C2C2B`, magenta `#F805F7`, orchid `#A7538E`. The store sign's raspberry (`≈ #8E1F45`, estimated from a photo) awaits the client's answer on which pink is official.

**Typefaces (interim, until the client confirms a brand typeface):** Plus Jakarta Sans for headings and UI, and Fraunces italic for short accent phrases. You won't set type in assets, but illustrations should sit comfortably next to both.

### 2.4 Personality
**Bold, quick, dependable, a little playful.** The name says it: alert means on it, fast, paying attention. The arrows say always moving. This is the shop that has your child's school list ready and your office order out the door today. The pink is confident and energetic, never pastel-sweet or toy-shop.

**Motion** (structure your animation groups for this): brisk and forward. Things arrive quickly and settle with a small, confident overshoot. Never floaty or slow.

---

## 3. Creative direction

### What "tailored" means here
The brand fingerprint comes from three places, in order of importance:
1. **The logo's geometry.** Corner radius, stroke terminals, angles, stroke contrast and proportions come from the logo (Phase 0), not from an existing icon library.
2. **Stationery-native metaphors.** Where you have a choice, take the metaphor from the shop's own world: edit is a real pencil, school lists are a clipboard checklist, emphasis is a highlighter swipe, dividers are torn paper or a ruled margin line.
3. **Personality scales with size.** UI icons at 16–24px are clean, quiet and instantly readable; usability wins. Spot icons at 48px carry the brand accent. Illustrations and onboarding are where the personality gets loud.

### Starting points for the three Phase 1 directions
These are revised to fit the logo (§2.2). They're prompts, not specs.
- **A: Ink & Highlighter.** Bold, even ink strokes. Spot icons and illustrations get an offset highlighter-magenta swipe behind the object, tilted at the wordmark's slant. The logo's magenta really is a highlighter colour, so this maps straight onto the brand. Clean and very usable.
- **B: Paper Cut.** Chunky filled forms with cut-out details, echoing the logo's solid arrows, as if cut from coloured card and layered. Pink is a dominant fill in spot icons and illustrations; UI icons stay outline. Warm and tactile.
- **C: Full Circle.** Built around the logo's movement: crescent curves, the circular badge as a container for spot icons, forward-leaning energy in the illustrations. The most ownable direction. Its risk is overusing arrows and circles until things get noisy, so show where it stops.

### Hard no's (the generic AI look)
- Generic flat "corporate people" (big limbs, tiny heads), glossy 3D clay blobs, purple-to-blue gradients, random sparkles, and floating abstract shapes that mean nothing.
- Anything that reads as Lucide, Heroicons, Material Symbols, Phosphor or SF Symbols with small changes. Draw originals.
- **Text or lettering inside any image.** All copy is live text so it can be translated, edited in the CMS and read by screen readers.
- Recognisable branded products, such as a specific pen brand's barrel design or a pencil maker's trademark stripes. Draw generic stationery forms.
- Auto-traced raster art passed off as vector (thousands of nodes, wobbly edges). Build vectors deliberately. If something can only be done as raster, say so and deliver PNG.

---

## 4. Global technical rules

### Formats at a glance
| Asset type | Master | Also export |
|---|---|---|
| UI and admin icons | SVG, 24×24 | — |
| Spot / category icons | SVG, 48×48 | — |
| Empty-state and system illustrations | SVG, 240×240 (+ `-dark` versions) | PNG @2x (480) and @3x (720) |
| Onboarding illustrations | Layered SVG, 1200×1200 | PNG at 400, 800 and 1200 |
| Decor, patterns, confetti, motion bases | SVG | — |
| Platform assets (app icon, splash, favicons, store, OG, email, pins) | Layered SVG source | The PNGs listed in §9 |

### SVG rules (these keep assets working in React Native)
- `viewBox` matches the grid exactly (`0 0 24 24`, `0 0 48 48`, …), with no offsets.
- **UI and admin icons are single-colour via `currentColor` only.** No hard-coded colours anywhere. Outline icons set `fill="none"` and `stroke="currentColor"` on the root; filled icons use `fill="currentColor"`.
- **Spot icons use exactly two colours.** Ink parts use `currentColor`. Accent parts go inside a group with `id="accent"`, filled with highlighter magenta from §2.3 (Phase 1 may also test dark pink). We swap the accent per theme in code.
- **Illustrations** use only the §2 palette plus at most two neutral tints. No other hues.
- **Keep strokes as strokes** in outline icons and doodles. Don't expand them to filled outlines. Strokes let us tune weight in code and animate a "drawn with a pen" effect.
- **Path order is drawing order.** Order paths, and draw each one in the direction a hand would draw it with a pen. Many icons will animate drawing themselves on.
- **Not allowed:** `<text>`, embedded raster images, `<style>` blocks, CSS classes, filters (blur, shadow, turbulence), masks, blend modes, `<foreignObject>`, `transform` attributes (flatten them), editor metadata (Illustrator, Inkscape or Figma namespaces), and any IDs except the layer IDs this brief specifies. Use `clip-path` only if there's no other way.
- **Gradients:** avoid them. If one is essential in an illustration, use linear or radial with at most 2 stops.
- **Size targets:** UI icon under 1.5 KB, spot icon under 5 KB, illustration under 40 KB, onboarding slide under 80 KB.

### Naming and folders
Names are lowercase kebab-case with no spaces, noun first then modifier: `bag-add`, `truck-fast`, `status-packed`. A filled variant has the same name as its outline and lives in `filled/`. A dark illustration takes a `-dark` suffix.

```
brand/
  source/                    client logo files (read-only)
  exploration/               Phase 0–1 work
  icons/
    ui/outline/
    ui/filled/
    spot/
    admin/
  illustrations/
    system/                  empty states, errors, permission primers
    onboarding/
  decor/                     tape, notes, doodles, patterns, confetti, motion bases
  platform/
    app-icon/  splash/  notification/  favicon/  og/  store/  email/  map-pins/  placeholders/
  preview/                   contact sheets
  manifest.json
```

---

## 5. Icon system

### UI icons (web store and app)
- **Grid:** 24×24 with 2px padding, so a 20×20 live area. Keyline shapes: circle Ø20, square 18×18, portrait rectangle 16×20, landscape rectangle 20×16.
- **Stroke:** 1.75px by default, because the logo is heavy. Phase 1 may test 2px, with reasons.
- **Caps, joins and corners** follow the logo analysis. Default: round caps and joins, 2px outer corner radius.
- Prefer 0°, 45° and 90° angles. Optical balance beats mathematical centring.
- Must be clearly legible at 16px and look refined at 24–32px.
- **Filled variants** (★ in §6) are for selected states such as the tab bar and an active wishlist heart. Each has the same silhouette and optical size as its outline, filled solid with interior details knocked out. Don't just thicken the stroke.

### Spot icons (category tiles, feature highlights, trust strips, permission prompts)
- **Grid:** 48×48 with 3px padding. **Stroke:** 2.5px. Two colours, per §4.
- Shown at 48–72px, so they carry more detail and personality than UI icons. Every spot icon shares the same accent treatment and level of detail.

### Admin icons
- Same rules as UI icons: 24px grid, outline only, `currentColor`. Staff use these all day, small, in dense tables and sidebars, so clarity beats charm. The admin may reuse any UI icon; only draw the ones listed in §6.10.

---

## 6. Icon inventory

Names are the filenames. The text after a dash describes what to draw where it isn't obvious. ★ means a filled variant is also needed.

### 6.1 UI: navigation and shell (24px)
`home`★ · `shop`★ — 2×2 grid of rounded squares (browse) · `search`★ · `bag`★ — shopping bag, the primary cart metaphor. In Phase 1, also try a signature version with a pencil peeking out · `heart`★ — wishlist · `user`★ · `school-list`★ — clipboard with a checklist · `bell`★ · `bell-off` · `menu` · `close` · `more-horizontal` · `more-vertical` · `arrow-left` · `arrow-right` · `arrow-up` · `arrow-down` · `arrow-up-right` · `chevron-left` · `chevron-right` · `chevron-up` · `chevron-down` · `external-link` · `link` · `share-ios` — box with an up arrow · `share-android` — three connected nodes · `settings`★

### 6.2 UI: actions
`plus` · `minus` · `check` · `edit` — a proper wooden pencil with a hexagonal body and sharpened tip · `trash` · `copy` · `refresh` · `undo` · `filter` · `sort` · `view-grid` · `view-list` · `upload` · `download` · `camera` · `image` · `scan-barcode` · `scan-document` — viewfinder corners over a page (scanning a printed school list) · `mic` · `zoom-in` · `zoom-out` · `expand` · `play` · `pause` · `eye` · `eye-off` · `lock` · `unlock` · `log-in` · `log-out` · `calendar` · `clock` · `globe` · `sun` · `moon` · `drag-handle`

### 6.3 UI: feedback and status
`check-circle`★ · `x-circle`★ · `info`★ · `warning`★ — triangle · `error`★ — octagon · `help-circle` · `wifi-off` · `star`★ · `star-half` · `thumbs-up` · `flag`

### 6.4 UI: commerce
`bag-add` · `bag-check` · `tag` · `tag-sale` — tag with % · `percent` · `voucher` — ticket with side notches · `gift` · `gift-card` · `wallet` · `credit-card` · `cash` — banknote with R · `bank` — EFT · `receipt` · `invoice` — document with R · `quote` — document with a pen (request a quote) · `package` · `package-open` · `return` — box with a curved back arrow · `refund` — coin with a return arrow · `reorder` — bag inside circular arrows (buy again) · `compare` · `history` — recently viewed · `bundle` — three items grouped · `bulk` — stacked boxes (bulk pricing) · `briefcase` — business account · `shield-lock` — secure checkout · `badge-check` — verified / quality · `in-stock` — box with a check · `low-stock` — box partly filled · `out-of-stock` — box with a slash · `back-in-stock` — box with a bell · `pre-order` — box with a clock · `price-drop` — tag with a down arrow · `points` — loyalty star on a coin

### 6.5 UI: delivery and collection
`truck` · `truck-fast` — with speed lines · `store` — shop front with a striped awning · `click-collect` — store with a bag · `pickup-point` — map pin holding a box · `locker` — grid of locker doors · `map-pin`★ · `map-pin-home` · `map-pin-office` · `map` · `route` — dotted path between two points · `directions` · `calendar-delivery` — calendar with a truck · `scale` — parcel weight · `dimensions` — box with measuring arrows

### 6.6 UI: order status (order timeline, one consistent family)
`status-placed` · `status-payment-pending` · `status-paid` · `status-picking` · `status-packed` — taped box · `status-ready-collect` · `status-shipped` · `status-out-for-delivery` · `status-delivered` · `status-cancelled` · `status-refunded` · `status-returned` · `status-on-hold`

These can share geometry with the commerce and delivery icons, but each needs its own file, and together they must read as one set in a vertical timeline.

### 6.7 UI: account, trust and support
`orders` · `addresses` · `payment-methods` — stacked cards · `privacy` — shield · `shield-check` — consent / POPIA · `document` — terms · `support` — headset · `chat` · `faq` · `phone` · `mail` · `review-write` — star with a pencil · `leaf` — eco / recycled · `map-za` — outline of South Africa, geographically accurate (check against a reference) · `guarantee` — rosette ribbon

### 6.8 Spot: categories (48px, provisional)
We'll match the final list to the client's real catalogue. Only produce this batch after we confirm it.
- **Writing and correction:** `cat-ballpoint-pens` · `cat-premium-pens` · `cat-pencils` · `cat-mechanical-pencils` · `cat-markers` · `cat-highlighters` · `cat-fineliners` · `cat-whiteboard-markers` · `cat-correction` · `cat-erasers` · `cat-sharpeners`
- **Paper and books:** `cat-exercise-books` · `cat-notebooks` · `cat-printing-paper` — a ream · `cat-sticky-notes` · `cat-notepads` · `cat-diaries-planners` · `cat-envelopes` · `cat-labels` · `cat-card-board` · `cat-display-books`
- **Filing and organisation:** `cat-files-folders` · `cat-lever-arch` · `cat-desk-organisers` · `cat-storage-boxes`
- **School:** `cat-school-bags` · `cat-pencil-cases` · `cat-maths-sets` — compass and protractor · `cat-calculators` · `cat-rulers` · `cat-book-covering` — plastic roll · `cat-name-labels` · `cat-school-lists` · `cat-back-to-school`
- **Art and craft:** `cat-paint-brushes` · `cat-colouring` — crayons / colour pencils · `cat-sketching` · `cat-glue` · `cat-scissors-cutting` · `cat-craft` · `cat-modelling`
- **Office:** `cat-staplers` · `cat-punches` · `cat-clips-pins` · `cat-tape` · `cat-boards` — whiteboard / notice board · `cat-laminating-binding` · `cat-shredders` · `cat-label-makers` · `cat-ink-toner` · `cat-office-tech` · `cat-office-furniture`
- **Gifts and packaging:** `cat-gift-sets` · `cat-cards-wrap` · `cat-packaging`

### 6.9 Spot: features, trust and permissions
`spot-free-delivery` · `spot-secure-payment` · `spot-easy-returns` · `spot-click-collect` · `spot-school-lists` · `spot-business-accounts` · `spot-live-stock` — box with a live pulse · `spot-specials` · `spot-gift-cards` · `spot-support` · `spot-reorder` · `spot-bulk-pricing` · `spot-notifications` · `spot-location` · `spot-camera`

### 6.10 Admin (24px, outline only)
- **Overview:** `dashboard` · `analytics` · `chart-bar` · `chart-line` · `chart-pie` · `revenue` — trend line with R · `activity` · `live` — broadcast dot · `system-health` · `error-log` — bug
- **Catalogue:** `products` · `variants` · `categories` — tree · `collections` · `brands` · `barcode` · `sku` — tag with # · `reviews-moderation`
- **Stock:** `inventory` · `stock-in` · `stock-out` · `stock-adjust` · `stock-transfer` · `stocktake` — clipboard with tally marks · `low-stock-alert` · `suppliers` · `purchase-order`
- **Orders and fulfilment:** `picking-list` · `packing-slip` · `print` · `label-print` · `credit-note`
- **Customers:** `customers` · `customer-groups` · `business-accounts`
- **Content and marketing:** `promotions` · `campaign` — megaphone · `banners` · `content-blocks` · `page-layout` · `media-library` · `image-crop` · `schedule` · `publish` · `unpublish` · `draft` · `preview-devices` — phone and desktop · `email-template` · `push-composer` — phone with a bell
- **System:** `sync` — two-way arrows in a circle (Sage sync) · `import` · `export` · `integration` — plug · `webhook` · `api-key` · `staff` · `roles-permissions` · `tax` · `shipping-zones` · `payment-providers` · `audit-log` · `duplicate` · `archive` · `columns` · `bulk-edit` · `keyboard` · `device-mobile` · `device-tablet` · `device-desktop`

**Totals:** 151 UI icons (+16 filled variants), 55 category icons, 15 feature icons, 68 admin icons. About 305 in all.

---

## 7. Illustrations

### 7.1 System and empty states (240×240 SVG, plus `-dark` versions)
The concepts are starting points; improve on them. Each needs one clear focal object and must read at 160px. Group elements that will move in their own group with `id="anim-<name>"` (for example `anim-confetti`, `anim-bell`). Put the main objects in `id="main"` and the background shape in `id="bg"`.

| File | Moment | Concept |
|---|---|---|
| `empty-bag` | Bag is empty | Open shopping bag with nothing inside but one paper clip |
| `empty-wishlist` | Nothing saved | Blank heart-shaped sticky note |
| `empty-search` | No results | Magnifier over a blank page, eraser crumbs nearby |
| `empty-orders` | No orders yet | Flat, unfolded box waiting to be assembled |
| `empty-notifications` | All caught up | Quiet bell resting on a notepad |
| `empty-school-lists` | No saved lists | Clipboard with an empty checklist and a pencil |
| `offline` | No connection | Paper plane nose-down on a desk |
| `error-generic` | Something went wrong | Pencil with a snapped tip |
| `not-found` | 404 | Notebook with a page torn out |
| `payment-failed` | Payment didn't go through | Card with a small crossed mark. Don't rely on red vs pink alone to signal the error |
| `order-success` | Order placed (hero moment, animated) | Taped parcel with stationery confetti (§8) bursting out |
| `out-of-stock` | Sold out | Shelf with one empty slot between products |
| `delivery-unavailable` | Address outside delivery area | Route line ending at the edge of a map |
| `maintenance` | Down for maintenance | Pencil in a sharpener, shavings curling out |
| `sign-in` | Welcome back | Desk flat-lay with an open notebook |
| `account-created` | Welcome | Name-label sticker being placed on a notebook |
| `review-thanks` | Review submitted | Star-shaped sticky note on a page |
| `back-in-stock-subscribed` | We'll tell you when it's back | Box with a small bell tied on like a gift tag |
| `permission-notifications` | Shown before the system prompt | Bell beside a stack of sticky notes |
| `permission-location` | Shown before the system prompt | Small map with the store and a pin |
| `permission-camera` | Scan your school list | Phone frame over a printed checklist |
| `admin-sign-in` | Staff login | Organised shelves of boxes, with labels drawn as lines (no text) |

### 7.2 Onboarding (app: 4 slides plus 1 optional)
Each slide fills the top ~60% of the screen. As the user swipes, layers move at different speeds (parallax) and key objects animate in.
- **Artboard:** 1200×1200, transparent background. Keep the composition inside the central 1000×1000; only `bg` may bleed past it.
- **Layer groups** (all present, in this order): `bg` (soft brand shape), `layer-back`, `layer-mid`, `layer-front`, `accents`. An object that animates on its own gets a group `anim-<name>` inside its layer.
- **The slides must read as one sequence:** same light direction, scale, palette and level of detail. An object can carry across slides (for example, the same bag in slides 2 and 4).

| File | Message (live text, never in the image) | Concept |
|---|---|---|
| `onboarding-01-welcome` | Everything for school, office and creativity | A neat flat-lay of stationery around an open centre where the logo mark animates in |
| `onboarding-02-school-lists` | Your whole school list in one tap | Clipboard checklist whose ticked items fly into an open bag |
| `onboarding-03-live-specials` | Live stock, real specials | Sale tag mid-flip, a sticky note with a star, and a small live pulse on a product box |
| `onboarding-04-delivery` | Delivered, picked up, or collected | Parcel on a dotted route linking a house, a locker and the store front |
| `onboarding-05-business` (optional) | Order for your office, on account | Tidy desk with stacked supply boxes and an invoice |

---

## 8. Decorative brand elements (`brand/decor/`)
- **Washi tape:** 3 strips (straight, angled, torn ends). Flat fills only.
- **Sticky notes:** square and rectangle. Draw the curled corner as a shape, with no shadow filter.
- **Clips:** paper clip and binder clip, at decoration scale.
- **Torn paper edge:** tileable horizontal divider, in top and bottom versions.
- **Marker doodles** (single strokes in drawing order, to emphasise words in headlines and promos): `doodle-underline-1`, `-2`, `-3` · `doodle-circle-1`, `-2` · `doodle-arrow-straight` · `doodle-arrow-curved` · `doodle-arrow-loop` · `doodle-star` · `doodle-asterisk` · `doodle-squiggle` · `doodle-tick` · `doodle-highlight-swipe`
- **Patterns** (seamless tiles): `pattern-ruled` (exercise-book lines with a pink margin line) · `pattern-grid` · `pattern-dot-grid` · `pattern-doodles` (scattered stationery doodles, low contrast)
- **Stationery confetti** (12 small shapes for celebrations): mini pencil, paper clip, star, circle, square, squiggle, eraser, push pin, set square, heart, sticky note, crayon
- **Motion bases:**
  - `loader-arrows` (the main loader): the logo's two arrows as separate groups (`anim-arrow-top`, `anim-arrow-bottom`) around a shared centre, so they can chase each other in a circle. Trace them faithfully from the master SVG.
  - `refresh-arrows`: the same two arrows, set up for pull-to-refresh. They wind up as the user pulls and spin on release.
  - `success-arrows`: the arrows close the circle and turn into a check mark, for order success.
  - `loader-pencil` (secondary, playful): a pencil drawing a looping line, as one path drawn in order.

---

## 9. Platform assets (`brand/platform/`)

The app icon, splash, notification icon, favicons and map pins use the symbol-only mark (§2.2) once the client approves it. Until then, mock them up with the proposed mark.

| Asset | Files and sizes | Rules |
|---|---|---|
| **App icon (iOS)** | `app-icon/ios/`: 1024×1024 PNG (sRGB, no transparency, square; iOS rounds the corners). Layered SVG source with a background plus up to 4 foreground layers. Light, dark and tinted variants. | No text unless the logo itself is a wordmark. Must read at 40px. |
| **App icon (Android adaptive)** | `app-icon/android/`: `foreground.png` (1024×1024, transparent, mark inside the central safe circle of about 61% of the width, ~626px). `background.png` (1024×1024, or a solid hex). `monochrome.png` (1024×1024 single-colour silhouette for themed icons). | Test inside circle, squircle and rounded-square masks. |
| **Splash** | `splash/splash-mark.png` (1024×1024, transparent, mark inside the central ⅔ circle) and `splash-mark-dark.png`. Background colours from §2. | Android 12+ crops the mark to a circle. Check it. |
| **Android notification icon** | `notification/notification-icon.png`: 96×96, pure white on transparent | Simple silhouette. No colour, no gradients, no fine detail. |
| **Favicons** | `favicon/`: `favicon.svg` (may switch colours for dark mode), `favicon.ico` (16/32/48), `apple-touch-icon.png` (180×180, no transparency), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (content in the central 80%) | Crisp at 16px. |
| **Admin favicon** | `favicon/admin-favicon.svg` and `.ico` | Visibly different from the store's (for example, inverted colours) so staff can tell the tabs apart. |
| **Social share** | `og/og-default.png` (1200×630). Layout frames `og-product-frame.svg`, `og-category-frame.svg` and `og-special-frame.svg`, with empty zones for the product image and text (code renders those). | No text in the frames. Keep key content clear of the outer 60px. |
| **Google Play listing** | `store/play-icon-512.png` (512×512), `store/play-feature-graphic.png` (1024×500) | Brand and illustration, no text. |
| **Email** | `email/logo@2x.png` (400 wide), `email/header-order-confirmed@2x.png` (1200 wide), and six 96×96 PNG icons: package, truck, check, store, return, support | PNG only: email clients don't render SVG reliably. |
| **Map pins** | `map-pins/`: `pin-store`, `pin-pickup`, `pin-locker`, `pin-selected` as SVG, plus PNG @1x/@2x/@3x at a 40×48 base | Record the anchor point (the tip) in the manifest. |
| **Placeholders** | `placeholders/`: `product-placeholder.svg` (1:1, quiet brand pattern and mark), `avatar-placeholder.svg`, `image-error.svg` | Must look intentional next to real product photos. |

App Store screenshots and promo banners come later, once the screens exist.

---

## 10. Manifest and previews

**`brand/manifest.json`** lists every asset with these fields:
- `name`
- `group`: ui, spot, admin, illustration, decor or platform
- `files`: the path for each variant (outline, filled, dark, each PNG size)
- `label`: a plain-English name used for screen-reader labels, e.g. "Add to bag"
- `keywords`: for searching in the admin's icon picker
- `status`: `draft` or `approved`
- `notes`, including the anchor point for map pins

**`brand/preview/`** holds contact-sheet PNGs for each group:
- every icon at 16, 20, 24 and 32px, on paper and on ink backgrounds, with filled variants beside their outlines
- illustrations on light and on dark

This is how we review, so keep the sheets tidy and label each asset with its filename.

---

## 11. QA checklist (run it before every hand-back)
- [ ] Squint test: side by side, the icons have the same visual weight and optical size.
- [ ] UI icons are legible at 16px, spot icons at 40px, illustrations at 160px.
- [ ] Crisp at 1x: main horizontals and verticals sit on the pixel grid.
- [ ] Filled variants match their outline silhouettes exactly.
- [ ] §4 colour rules hold: no stray hex values in UI or admin icons, and exactly two colours in spot icons.
- [ ] Nothing from §4's not-allowed list, and every file is under its size target.
- [ ] Paths are in natural drawing order.
- [ ] Checked on light and dark. Error and warning visuals don't rely on red vs pink alone.
- [ ] Every file is in the manifest, the names match exactly, and all are kebab-case.
- [ ] Nothing resembles a third-party logo, a branded product, or an existing icon library.

---

## 12. Production batches (after a direction is approved)
1. **Core UI** (§6.1–6.4), plus the app icon, splash and favicons. Screens can't be built without these.
2. **Delivery, status and account** (§6.5–6.7), plus the system illustrations (§7.1) and onboarding (§7.2).
3. **Category and feature spot icons** (§6.8–6.9), after we confirm the category list.
4. **Admin icons** (§6.10).
5. **Decor, motion bases, OG frames, store, email, map pins and placeholders** (§8 and the rest of §9).

Stop and report after each batch.

---

## 13. Out of scope (never make these)
- **Third-party logos or marks:** payment providers (PayFast, Yoco, Payflex, Visa, Mastercard), couriers, WhatsApp and social networks, Sage, school crests. We use official brand kits for these.
- **Changes to the Alert Stationers logo:** no redraws, no recolours outside §2, no effects, no stretching or rearranging. The exceptions are faithful traces of the arrows for the §8 motion bases, and the symbol-only and flat (no drop shadow) versions described in §2.2. You may *propose* those in Phase 1; they're used only after the client approves them.
- **Product photography and final marketing banners.** The client makes those in the CMS.
- **Any text inside artwork.**
