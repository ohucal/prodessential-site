# prod.essential — roadmap / backlog

Prioritized, self-serve backlog. Any session can pull the top unblocked item without re-briefing. Keep items concrete and checkable. Move done items to the bottom.

Priority: **P0** blocks sales/broken · **P1** clear value · **P2** nice-to-have.
Effort: S (<30m) · M (~1–2h) · L (half day+).

## Inbox (unsorted — capture now, triage later)
Raw dump zone. Drop anything here the moment you notice it — a bug, a half-formed idea, "the X looks off" — without stopping to prioritize. Later (or when asked), items get rewritten as concrete tasks and moved into the prioritized sections below, or deleted if they turn out not to matter. No format rules; a one-liner is fine.

- _(empty — add items as you find them)_

## Now (audit + fix window)
- [ ] **P0 · S** Run `SPECS/AUDIT.md` → `AUDIT_RESULTS.md`. Fix all P0/P1 findings.
- [ ] **P1 · M** `/seo-check` full pass; fix duplicate/thin titles & descriptions; verify JSON-LD earns rich results.
- [ ] **P1 · M** `/conversion-review`; implement the top-3 recommended changes.
- [ ] **P1 · S** Image weight pass: compress covers/OG > ~300KB; correct dimensions to kill CLS.

## Conversion / sales
- [ ] **P1 · M** License **comparison table** on product pages (rows = rights/formats, cols = tiers) with a "most popular" highlight. Replaces/augments the dropdown.
- [ ] **P1 · M** Plain-English "what you can do with this license" line per tier from `lib/licenses.ts`.
- [ ] **P1 · L** **Email capture on free-beat download** → list for remarketing (single biggest funnel lever). Pick a tool (see below).
- [ ] **P2 · S** Trust strip near CTA: instant delivery · secure checkout · licensing guarantee.
- [ ] **P2 · M** "You might also like" related-beats strip on product pages (also helps SEO internal linking).
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
- [ ] **P1 · S** Confirm off-screen audio uses `preload="none"`; lazy-load below-fold covers.
- [ ] **P2 · S** Add a pre-push check: `npx tsc --noEmit` (and optionally a prod build in CI, never locally beside dev).
- [ ] **P2 · M** Netlify Lighthouse/CI budget to catch perf/SEO regressions on deploy.

## Workflow / AI (see CLAUDE.md "Model routing")
- [ ] **P2 · S** Add a `/release` or deploy-check spec if the deploy flow gets repetitive.
- [ ] **P2 · S** Keep `PROMPTS.md` updated with prompts that worked well.

## Done
- (move completed items here with date)
