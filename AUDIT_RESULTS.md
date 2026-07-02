# Audit results — 2026-07-02

Produced by `SPECS/AUDIT.md` (source + live preview at desktop 1280×800 and mobile 375×812). SEO section scored with `/seo-check`, buy flow with `/conversion-review`.

---

## P0

### [P0] All 5 kits are unpurchasable — every kit checkoutUrl is "#"
- **Where:** `products.json:759, 770, 781, 793, 806` (`checkoutUrl: "#"` on every kit)
- **Problem:** Every kit page/overlay renders disabled "Coming Soon / Unavailable" buttons; JSON-LD advertises the kits as `PreOrder`. 100% of kit revenue is blocked. Two kits (the Serum banks) have finished cover art + full descriptions and look launch-ready, yet can't be bought.
- **Fix:** Create the Payhip products and paste the real checkout URLs into `products.json`. **Requires owner action** — the repo can't invent Payhip links. Interim mitigation (done, see below): the dead-end buttons now route to the newsletter for a "get notified" path.
- **Effort:** S (paste URLs once they exist)

## P1

### [P1] JSON-LD references an Organization node that doesn't exist anywhere
- **Where:** `lib/jsonld.ts:7` (`ORG_ID = "https://prodessential.com/#org"`), referenced by `byArtist`/`brand`/`seller` on every beat and kit page
- **Problem:** Every product's structured data points at `#org`, but no page ever defines an `Organization` node with that `@id`. Validators resolve the references to nothing — weakens rich-result eligibility for all 41 product pages.
- **Fix:** Emit an `Organization` node (name, url, logo, sameAs socials) in each product `@graph` / kit JSON-LD, plus site-level JSON-LD in `app/layout.tsx`.
- **Effort:** S — **FIXED**

### [P1] 4 beats sell "Exclusive" via the Unlimited Payhip variant in source data
- **Where:** `products.json:144` (eclipse), `:207` (farm), `:248` (solstice), `:269` (mercy)
- **Problem:** The `exclusive` license's `checkoutUrl` is a Payhip URL for the **unlimited** variant (identical variant id) instead of `mailto:` like the other 32 beats. Currently dormant (the UI forces exclusive → contact), but it's wrong data in the single source of truth — any future consumer of `checkoutUrl` would sell sole rights at $250.
- **Fix:** Set the four exclusive `checkoutUrl`s to `mailto:prodessential@gmail.com`.
- **Effort:** S — **FIXED**

### [P1] Kit pages horizontally overflow on mobile (related-kits grid)
- **Where:** `style.css:3005–3009` (`.product-related-grid`, `--kits` modifier)
- **Problem:** At 375px the 2-column related-kits grid computes columns of 287px + 269px inside a 327px container (long nowrap kit titles set the column min-content). Content spills 200+px past the right edge and gets clipped.
- **Fix:** `repeat(2, minmax(0, 1fr))` (and `minmax(0,1fr)` on the base grid) so columns can shrink below content min-width; titles already ellipsize.
- **Effort:** S — **FIXED**

### [P1] Cover/OG images up to 2.6 MB; site OG image is a 545 KB PNG
- **Where:** `public/images/`: vertigo-serum2-bank.png (2,628 KB), cashed-out.png (800 KB), sub-zero-serum-bank.png (579 KB), cashed-out-multikit.png (545 KB — also the site-wide OG image in `app/layout.tsx:25`), searching.jpg (399 KB), break_the_bank.jpg (352 KB)
- **Problem:** Kit covers render at ≤88px in lists and ~400px on detail pages; multi-megabyte PNGs are pure waste. The home page pulls the two Serum-bank PNGs (~3.2 MB) on first load. OG scrapers time out or skip heavy images.
- **Fix:** Re-encode the photographic PNG covers as quality JPEGs sized ~800px, update `imgFile` in `products.json`; recompress the two heavy JPEGs.
- **Effort:** M — **FIXED** (2.6 MB → ~90 KB, 800 KB → ~70 KB, etc.)

### [P1] Meta description claims "Instant download" on kits that can't be bought
- **Where:** `lib/keywords.ts:146–149` (`kitDescription`)
- **Problem:** Appends "Instant download for $X." to every kit — including the "Multi Kit Coming Soon..." kit and all currently-unpurchasable kits. Misleading SERP copy; clashes with the JSON-LD `PreOrder` availability.
- **Fix:** When `kit.checkoutUrl === '#'`, say "Coming soon for $X." instead.
- **Effort:** S — **FIXED**

### [P1] License tier buttons hide their prices (weak anchoring)
- **Where:** `components/BeatPurchase.tsx:104–115` (tier picker)
- **Problem:** The five tier buttons show only names ("Basic", "Premium"…). A buyer must click each tier to discover its price; the price ladder ($25→$250) that anchors the mid tiers is invisible. /conversion-review rubric #3.
- **Fix:** Render each tier's price on its button (e.g. "Premium · $40", exclusive "Contact").
- **Effort:** S — **FIXED**

### [P1] No trust signals near the buy CTA
- **Where:** `components/BeatPurchase.tsx` buy row / `components/KitDetail.tsx` buy row
- **Problem:** Nothing near the CTA reduces perceived risk — no "instant delivery", "secure checkout", or "licensed for release" reassurance. /conversion-review rubric #4; was already a ROADMAP item.
- **Fix:** One-line trust strip under the buy row: instant delivery · secure Payhip checkout · license included. (All true: Payhip delivers instantly over HTTPS, every tier has a written license.)
- **Effort:** S — **FIXED**

