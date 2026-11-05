# Logo analysis — Phase 0 (provisional)

Studied both supplied PNGs at their native resolution on 5 November 2026. Source files are unchanged. Measurements below refer to the **508 × 475 px digital reference**, origin at its upper-left; screenshot UI badges and the grey shadow are excluded. These are raster estimates, not recovered master geometry. The photograph confirms the construction but is unsuitable for exact geometry or colour because of perspective, backlighting and reflections.

## Geometry: confirmations and corrections to §2.2

- **Badge:** heavy near-black outer ring, magenta inner ring, white field. Apparent centre approximately (249, 236); outer radius about 236 px, ring width roughly 17–20 px. The grey lower-right crescent is an offset shadow, not another brand ring. All circle dimensions need checking against the master: the supplied screenshot is cropped and resampled.
- **Wordmark slant:** approximately **10° forward from vertical**, uncertainty about ±2°. Measurement: the left edge of the ALERT L stem moves from x128 at y160 to x123 at y190; arctan(5/30) = 9.46°. The last T stem similarly moves from x255 at y170 to x250 at y200 (9.46°). Use **10°** for exploration swipes/cut edges, not an assumed 12° and never a shear on UI icons. Heavy, condensed italic sans; mostly flat horizontal cuts and angular corners, not uniformly rounded terminals.
- **Top arrow:** clockwise, thin tail near (120, 134), body rising to approximately (248, 52), head ending near (394, 199). A least-squares circle fitted to outer-body landmarks (122,133), (151,94), (199,61), (248,52), (296,60), (337,81), (360,103) gives an effective radius of **142 px** (centre (251,194)); uncertainty about ±10 px from landmark choice. This is an approximation, not a constant-radius arc. Inner curve is offset and differently curved, so a monoline arc with a triangular tip would miss the silhouette.
- **Lower arrow:** clockwise return on the lower semicircle, with its head at lower left and thin tail near (398, 296). Its outer body bottoms near (246, 401); a least-squares circle fitted to (176,389), (246,401), (316,387), (369,350), (398,300) gives an effective radius of **167 px** (centre (245,236)), uncertainty about ±10 px. The two arrows are **not exact rotated duplicates**; the lower curve is flatter and the heads differ. Re-check their control points in the master before motion production.
- **Taper and heads:** top body grows from approximately 0–3 px at the tail to about 34 px at the top crest and approximately 45–55 px approaching the head; lower body similarly grows from a fine tail to about 35–40 px at its lower crest. Head envelopes are roughly 100–115 px across, with deep inward notches and broad oblique faces. Tips have tiny softened/blunted corners (about 1–3 px at this resolution), not round arrow caps. Small icon proposals simplify the notch and retain a visibly tapered crescent.

## Family resemblance: five working rules

1. Upright, broad, compact UI silhouettes; test 1.75 px and 2 px weights on the 24 px grid. Use mildly softened corners without turning everything into a pill.
2. Returning arrows use closed tapered crescents, a broad head and a deliberate open counter. This is a documented filled-motif exception inside an outline icon, not an expanded ordinary stroke.
3. Use one **10°** accent angle on marker swipes and card cuts; horizontal and vertical UI geometry stays upright.
4. Use the pencil, paper edge and clipboard as functional metaphors; do not put a ring around every UI glyph. Reserve circular framing for C's spot icons and the proposed mark.
5. Increase expression with size: restrained UI, two-colour spots, larger stationery compositions with an open centre. Keep light/dark optical weight comparable.

## Colour and limits

Digital ALERT and the inner ring are vivid magenta, the upper arrow and STATIONERS are near-black, and the lower arrow is muted orchid. Ink carries most wordmark mass; magenta concentrates attention, rather than covering every form. The sign shows raspberry in the ring, ALERT and lower arrow; its pink balance is different from the digital reference. Consequently §2.3's `#E812D9`, `#B85AAE`, `#262626` and `#8E1F45` remain **provisional palette estimates**, not measured official values. Exploration uses the brief's theme palette; exact colour sampling from the photograph would give false precision.

At 16 px omit the wordmark, double fine rings, shadow, sharp tail needles and tiny head notches. Proposed symbol marks retain two arrows and one ring, with explicitly simplified small-size mocks. All are **draft client proposals**, not replacements for the existing logo. No source redraw, recolour or production logo is delivered; final arrow fidelity, colour and production approval remain dependent on the master SVG.
