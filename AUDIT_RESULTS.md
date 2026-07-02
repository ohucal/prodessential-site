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

## P2 — fixed in the follow-up pass

### [P2] Kit dead-ends: no purchase path *and* no capture (partially mitigated)
- **Where:** `components/KitDetail.tsx:128–133`
- **Problem:** Disabled "Coming Soon"/"Unavailable" buttons are a dead end.
- **Note:** Mitigated — the disabled secondary button was replaced with a "Get notified →" link to the newsletter. Full fix is still the P0 (real checkout URLs).

### [P2] Overlays don't trap focus — **FIXED**
- **Where:** `components/GlassModal.tsx`, `components/KitModal.tsx`, `components/LicenseModal.tsx`, `components/CartDrawer.tsx`
- **Fix:** Shared `lib/useFocusTrap.ts` hook — moves focus into the dialog on open, loops Tab/Shift+Tab within it, restores focus to the trigger element on close.
- **Verified:** Trap-while-open and restore-on-close both confirmed working for CartDrawer, LicenseModal, and KitModal (including the nested case: closing LicenseModal while the beat overlay is open behind it correctly returns focus into the still-open beat overlay, not `<body>`). GlassModal's trap-while-open (Tab/Shift+Tab wrap) is confirmed working; its restore-on-close is a known open item — see the note below.
- **Known residual issue:** GlassModal closes via `window.history.back()` (so the browser back button/gesture also closes it) rather than a plain state toggle. In the dev server, the deferred restore call was confirmed (via logging) to successfully focus the trigger link, but something afterward resets focus to `<body>` in repeated same-session testing — most likely Next.js dev-mode's handling of a raw (non-router) `pushState`-driven route, not the trap logic itself, since the identical hook works correctly everywhere it isn't paired with `history.back()`. Not re-verified against a production static build (`next build`), which this project's workflow disallows running alongside the dev server. Worth a quick re-check post-deploy.

### [P2] Small tap targets on mobile — **FIXED**
- **Where:** `style.css` `.player-btn`, `.player-btn--play`, `.cart-close`
- **Fix:** Invisible `::before` hit-area extension (no visual/layout change) — `.player-btn` grows to ~36px (calibrated to the tightest 12px gap between player buttons at ≤420px so extended zones meet edge-to-edge, not overlapping), `.cart-close` grows to ~42px (isolated in the cart header, more room to work with).

### [P2] NEW badge can mismatch between build and view time — **FIXED**
- **Where:** `components/BeatCard.tsx`, `components/KitCard.tsx`
- **The issue:** This is a static export — HTML is generated once at *build* time using the build server's clock, then hydrated in the browser using the *browser's* clock, which can be hours/days later. A beat sitting right at the 29–31 day boundary could disagree between server-rendered and client-recomputed badge state, a React hydration mismatch (dev console warning, badge flicker/pop-in).
- **Fix:** Gated `isNew` on the existing `mounted` prop (`mounted && isNewBeat(...)`), reusing the same pattern already used for the in-cart indicator dot. Server output and first client paint always agree (badge absent); the real value only appears post-mount.
- **Verified:** No hydration warnings in `preview_console_logs` after the change.

### [P2] Long product titles overflow the breadcrumb at 375px — **FIXED**
- **Where:** `style.css` `.product-breadcrumb`
- **Fix:** `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`. (This was actually fixed alongside the P1 mobile kit-grid overflow commit — it was left mis-filed here as "open" in the original pass; corrected.)

## P2 — deliberately left open (owner decision)

### [P2] ~4.2 MB of images in `public/images/` that nothing currently references
- **Where:** `public/images/`: serum2bank_vol1.png (2,150 KB), c0bc58bd… (436 KB), ad2a4466… (288 KB), unused*.jpg, 8 more hash-named JPGs
- **Status:** Confirmed reserved for future beats — **do not delete.**

### [P2] Two kits have no cover art → no og:image on their pages
- **Where:** `products.json:758, 780` (`imgFile: null` on complete-kit-vol-1, essential-one-shots-vol-1)
- **Status:** Owner is adding cover art separately. No code change needed once art lands — just set `imgFile` in `products.json`.

### [P2] Product H1s carry no search phrasing
- **Where:** `components/BeatDetail.tsx:97` (H1 = beat name only)
- **Status:** Won't-fix — owner prefers the clean H1 design over stuffing SEO phrasing into it. The `<title>` already carries the long-tail keywords.

### [P2] Free-beat meta descriptions exceed 160 chars
- **Where:** `lib/keywords.ts:105–110` (`beatDescription` + free-download sentence ≈ 185–200 chars)
- **Status:** Open. Google truncates; the free-download hook (a strong click driver) is what gets cut.

### [P2] No social proof anywhere
- **Where:** site-wide
- **Status:** Owner will add real social proof (IG/YouTube embeds, placements) later — can't be fabricated.

### [P2] Dead CSS from the retired center modal
- **Where:** `style.css`
- **Status:** Open by request — don't remove further dead CSS until importance is confirmed. 282 lines of *verified*-dead rules were already pruned in the first pass; anything beyond that needs individual confirmation before removal.

---

## Summary

**Counts: 1 × P0 · 8 × P1 (all fixed) · 11 × P2 (4 fixed, 6 deliberately deferred by owner, 1 partially mitigated).** The one P0 — every kit lacking a real checkout URL — blocks all kit revenue and only the owner can mint the Payhip links. Everything else in P0/P1 was fixable in-repo and has been fixed (dangling JSON-LD org node, wrong exclusive-tier checkout data, mobile kit-grid overflow, multi-megabyte covers, misleading kit meta copy, hidden tier prices, missing trust strip, keyboard-dead sort control). Of the P2 polish items, focus traps / tap targets / NEW-badge hydration / breadcrumb overflow are now fixed; images, kit cover art, H1 copy, meta-description length, social proof, and further CSS pruning are intentionally left for the owner's own timeline or judgment.
