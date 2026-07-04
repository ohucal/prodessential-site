# prod.essential — Audit Notes & Content Drafts
*Session: 2026-07-03. For use as a Claude Code spec / reference doc.*

---

## 0. Context

This session audited the live Next.js site (github.com/ohucal/prodessential-site) directly
against source, cross-checked against the existing `AUDIT_RESULTS.md` (2026-07-02, which
already fixed most bug-level P0/P1/P2 items), then benchmarked against reference beat/kit
stores (relooped.de, eleftheriosaudio.com, exoaudio.com, clarkaudio.com, stickz.co, etc.)
for feature/conversion gaps. This doc is the distilled output: what's confirmed working,
what's still open, and ready-to-use copy drafts.

---

## 1. Confirmed already working (do not re-fix)

- Per-beat static pages at `/beats/<id>/` with keyword-rich titles, meta descriptions,
  `music.song` OG type, breadcrumbs, internal linking, JSON-LD (`lib/jsonld.ts`),
  generated `sitemap.ts` / `robots.ts`. The old "JS-invisible catalog" SEO problem is solved.
- Text search on both beats and kits (`BeatStore.tsx`, `KitStore.tsx`).
- Free download is email-gated to Kit (`KIT_FREE_DOWNLOAD_ENDPOINT`), fires `generate_lead`.
- License modal works — the `#` href is a fallback; `onClick` opens full license text
  (`openLicense`), not broken.
- Tier prices show on license buttons; trust strip exists on the buy row (instant delivery /
  secure Payhip checkout / written license included).
- Free → Premium upsell wired after free download completes.
- All 36 beat checkout URLs are wired correctly (no placeholders remaining).

---

## 2. Open items, ranked

### [P0] Kits are unbuyable — `checkoutUrl: "#"` on all 5 kits
- **Owner action required** — only Owen can create the Payhip products and paste URLs.
- Two kits (Vertigo Serum 2 Bank, Sub-Zero Serum Bank) already have finished cover art +
  full `descriptionHtml` — launch-ready, blocked only on checkout URLs.
- Biggest single lever on this list. Do this first.

### [P1] Hero desc is empty value-prop space — **partially superseded**
- Owner has since edited `components/Hero.tsx` directly (uncommitted as of 2026-07-04) to:
  `"A collection of some of my beats. Free downloads available. Serum banks, drum kits and
  tons of free stuff coming very soon!"` — doesn't match any of the 5 drafted options below.
- §4's draft options are kept as alternate copy to pull from if further iteration is wanted,
  but treat the "Current:" line in §4 as historical (what it was before this edit), not live.
- H1 (`prod. essential`) stays as-is — deliberate prior decision, don't stuff keywords into it.

### [P1] Free-download files may be untagged (verify before anything else)
- `freeFileFor()` = `beat.freeFile || beat.audioFile`. No beat currently sets `freeFile`,
  so free downloads serve the same file as the on-site preview.
- **Action:** listen to a few `public/audio/*.mp3` files. Confirm the producer tag is
  audible throughout (not just once at the start).
- If untagged/under-tagged: bounce properly tagged versions (tag repeating every 10–15s),
  add as new files, set `freeFile` per beat in `products.json`. Field already supports this,
  just unused.
- If already well-tagged: no action needed.

### [P1] Free-beat meta descriptions exceed ~155–160 chars (Google truncation)
- **File:** `lib/keywords.ts`, `beatDescription()` — base sentence + free-download sentence
  appended for free-eligible beats lands ~185–200 chars. The truncated part is the free-download
  hook, i.e. the strongest click driver.
- **Fix (either approach):**
  1. Trim the base sentence so base + free line stays under ~155 chars, OR
  2. Front-load the free hook for free-eligible beats so it survives even if the tail truncates.
- **Example rewrite** (Manifest, free-eligible):
  - Before (too long): `Manifest is a 152 BPM Em underground type beat by prod.essential. Stream the preview and license instantly from $25. Free tagged download available.`
  - After (~130 chars, hook first): `Free tagged download of "Manifest," a 152 BPM Em underground type beat by prod.essential. License untagged from $25, instant delivery.`
- Paid (non-free) beats keep the current template — they don't have the extra sentence
  pushing them over the limit.

### [P1] No FAQ block anywhere on site — **DONE (2026-07-04)**
- Shipped: smooth single-open accordion on the home page below Licensing
  (`components/FAQ.tsx`), copy driven by `lib/faq.ts` (single source of truth), with
  `FAQPage` JSON-LD (`faqJsonLd()` in `lib/jsonld.ts`) injected from `app/page.tsx` for the
  AEO benefit. Draft copy from §3 shipped verbatim. Styling in `style.css` (`.faq*`).

### [P2] No reviews / star ratings
- Payhip has built-in reviews, currently off.
- **Action (owner):** (1) enable reviews in Payhip product settings, (2) seed ethically —
  give free pack / a kit to real early users, ask for honest reviews. Never fabricate
  testimonials or attribute quotes to real named artists not actually worked with.
- **Action (code, once data exists):** surface star rating on beat/kit cards + detail pages.

### [P2] No Meta Pixel installed
- Only GA4 is wired (`lib/analytics.ts`). Meta Pixel reports visitor actions (view, add to
  cart, checkout, purchase) back to Meta so ad campaigns can optimize toward buyers and
  retarget visitors who didn't convert. Required before any paid Meta/IG ad spend — without
  it, ad platform can't learn who converts.
