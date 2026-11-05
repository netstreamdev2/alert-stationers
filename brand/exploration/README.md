# Astra — Phases 0 and 1

Draft review set, 5 November 2026. **Production has not started.** Client direction approval, the master logo SVG and confirmed colours remain outstanding.

- [Logo analysis](00-logo-analysis.md): reference checks, measured 9.46° stem slant (10° working angle), fitted arrow radii, taper and uncertainties.
- [A — Ink & Highlighter](direction-a/preview-sheet.png)
- [B — Paper Cut](direction-b/preview-sheet.png)
- [C — Full Circle](direction-c/preview-sheet.png)

Each direction contains 14 outline UI icons (13 requested plus `bag-pencil`), four filled variants, four two-colour spots, light/dark empty-bag and welcome illustrations, a proposed symbol mark, and a square opaque 1024px app-icon concept. The mark and app icon have real 40px and 16px PNG mocks. Empty states have 480/720px transparent exports; welcome slides have transparent 400/800/1200px exports. Each preview includes every asset on paper and ink, with UI icons at 16/20/24/32px and spot icons at 40/64px. The rounded large app tile is a review simulation of OS rounding; exported app PNGs are square.

Rationales are in each direction's `rationale.md` (four sentences apiece). Review labels are HTML, outside the SVG artwork; no typeface choice is implied. `preview.html` is a local, self-contained, zoomable contact sheet with inline vectors and no remote resources.

## Construction and provisional choices

All vectors were drawn deliberately from simple paths and primitives; no stock icon pack, web image, auto-trace, image-generation model or external service was used. The two-arrow refresh is shared across directions to preserve the logo's signature rather than inventing three competing logos. It uses filled tapered crescents inside the outline family: a deliberate motif exception to the default outline fill. The symbol proposal uses a single ring and two unequal arrows without the wordmark or shadow; its geometry is a simplified exploration, pending a faithful check against the master SVG. A uses digital magenta, B tests a raspberry app field, and C keeps a restrained paper badge.

UI assets inherit `currentColor`. Spot assets have exactly `currentColor` and the `accent` group's fill; B/C previews swap that fill to `#F2559A` on dark, as consuming code would. Illustration dark versions use §2.3's dark tokens. No production loader, official logo, final adaptive platform set or additional inventory is included.

## Verification and reproduction

Run `node brand/exploration/build-explorations.mjs`, then `node brand/exploration/render-explorations.mjs`, then `powershell -NoProfile -ExecutionPolicy Bypass -File brand/exploration/validate-explorations.ps1` from the workspace root. The execution-policy override applies only to that validator process. Rendering uses existing local Chrome through its DevTools protocol, without installing packages; it creates a temporary isolated browser profile and closes its browser afterward. `brand/manifest.json` is the canonical draft index, mirrored at `brand/exploration/manifest.json` for portable review. Rebuilding replaces generated exploration files only; `brand/source/` is never written.

Automated checks cover XML validity, prohibited SVG constructs, viewBoxes, colour contracts, allowed IDs, file-size limits, inventory, manifest coverage, PNG dimensions, transparent illustration/mark corners, and every app-icon pixel's opacity. Visual review covers all three sheets on both themes, 16px UI samples and 16/40px identity mocks. These checks support this exploratory hand-off; master-level geometry, final optical tuning and production approval are intentionally pending.
