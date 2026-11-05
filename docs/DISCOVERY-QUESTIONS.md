# Alert Stationers: Open Questions Before Any Code

Each question is tagged:
- **[Blocker]**: changes the architecture or data model. We need the answer before designing the database.
- **[Design]**: needed before design and asset production.
- **[Launch]**: needed before go-live. Can come later.

Part A is for us. Part B is for Alert Stationers.

---

## Part A: Team decisions

| # | Tag | Question | Why it matters / recommendation |
|---|---|---|---|
| A1 | Blocker | **When do we launch, relative to the back-to-school rush?** | School-list buying in SA peaks from December to January. Switching website, payments and stock systems in the busiest weeks of the year is the riskiest timing possible. **Recommendation:** no cutover between 1 Dec and mid-Feb. Let the old site carry the 2027 rush, launch after it, and be fully proven well before the next one. |
| A2 | Blocker | Backend: Supabase (Postgres, Realtime, Auth, Storage) as proposed? | Still the best fit with Next.js on Vercel. It gives real transactions for stock and live updates for the admin and app. |
| A3 | Blocker | Admin: a separate Next.js app on its own subdomain, or an `/admin` section inside the store? | **Recommendation: separate app.** It deploys independently, can have stricter sign-in, and admin code never ships to shoppers. |
| A4 | Blocker | Who owns the accounts? | **Recommendation:** every account in the client's name, with us invited as members: domain, Vercel, Supabase, Apple, Google Play, Expo/EAS, payment merchants, couriers, email sending. Also: who pays the monthly service costs? |
| A5 | Blocker | Sign-in methods: email + password, email one-time code, Google, Apple? Guest checkout? | If the iOS app offers Google sign-in, Apple requires an equivalent privacy-focused option, which in practice means Sign in with Apple. **Recommendation:** allow guest checkout. |
| A6 | Design | **Who designs the screens?** Do we work in Figma first, or design directly in code? Is Astra on assets only, or screens too? | The asset brief covers icons, illustrations and platform assets, not page layouts. A top-tier UI needs a screen-design step that someone owns. |
| A7 | Design | Who signs off on design: you, the client, or both? Is there one named approver on their side? | Design by committee, with slow sign-offs, is the most common cause of a slipping timeline. |
| A8 | Design | Phone only, or tablets (iPad / Android tablets) too? | Changes layouts, store screenshots and testing. |
| A9 | Launch | English only at launch? Any chance of Afrikaans or isiZulu later? | Setting up for translation from day one is cheap. Retrofitting it is not. |
| A10 | Launch | Analytics and ad pixels (GA4, Meta, Google Ads)? | If yes, we need a POPIA-compliant consent banner and must set it up properly. |
| A11 | Launch | Team and roles: who builds what (web, app, admin), who handles client comms, who supports it after launch? | Decides how we split the monorepo work and set up monitoring and alerts. |
| A12 | Blocker | **Proof of concept:** what must it demo, by when, and to whom? Web and app, or web first? | Proposed demo script and seed catalogue: `docs/POC-SEED-DATA.md`. Showing the app on real iPhones needs an internal build, which needs an Apple Developer account (ours for the POC, or theirs if it's ready). |

---

## Part B: For Alert Stationers

### Stores and stock
| # | Tag | Question | Why it matters |
|---|---|---|---|
| B1 | Blocker | How many physical stores, and where? Is stock held per store, in a central warehouse, or both? | Stock held in several places changes the database design fundamentally. |
| B2 | Blocker | What do their tills (POS) run on? Must in-store sales reduce online stock in real time? | If yes, in-store sales have to feed our stock records live, or we'll oversell. |
| B3 | Blocker | Click and collect: from which stores? Same day? | Affects checkout, stock reservation and staff notifications. |
| B4 | Design | Customer mix: parents and students vs businesses vs schools? Roughly what share of revenue comes from each? | Decides what the home screen and the app put first. |

### Sage and product data
| # | Tag | Question | Why it matters |
|---|---|---|---|
| B5 | Blocker | Exactly which Sage product and version? Cloud, or installed on a PC/server? Is Sage used for POS, accounting, or both? | Cloud has an API. Desktop needs a sync program on their machine. This decides the whole integration. |
| B6 | Blocker | Who is their Sage partner or consultant? Can we get a copy or sandbox of their company data? | We need real data to test the import and sync, without touching live books. |
| B7 | Blocker | Are Sage item codes their SKUs? Are barcodes stored in Sage? | These become the keys that tie the two systems together. |
| B8 | Blocker | How many products (SKUs)? How many have variants (colour, size, ruling)? Are some sold both singly and in packs? | Shapes the catalogue model and search. |
| B9 | Design | Product photos: their own, or the suppliers'? Consistent backgrounds? | **Mixed supplier photos are the biggest single threat to a premium look.** We may need a background-removal and consistent-shadow step. |
| B10 | Launch | Who writes product descriptions? Are the current ones good enough for Google? | SEO and content workload. |

### The current website
| # | Tag | Question | Why it matters |
|---|---|---|---|
| B11 | Blocker | What platform and URL is it on, who hosts it, and when does that contract end? | Migration path and timeline. |
| B12 | Launch | How many customer accounts and newsletter subscribers? Which email platform? Should past orders show in the new accounts? | Customer migration and email marketing setup. |
| B13 | Launch | Which pages bring the most Google traffic? | We redirect every old URL so they keep their rankings. |
| B14 | Launch | Who controls the domain and DNS? Where is their company email hosted? | **The cutover must not break their email.** |

### What they sell and how
| # | Tag | Question | Why it matters |
|---|---|---|---|
| B15 | Blocker | Business customers: do they sell on account (e.g. 30-day terms)? Customer-specific prices or quotes? How many such customers? | Business accounts are a whole subsystem: credit limits, price lists, quotes, invoices. |
| B16 | Blocker | Schools: do schools send them their lists? How many schools and grades? Do they pre-pack school packs? Should parents be able to scan or upload a printed list? | School lists could be the signature feature of the platform. We need to know how lists reach them today. |
| B17 | Blocker | What promotions do they run: % off, buy-X-get-Y, bundle prices, vouchers, a free-delivery threshold? Do they have a loyalty programme or gift cards? | The pricing engine has to support these from the start. |
| B18 | Blocker | Services: printing, photocopying, laminating, binding, engraving, gift wrapping. Should any be sold online, with file uploads? | Needs file handling and a different kind of order line. |
| B19 | Launch | Do they want product reviews? Who moderates them? | Moderation workflow in the admin. |
| B20 | Launch | What is the returns policy and process today? | Returns flow, refunds, and putting returned items back into stock. |

### Payments and delivery
| # | Tag | Question | Why it matters |
|---|---|---|---|
| B21 | Blocker | Do they already have PayFast or Yoco merchant accounts? Have they applied for Payflex? Do they accept manual EFT (common for businesses) or cash on collection? | Merchant approval takes time, and each method needs its own flow. |
| B22 | Blocker | Delivery: nationwide? Own drivers locally? Any current courier contracts? Free-delivery threshold? How should fees work (flat, by weight, by zone)? | Shipping rules and the courier integration. |
| B23 | Launch | Current online orders per month, and the busiest day in January? | Load testing targets, and how hard the stock engine gets pushed. |

### Brand and the app
| # | Tag | Question | Why it matters |
|---|---|---|---|
| B24 | Design | Logo source files (SVG, AI, EPS or PDF)? Exact brand colours (hex or Pantone)? Brand fonts and licences? Any brand guidelines? | Final asset production waits for the master files. |
| B24a | Design | **The digital logo uses bright magenta and the store sign uses dark raspberry. Which colour is official?** Are they happy for the website and app to use a dark pink between the two for buttons and links? | Two different pinks across the shop and the screen weaken the brand. Bright magenta is also too low-contrast to use for text. |
| B24b | Design | Do they approve a **symbol-only mark** (the two arrows in the ring, no wordmark) and a **flat version without the drop shadow** for the app icon, favicon and other small sizes? | The full badge doesn't read below about 64px. Astra will propose versions for them to approve. |
| B25 | Design | Tone: more playful or more professional? Any brands they admire or dislike? | Steers the three style directions. |
| B26 | Design | Any mascot or recurring brand elements in their print or store signage? | Keeps the fingerprint consistent between the shop and online. |
| B27 | Design | What should the app do that the website doesn't? | Ideas: push alerts for specials and back-in-stock, school-list scanning, one-tap reorder, in-store barcode scanning for price and stock. |

### Legal and accounts
| # | Tag | Question | Why it matters |
|---|---|---|---|
| B28 | Launch | Registered company name, registration number, VAT number, physical address, and their current T&Cs, privacy and returns policies? | ECTA section 43 requires these on the site. |
| B29 | Launch | Have they registered an Information Officer under POPIA? | Legal requirement, and named in the privacy policy. |
| B30 | Blocker | **Apple Developer and Google Play accounts in the company's name.** | Apple needs a D-U-N-S number, which can take weeks. **Start now.** |
| B31 | Design | May we use the product photos and descriptions from their current website, or their suppliers' image packs, for the POC and the launch? | Real products make the demo far more convincing than generated ones, and they presumably already have the rights to those images. We'd never take them without permission. |