### [P1] Sort dropdown is unusable from the keyboard
- **Where:** `components/BeatStore.tsx:170–174`, `components/KitStore.tsx:75–79` (`<li onClick>` options)
- **Problem:** The custom sort options are plain `<li>` elements — not focusable, not activatable by keyboard, no Escape to close. Keyboard/AT users can open the dropdown (it's a `<button>`) but can't pick anything.
- **Fix:** Make options focusable buttons with Enter/Escape handling (listbox semantics).
- **Effort:** S — **FIXED**

## P2 (left open — not fixed in this pass)

### [P2] Kit dead-ends: no purchase path *and* no capture (partially mitigated)
- **Where:** `components/KitDetail.tsx:128–133`
- **Problem:** Disabled "Coming Soon"/"Unavailable" buttons are a dead end.
- **Note:** Mitigated in this pass — the disabled secondary button was replaced with a "Get notified →" link to the newsletter. Full fix is the P0 (real checkout URLs).

### [P2] Overlays don't trap focus
- **Where:** `components/GlassModal.tsx`, `components/KitModal.tsx`, `components/LicenseModal.tsx`, `components/CartDrawer.tsx`
- **Problem:** Esc-to-close works everywhere, but Tab can walk out of an open dialog into the page behind it, and focus isn't restored on close.
- **Fix:** Small shared focus-trap hook (`inert` on the background, or first/last sentinel elements).
- **Effort:** M

### [P2] ~4.2 MB of unreferenced images in `public/`
- **Where:** `public/images/`: serum2bank_vol1.png (2,150 KB), c0bc58bd… (436 KB), ad2a4466… (288 KB), unused*.jpg, 8 more hash-named JPGs
- **Problem:** 15 files referenced by nothing in `products.json` or code. Never loaded by pages, but shipped in every deploy.
- **Fix:** Confirm they're not queued for future beats, then delete (they stay recoverable in git history).
- **Effort:** S

### [P2] Two kits have no cover art → no og:image on their pages
- **Where:** `products.json:758, 780` (`imgFile: null` on complete-kit-vol-1, essential-one-shots-vol-1)
- **Problem:** Their pages fall back to a gradient (fine) but emit no `og:image`, so shares render bare.
- **Fix:** Add cover art (owner asset) or fall back to a branded default image in `app/kits/[id]/page.tsx`.
- **Effort:** S (needs art)

### [P2] Free-beat meta descriptions exceed 160 chars
- **Where:** `lib/keywords.ts:105–110` (`beatDescription` + free-download sentence ≈ 185–200 chars)
- **Problem:** Google truncates; the free-download hook (a strong click driver) is what gets cut.
- **Fix:** Tighten the base sentence or lead with the free hook for free beats.
- **Effort:** S

### [P2] Product H1s carry no search phrasing
- **Where:** `components/BeatDetail.tsx:97` (H1 = beat name only)
- **Problem:** `<title>` has "type beat" long-tails but the H1 is just "Bottles". Keeping the clean design is a fair call; a compromise is including the kicker text in the H1 with visually-hidden styling.
- **Effort:** S (design decision)

### [P2] Small tap targets on mobile
- **Where:** player bar buttons 21–26px, `cart-close` 22px, breadcrumb links (`style.css` player/cart sections)
- **Problem:** Under the 44px recommendation; fiddly on phones.
- **Fix:** Padding/hit-area bump (visual size can stay).
- **Effort:** S

### [P2] Long product titles overflow the breadcrumb at 375px
- **Where:** `style.css:2978` (`.product-breadcrumb`)
- **Problem:** The trailing `<span>` (product name) extends ~44px past the viewport on long titles; purely visual (no scroll).
- **Fix:** `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` on the breadcrumb.
- **Effort:** S

### [P2] NEW badge can mismatch between build and view time
- **Where:** `components/BeatCard.tsx:12–14`, `components/KitCard.tsx:8–10` (`isNewBeat` uses `Date.now()` in render)
- **Problem:** Static export bakes the badge at build time; if a deploy sits >30 days, hydration recomputes and mismatches (React warning + badge flicker) for boundary beats.
- **Fix:** Compute from a build-time constant, or suppress with `suppressHydrationWarning`; in practice frequent deploys mask it.
- **Effort:** S

### [P2] No social proof anywhere
- **Where:** site-wide
- **Problem:** No play counts, placements, or testimonials. Can't invent them — collect real ones (IG/YouTube embeds, "as heard in" once placements exist).
- **Effort:** L (content, not code)

### [P2] Dead CSS from the retired center modal
- **Where:** `style.css` (`.modal-play-btn`, `.modal-bpm-key`, `.modal-tags`, `.modal-free-tag-row`, `.modal-info`…)
- **Problem:** Orphaned selectors from the old modal inflate the single global stylesheet.
- **Note:** Partially pruned in the Phase-5 pass (verified-dead selectors only); a deeper sweep stays on the ROADMAP.

---

## Summary

**Counts: 1 × P0 · 8 × P1 · 11 × P2.** The one P0 — every kit lacking a real checkout URL — blocks all kit revenue and only the owner can mint the Payhip links; everything else in P0/P1 was fixable in-repo and **has been fixed** (dangling JSON-LD org node, wrong exclusive-tier checkout data, mobile kit-grid overflow, multi-megabyte covers, misleading kit meta copy, hidden tier prices, missing trust strip, keyboard-dead sort control). The beat-side funnel is fundamentally healthy: unique titles/descriptions, per-product JSON-LD with offers, full sitemap coverage, email-gated free downloads, related-product cross-sell, and GA4 funnel events are all in place. P2s are polish (focus traps, tap targets, OG art for coverless kits, social proof) and are listed above for triage.
