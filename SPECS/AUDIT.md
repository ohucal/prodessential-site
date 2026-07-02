# SPEC: Full site audit

**Purpose:** A deterministic, repeatable audit of prod.essential. Any model (Fable, Opus, Sonnet) should be able to run this and produce the same structured report. Run the report pass FIRST, fix in a second pass.

## How to run
1. Read `CLAUDE.md` for architecture and constraints.
2. Start the dev server via the preview tools (`dev` config). Never run `next build` while it runs.
3. Walk every check below against **source** and the **live preview** (home `/`, a beat page `/beats/<id>/`, a kit page `/kits/<id>/`, `/confirmed/`).
4. Produce `AUDIT_RESULTS.md` (see output format). **Do not fix anything in the report pass.**

## Output format (`AUDIT_RESULTS.md`)
Group findings by priority. Each finding:
```
### [P0|P1|P2] <one-line title>
- **Where:** file:line (or URL + element)
- **Problem:** what's wrong and why it matters
- **Fix:** concrete proposed change
- **Effort:** S/M/L
```
Priority key: **P0** = broken/incorrect/security/data-loss or blocks a sale. **P1** = real UX/SEO/perf degradation. **P2** = polish/nice-to-have. End the file with a one-paragraph summary and counts per priority.

## Checks

### A. Correctness & data integrity
- [ ] `products.json` is valid; every beat/kit has required fields (id, title, licenses, imgFile, audioFile/files, dateAdded).
- [ ] Every `checkoutUrl` is well-formed (Payhip or mailto). Flag any placeholder/duplicate variant IDs across products.
- [ ] Referenced assets exist under `public/` (audio, images, favicons, OG images). Flag missing files (they'd fall back to gradient / broken OG).
- [ ] License copy on-site matches PDFs / `lib/licenses.ts`. No contradictions between tiers (price, format, rights).
- [ ] `generateStaticParams` covers all beats and kits; no orphan pages, no 404-able internal links.
- [ ] `npx tsc --noEmit` passes clean.

### B. SEO (foundations already exist — audit QUALITY)
- [ ] Every beat/kit page has a **unique** title + meta description (not templated-identical). Check `lib/keywords.ts` output for real products.
- [ ] JSON-LD (`lib/jsonld.ts`) is valid schema.org and includes price + availability + image for each product. Would it earn a rich result?
- [ ] Canonical URLs correct and absolute-resolvable via `metadataBase`.
- [ ] OG/Twitter image resolves for every product (not just the site default).
- [ ] `sitemap.xml` includes every live URL and nothing dead.
- [ ] Long-tail "type beat" keyword coverage in titles/H1s (e.g. `"<mood> type beat 2026"`) — the actual search terms buyers use.
- [ ] Internal linking: related-beats / cross-links present so pages aren't orphaned.
- [ ] Single H1 per page; heading hierarchy sane.

### C. Performance
- [ ] Image weights: flag any cover/OG image > ~300KB or served at wrong dimensions. Recommend format/size.
- [ ] Audio not eagerly loaded for off-screen cards (should be metadata/none until play).
- [ ] Third-party scripts (GA, Payhip) load `afterInteractive`, not blocking.
- [ ] No obvious layout shift (CLS) from images without dimensions or late fonts.
- [ ] Bundle sanity: no accidental heavy import in a shared component.

### D. Accessibility
- [ ] All interactive elements keyboard-reachable; visible focus states.
- [ ] Images have meaningful `alt`; icon-only buttons have `aria-label`.
- [ ] Color contrast passes WCAG AA on text (dark theme — check muted grays on dark bg).
- [ ] Audio player controls are labeled and operable without a mouse.
- [ ] Overlay/modal (beat glass overlay) traps focus and closes on Esc.

### E. Mobile / responsive
- [ ] Test at 375px: no horizontal scroll, tap targets ≥ 44px, license picker usable.
- [ ] Beat card + overlay legible and functional on mobile.
- [ ] Header/nav behaves at small widths.

### F. Design consistency
- [ ] Spacing/typography consistent with the design system in `style.css` (no one-off magic numbers).
- [ ] Hover/active/focus states consistent across cards, buttons, links.
- [ ] Empty/edge states handled (missing image → gradient, no beats in a filter, free vs paid).

### G. Conversion (defer deep pass to /conversion-review; flag blockers here)
- [ ] Buy CTA visible above the fold on product pages.
- [ ] Price + license clearly shown before the click.
- [ ] Broken/confusing checkout flow = P0.

## Notes
- Keep findings specific and file-anchored. "Improve SEO" is not a finding; "beat `<id>` meta description is identical to 3 others, `lib/keywords.ts:NN`" is.
- If a check can't be evaluated (e.g. no analytics access), say so rather than guessing.