- **Action:** install Pixel snippet, wire existing tracked events (view/add-to-cart/
  purchase/lead) to fire Pixel events alongside current GA4 calls.

### [In progress — owner] Value-stacked bundle
- Owen is completing kit catalog toward a first bundle. Standard pattern from the field:
  itemize each component's individual price → show total → cross it out → single bundle
  price → show % saved (e.g. reference: $141 total value → $79 bundle price).
- Blocked on kits being buyable (P0) and on having enough finished kits to bundle.
- Revisit bundle tier structure once 3+ kits are live.

---

## 3. FAQ block — draft copy

Ready to drop in as a new component/section. Written in brand voice (lowercase, no em
dashes, confident/minimal, no hype). Answers are specific to this catalog's actual terms —
note the kits are royalty-free but beats are NOT (publishing splits + required credit),
so the copy deliberately does not blanket-claim "100% royalty-free" the way most
competitor sites do.

**Two decisions needed before shipping:**
1. Refund line below assumes no-refund (matches Payhip digital-goods norm, matches how
   relooped.de handles it). Can be softened to a guarantee later if desired.
2. Whether to attach a short written "kit royalty-free terms" note so the "royalty-free"
   claim on kits is backed by something explicit.

```markdown
## faq

**will these work in my daw?**
yes, all of it. fl studio, ableton, logic, cubase, bitwig. drums, one-shots and loops
are standard wav. serum banks include the presets plus every sound bounced to wav, so
you can use them even without serum.

**do i need serum to use the serum banks?**
no. every preset is bounced to wav and included as one-shots, so you can drag them
straight into any daw. if you have serum you get the editable presets too. vertigo is
built for serum 2, sub-zero works in serum 1 and 2.

**are the kits royalty-free?**
yes. the drum kits, one-shots, loops and serum banks are royalty-free. use them in
your beats and releases and keep your masters. beats work differently, see below.

**what's the difference between a free beat and a paid license?**
free downloads are tagged and for non-profit and demo use only, so you can test a beat
in a song before you commit. to release, monetize or distribute it you need a paid
license, which removes the tag and gives you the untagged files.

**can i release a song made with one of your beats?**
yes, once you buy a license. each tier sets what you can do with it, streams, sales,
videos, shows. you keep your lyrics and your master. the beat stays licensed, not
owned, unless you buy exclusive. credit "prod. essential" is required on releases.

**what do the license tiers mean?**
basic is a tagged mp3 for demos. premium is untagged wav and mp3. premium + stems adds
the track-outs for full mixing control. unlimited removes the caps. exclusive pulls the
beat off the store and transfers sole rights. full terms are on every beat.

**how do i get my files?**
instantly. checkout runs through payhip and your download is ready right after
payment. a link is also emailed to you so you can grab it again anytime.

**can i redownload if i lose my files?**
yes. use the link in your purchase email to download again whenever you need.

**what payments do you take?**
card and paypal through secure payhip checkout.

**do you offer refunds?**
everything is a digital download, so all sales are final. if something's wrong with
your files, email prodessential@gmail.com and i'll fix it.
```

---

## 4. Hero desc — draft options

*Superseded 2026-07-04: owner already replaced the hero-desc directly in `components/Hero.tsx`
with copy not listed here (see §2). Options below are kept for reference only, in case further
iteration on the line is wanted later.*

No trust stats/claims included per owner request (deferred, not rejected). H1
(`prod. essential`) stays as-is; only the sub-headline (`hero-desc`) was in play.
`components/Hero.tsx` — `<p className="hero-desc">`.

1. **Brand-forward:** `beats, kits and serum banks for the new detroit underground. lease a beat or flip the sounds yourself.`
2. **Sound-forward:** `the detroit sound, ready to use. beats to lease, kits and serum banks to build with.`
3. **Audience-split framing** (sets up future "i'm an artist / i'm a producer" buttons): `for artists: lease beats and grab free tagged downloads. for producers: drum kits, loops and serum banks to build your own.`
4. **SEO-leaning** (most keyword coverage — detroit/underground/drum kits/serum banks are actual search queries): `detroit and underground rap beats, drum kits, one-shots, loops and serum banks. free downloads on select beats.`
5. **Closest to current, with a value angle:** `browse detroit rap beats, drum kits, loops and serum banks. free tagged downloads on select beats.`

**Recommendation:** #4 for SEO leverage now; #3 if/when the artist/producer split ships.

---

## 5. Sequencing

1. Mint Payhip products for the two ready Serum banks (Vertigo, Sub-Zero), paste real
   `checkoutUrl`s. **Owner action, revenue-unlocking.**
2. Verify free-download audio is tagged (§2, P1). Owner listens; code fix only if needed.
3. ~~Add FAQ block~~ — done 2026-07-04 (`components/FAQ.tsx`, `lib/faq.ts`, FAQPage JSON-LD).
4. ~~Rewrite hero desc~~ — done by owner directly (uncommitted, 2026-07-04), see §2/§4.
5. Fix free-beat meta description length (§2, `lib/keywords.ts`).
6. Enable + seed Payhip reviews (owner action) → surface ratings in UI (code, once data exists).
7. Install Meta Pixel, wire to existing tracked events.
8. Ship first value-stacked bundle once kit catalog is ready.

Items 2 (verify), 3, 4, 5 are fully in-repo and unblocked — good candidates for the next
Claude Code session. Item 1, 6 (enable/seed), and 7 (install) need Owen. Item 8 depends on
kit catalog completion.
