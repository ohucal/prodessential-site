# prod.essential — roadmap / backlog

Prioritized, self-serve backlog. Any session can pull the top unblocked item without re-briefing. Keep items concrete and checkable. Move done items to the bottom.

Priority: **P0** blocks sales/broken · **P1** clear value · **P2** nice-to-have.
Effort: S (<30m) · M (~1–2h) · L (half day+).

## Inbox (unsorted — capture now, triage later)
Raw dump zone. Drop anything here the moment you notice it — a bug, a half-formed idea, "the X looks off" — without stopping to prioritize. Later (or when asked), items get rewritten as concrete tasks and moved into the prioritized sections below, or deleted if they turn out not to matter. No format rules; a one-liner is fine.

- **P0 (owner action):** all 5 kits still have `checkoutUrl: "#"` — kit revenue is fully blocked. Create the Payhip products and paste the real checkout URLs into `products.json` (see AUDIT_RESULTS.md P0). Interim: kit pages now link "Get Notified" → newsletter.
- CLAUDE.md and PROMPTS.md reference a `/add-beat` skill, but `.claude/skills/` only has `seo-check` and `conversion-review` — either write the skill (checklist + JSON template) or fix the docs to stop pointing at it.
- Deeper dead-CSS sweep intentionally paused — owner wants further removal only once importance is confirmed per-selector. (282 verified-dead lines were pruned 2026-07-02; the `.modal`/`.modal-overlay` shell itself still shares blocks with live selectors like `.modal-close`/`.modal-nav-btn`, so it needs case-by-case review, not a blind sweep.)
- `public/images/`: the ~4.2 MB of currently-unreferenced files (`serum2bank_vol1.png`, `unused*.jpg`, hash-named JPGs) are **confirmed reserved for future beats — do not delete.**
- GlassModal focus-restore-on-close (beat overlay only — it closes via `history.back()`, unlike the other 3 dialogs which restore correctly): confirmed via logging that the restore call fires and succeeds, but a later reset lands it on `<body>` in repeated dev-server testing. Looks like a Next.js dev-mode quirk around the raw (non-router) `pushState` this overlay uses, not the trap logic — re-verify once deployed to a real static build. See AUDIT_RESULTS.md.
- Kit slugs were renamed 2026-07-02 (`melodic-textures`→`cashed-out-multi-kit-vol-1`, `vintage-keys`→`essential-one-shots-vol-1`, `solar-flare-serum2-bank`→`vertigo-serum2-bank-vol-1`, `essentials-essentials-vol-1`→`complete-kit-vol-1`, `sub-zero-serum-bank`→`sub-zero-serum-bank-vol-1`). If any old `/kits/<id>/` or `?kit=` links were shared externally, add Netlify `_redirects` entries.
- "Essential One Shots Vol. 1" description says "sampled from vintage keyboards" — confirm that matches the actual pack contents (couldn't verify from the repo).
- Two kits (complete-kit-vol-1, essential-one-shots-vol-1) have no cover art — owner adding separately; once ready just set `imgFile` in `products.json`.

## Now (audit + fix window)
- [x] **P0 · S** Run `SPECS/AUDIT.md` → `AUDIT_RESULTS.md`. Fixed all in-repo P0/P1; the one open P0 (kit Payhip URLs) needs owner action — see Inbox. (2026-07-02)
- [x] **P1 · M** `/seo-check` full pass — titles/descriptions already unique; fixed the dangling `#org` JSON-LD reference (Organization node now on every page) and misleading "Instant download" copy on coming-soon kits. (2026-07-02)
- [x] **P1 · M** `/conversion-review` — implemented the top 3: tier prices on license buttons, trust strip under the buy row, coming-soon kits link to "Get Notified" instead of dead-ending. (2026-07-02)
- [x] **P1 · S** Image weight pass: 6 covers compressed 5.3 MB → 0.8 MB (PNGs → 800px JPEG q85, none used transparency); site OG image now 70 KB. Covers are fixed-size divs, so no CLS. (2026-07-02)

## Conversion / sales
- [ ] **P1 · M** License **comparison table** on product pages (rows = rights/formats, cols = tiers) with a "most popular" highlight. Replaces/augments the dropdown.
- [ ] **P1 · M** Plain-English "what you can do with this license" line per tier from `lib/licenses.ts`.
- [ ] **P1 · L** **Email capture on free-beat download** → list for remarketing (single biggest funnel lever). Pick a tool (see below).
- [x] Trust strip near CTA: instant delivery · secure Payhip checkout · written license included (beats: purchasable tiers; kits: when addable). (2026-07-02)
- [x] "You might also like" related strip on product pages — beats had "More of my beats"; kit pages/overlay got "More kits & packs" in the KitDetail revamp. (2026-07-02)
- [ ] **P2 · S** Honest scarcity on exclusives ("sold once").

## SEO / discoverability
- [ ] **P1 · S** Ensure titles use real search phrasing (`"<mood> type beat 2026"`, `"<genre> drum kit"`).
- [ ] **P2 · M** Per-product OG images (auto-compose cover + title) so shared links look pro.
- [ ] **P2 · L** Lightweight content: a `/free-beats` or genre landing page to rank for category terms.
- [ ] **P2 · S** Submit sitemap to Google Search Console; track impressions/queries.

## Analytics (you can't optimize what you don't measure)
- [x] GA4 funnel events are wired: `beat_preview_play`, `view_item`, `select_item`, `add_to_cart`/`remove_from_cart`, `begin_checkout`, `generate_lead`, `sign_up`/`sign_up_confirmed`. (2026-07-01)
- [x] Ecommerce events use GA4 shape (`items` + `value` + `currency`) via `trackEcommerce()` in `lib/analytics.ts`, so monetization/funnel reports populate. (2026-07-01)
- [x] Payhip → Advanced Settings → Google Analytics accepts GA4 `G-` IDs; entered `G-9XBRPVVXPP` (from `lib/analytics.ts`) and saved. Payhip will fire `purchase` with real order value on its own checkout — the deepest revenue signal, which nothing in this codebase can produce since checkout is off-site. (2026-07-02)
- [ ] **P1 · S (user action)** Do a real or test purchase and confirm `purchase` appears in **GA4 → Admin → DebugView** with the expected value.
- [ ] **P2 · S** In GA4, mark `begin_checkout`, `generate_lead`, `sign_up_confirmed`, and `purchase` as **key events/conversions** so they show in conversion reports.
- [ ] **P2 · S** Consider a privacy-light analytics option (Plausible/Umami) for cleaner funnel views if GA4 is noisy.

## Performance / tech health
- [x] Confirmed: the single shared `<audio>` element uses `preload="none"` (`components/AudioEngine.tsx`) — no per-card audio elements exist. Covers are CSS `background-image` (eager but now compressed); switching to lazy `<img>` would be a bigger refactor, not obviously worth it. (2026-07-02)
- [ ] **P2 · S** Add a pre-push check: `npx tsc --noEmit` (and optionally a prod build in CI, never locally beside dev).
- [ ] **P2 · M** Netlify Lighthouse/CI budget to catch perf/SEO regressions on deploy.

## Workflow / AI (see CLAUDE.md "Model routing")
- [ ] **P2 · S** Add a `/release` or deploy-check spec if the deploy flow gets repetitive.
- [ ] **P2 · S** Keep `PROMPTS.md` updated with prompts that worked well.

## Done
- P2 follow-up pass: shared focus-trap hook (`lib/useFocusTrap.ts`) applied to all 4 overlays (glass beat/kit modals, license modal, cart drawer); mobile tap-target hit-area bump on player-bar buttons + cart-close (invisible, no visual change); NEW-badge hydration-mismatch fixed by gating on the existing `mounted` flag; breadcrumb-overflow doc fix (was already shipped, mis-filed as open). Images, kit cover art, H1 copy, and further CSS pruning deliberately left alone per owner instruction. (2026-07-02)
- Full audit ran (AUDIT_RESULTS.md): fixed exclusive-tier checkout data on 4 beats, JSON-LD Organization node, mobile kit-grid + breadcrumb overflow, 5.3 MB → 0.8 MB cover compression, honest coming-soon kit meta copy, tier prices on license buttons, trust strip, kit "Get Notified" path, keyboard-operable sort dropdowns; pruned 282 lines of verified-dead CSS and 3 unused cart-store methods. P2s parked in AUDIT_RESULTS.md. (2026-07-02)
- Tried rounding list-card thumbnails to match the 12px detail-cover radius; reverted per feedback — small list thumbnails (beat cards, featured, kits & packs) stay square. Rounded corners are reserved for the player bar art and the big expanded-view/full-page cover art. (2026-07-02)
- Kit overlay + /kits/[id] pages rebuilt on shared KitDetail, matching the beat surfaces (glass shell, buy row, related grid, client-side browse-all that keeps playback alive). (2026-07-02)
- Kit slugs/types made accurate in products.json; kit cards are now real links (middle-click opens the static page); "Kits & Bundles" anchor corrected to "Kits & Packs". (2026-07-02)
