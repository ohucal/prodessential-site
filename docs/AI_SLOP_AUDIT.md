# AI-Slop / Vibe-Coded Audit — prod.essential

> **Purpose:** A checklist for Claude Code to audit the prodessential.com site (Next.js static export) for anything that reads as "vibe coded" or "made with AI." The goal is a site that feels personal, intentional, and scene-fluent, not one that converges toward the beige, statistically-average look every AI builder produces.
>
> **How to use this:** Go through each section against the actual codebase and rendered pages. For every item, either confirm the site avoids it or flag the file/line where it appears with a suggested fix. Treat every `[ ]` as a check to perform, not a task to build. Report findings grouped by severity: 🔴 dead giveaway, 🟠 weak/generic, 🟢 already good.
>
> **Context you already have going for you:** dark Detroit/underground aesthetic (not beige SaaS), a serif display face (DM Serif Display, not Inter/Instrument Sans), and a locked brand voice (lowercase, no em dashes, no hype). Several common tells are already designed out. This audit is mostly about catching regressions and the subtler stuff.

---

## 1. The core principle

AI doesn't design from taste, it designs from probability. Left unguided it returns "the median of every design that came before it" — average design at scale. Every tell below is a symptom of that averaging. The fix is never "make it look modern/clean/premium" (that IS the prompt that produces slop). The fix is a specific, opinionated decision only someone *in* the Detroit/underground scene would make. When auditing, the test question for any element is: **"Could this exact element appear on a plumber's site, a yoga app, and a SaaS dashboard?"** If yes, it's generic and should be flagged.

---

## 2. Visual design tells (the "top 10" giveaways)

These are the most-cited 2026 dead giveaways. Check each:

- [ ] **Aurora / ambient gradient background** — the blurry purple-blue glow behind the hero. This is THE default AI aesthetic; it signals "AI builder used" regardless of the brand. Detroit/underground should never have this. Flag any radial/blurred gradient blob backgrounds.
- [ ] **Multi-color gradient headline text** — purple→blue, cyan→pink gradient fills on `<h1>`/`<h2>`. Kills contrast and hierarchy for "vibes." Headlines should be solid color and be the most readable thing on the page.
- [ ] **The default blue→purple gradient anywhere** — buttons, cards, section dividers, icon fills. If you see `#6366f1`, `#8b5cf6`, indigo/violet Tailwind classes (`from-indigo-500 to-purple-600`, `bg-gradient-to-r`), scrutinize it. (Note: the brand purple `#8B7EC8` is legitimate, but confirm it's used as an intentional accent, not as a gradient-with-blue slop signature.)
- [ ] **Floating pills / badges in the hero** — "Trusted by 10,000+", "AI Powered", "#1 Platform", small rounded chips with blur/glow floating near the headline. Decorative credibility filler. Flag unless the badge reinforces a real, specific claim.
- [ ] **Stats bars in the hero** — a metrics strip under the CTA ("99.9% uptime", "500M processed"). For a pre-launch beat store these are unearned; they perform authority instead of establishing it. A real "trusted by X producers" counter is fine ONLY if believable and true.
- [ ] **The scroll-indicator mouse icon** — the tiny bouncing mouse/chevron at the bottom of the hero telling people to scroll. Overused artifact; adds noise, makes the hero feel desperate. Flag it.
- [ ] **Glassmorphism everywhere** — transparent frosted cards, `backdrop-blur`, soft translucent borders, floating panels stacked on each other. One CSS rule that makes anything look "premium" and identical to every other AI site. Hurts text readability. Flag glass-on-glass. (Occasional, intentional, readable use is OK; wall-to-wall is a tell.)
- [ ] **Fake dashboard / UI mockups** — generic charts "going up and to the right" that don't explain anything. Not relevant to a beat store, but flag any decorative fake-data graphics.
- [ ] **Over-animation** — everything fades in on scroll, everything glows on hover, every section has a Y-axis transform on enter. Motion mistaken for polish. Visitors wait for animations to finish before they can read/click. See §6.
- [ ] **Rounded-corners-plus-drop-shadow on everything** — the universal "soft card" look. Uniform `rounded-xl shadow-lg` on every element with no variation is a regression-to-mean signature. Vary or reduce; let some things be sharp/flat, which suits the gritty Detroit aesthetic better anyway.

---

## 3. Typography tells

- [ ] **Default "AI startup" typefaces** — Inter, Inter Display, Instrument Sans, Geist, General Sans. All fine fonts, all completely worn out and now read as "AI default." Confirm the site uses DM Serif Display + DM Mono (its actual brand faces) everywhere and that no stray Inter/system-sans has crept into a new component. Flag any `font-family` fallback that lands on Inter/Geist as the *visible* face.
- [ ] **Weak type hierarchy** — inconsistent heading sizes, awkward line lengths (measure should be ~50–75 characters), cramped or default line spacing, no deliberate scale. Check that headings step down on a real scale and body copy has comfortable `line-height`.
- [ ] **No typographic personality** — if the type could be swapped for any other sans and nothing would change, that's the tell. DM Serif Display is already a distinctive choice; make sure it's actually doing expressive work in the hero/headers, not buried.
- [ ] **Poor contrast** — light-grey text on white/dark-grey on black. WCAG minimum is 4.5:1 for normal text. Low-contrast body text is both an accessibility failure and a classic "shipped without review" tell. Check every text/background pair.

---

## 4. Color & background tells

- [ ] **Muted grey/white/beige palette with a single accent** — the "beige sans-serif haze." The Detroit palette (`#F5F4F0`, `#111111`, `#E8C832` gold, `#8B7EC8` purple) already avoids this, but confirm new sections haven't drifted into generic grey cards on white.
- [ ] **Single lonely accent color used timidly** — 2026 human-feeling sites commit to a full color *system* used confidently, not "monochrome + one safe accent." Check the gold and purple are deployed with intention across states (hover, active, focus), not sprinkled randomly.
- [ ] **Stock-photo / generic AI-image energy** — smooth, uncanny AI-generated hero images, or polished stock photos of people. These scream "template." Use real assets: actual cover art, real FL Studio screenshots, real Detroit/Michigan imagery, real product shots.

---

## 5. Layout & spacing tells

- [ ] **Inconsistent spacing** — margins/padding that vary between sections and elements so the page rhythm feels uneven. Consistent spacing is one of the clearest signs of *considered* design; erratic spacing is the clearest sign of unreviewed AI output. Check for a consistent spacing scale (e.g. 4/8/16/24/32) rather than random `mt-[13px]` one-offs.
- [ ] **The four-cards-in-a-grid default** — "purple gradient, Inter font, four cards in a grid, a faint hover state." The generic AI landing-page skeleton. If a section is just an even grid of identical cards, ask whether an intentional, slightly irregular layout would feel more human.
- [ ] **Perfectly sterile symmetry** — flawless grids with zero personality read as "empty showroom" in 2026. Consider intentional asymmetry, overlap, or a broken-grid moment somewhere signature (hero or featured beats) so it's clear a person made arrangement choices. (Don't overdo it — intentional, not messy.)
- [ ] **Shaky mobile layout** — resize the browser / test at 380px. Vibe-coded layouts overlap, overflow, or break at sizes the model wasn't prompted for. Since most traffic is mobile from TikTok/YouTube, test every page and every modal at narrow widths.

---

## 6. Motion / animation tells

- [ ] **Scroll-triggered fade-in on every element** — the single most overused AI motion pattern. Audit for blanket `animate-on-scroll` / IntersectionObserver fade-ups applied to everything.
- [ ] **Hover glow on things that don't need it** — reserve hover feedback for actually interactive elements (buttons, cards, links), not static text/images.
- [ ] **Animations that block reading/clicking** — if the user has to wait for a transition to finish before interacting, cut it. Motion should give feedback (button press, form validation, toggle), not perform.
- [ ] **Page transitions that take too long** — keep them snappy or remove. A static site should feel instant.

---

## 7. Copywriting / content tells

The visual layer is only half of it; generic copy is an equally strong giveaway. Since the brand voice is already locked (lowercase, minimal, confident, no hype, no em dashes), this section is mostly about enforcing it and catching AI phrasings.

- [ ] **Em dashes** — brand rule is zero em dashes (`—`). Grep the whole content layer (`products.json`, copy strings, meta descriptions, FAQ, license summaries) for `—` and replace. (Note: the em-dash-as-AI-tell is contested, but it's an explicit brand rule here, so enforce it regardless.)
- [ ] **The "it's not X, it's Y" negation formula** — "It's not about beats, it's about identity." A dead AI giveaway. Flag every negation-structure sentence.
- [ ] **Forced tricolons / lists of three** — "faster, cleaner, harder." AI overuses the rule-of-three with corporate perfection. One is fine; a pattern of them is a tell.
- [ ] **"Tapestry / landscape / in today's [x] world / delve into / navigate the complexities of / elevate / unlock / seamless / robust"** — the standard AI vocabulary. Grep for these and kill them. None belong in a Detroit beat store.
- [ ] **Generic interchangeable copy** — the "could describe any business" test. "Transform your workflow" / "Premium quality sounds" / "Take your music to the next level" could be any beat store. Replace with specific, scene-fluent lines that name the actual sound (Veeze, Lucki, GloRilla, Detroit, the specific vibe of a kit).
- [ ] **Everything turned up to 11** — AI hypes mundane things. Brand voice is low-BS; a drum kit is a drum kit, describe what's *in* it, not how it will "revolutionize your sound."
- [ ] **Suspiciously balanced, everything-wrapped-in-a-bow prose** — AI covers every angle equally and closes every loop. Humans take a stance and have opinions. Product/beat descriptions should pick favorites and have a point of view.
- [ ] **Spotless uniformity** — every product description exactly the same length and structure is a machine tell. Real human catalogs have variety: some beats get a one-liner, some get three sentences, some get a story.
- [ ] **Fabricated social proof** — do NOT invent testimonials attributed to real named people or claim placements with named artists you haven't worked with (crosses into false advertising and the scene will clock it). Puffery is fine; fake named quotes are not. Flag any placeholder testimonial with a fake real-sounding name.

---

## 8. Placeholder & "unfinished" tells

These say "nobody finished the job" louder than anything:

- [ ] **Leftover placeholder text** — `lorem ipsum`, "Your headline here", "Add description", TODO comments rendered to the page. Grep for these.
- [ ] **Dead links / links that go nowhere** — `href="#"`. **You have a known instance:** the five kits with `checkoutUrl: "#"`. Anything pointing to `#` or a placeholder URL is a giveaway and a lost sale. Flag all of them.
- [ ] **Vague CTAs** — buttons that don't say what happens next ("Submit", "Click here", "Learn more" with no object). Use specific verbs ("Browse beats", "Get the free pack", "Add to cart").
- [ ] **Polished shell over broken function** — the "super posh landing page for a product that doesn't work yet" tell. AI optimizes the happy path and produces interfaces that *look* complete until someone uses them. Actually click through: play a preview, open the license modal, add to cart, hit checkout, submit the email form. Flag anything that looks done but isn't wired up.
- [ ] **Inviting interaction that leads nowhere** — elements styled as clickable/interactive that do nothing when clicked.

---

## 9. Code-level tells (Next.js / static export specific)

The deepest problems aren't visual. Check the codebase itself:

- [ ] **Over-engineering for the scale** — LLMs default to "best practice" regardless of problem size: abstract base classes, factory patterns, dependency injection, elaborate state management for what is a static catalog. A ten-line job wrapped in a repository pattern is a vibe-code signature. Flag needless abstraction. (This aligns with the project's own "lightweight over agent-orchestration" principle.)
- [ ] **Inconsistent patterns between modules** — auth/data/fetch done one way in component A and a completely different way in component B with no rationale, because different sessions made different choices. Look for two components solving the same problem differently.
- [ ] **Dependency bloat** — 80+ deps for a simple site because the model suggested a popular library for every sub-problem instead of using stdlib / what's already installed. Audit `package.json`; flag libraries pulled in for a single trivial use where existing tooling would do.
- [ ] **Unnecessary / duplicate JavaScript and CSS** — AI output is often heavier than needed: duplicate CSS rules, unused utility bloat, JS that could be static. This tanks Core Web Vitals.
- [ ] **Missing lazy-loading / uncompressed images** — a common AI omission that kills load speed. Confirm images are compressed and lazy-loaded. (Big deal for mobile TikTok/YouTube traffic; >3s load loses ~53% of mobile users.)
- [ ] **"Welded" components** — a change to one thing (e.g. a pricing toggle) silently breaks three others because the model wired unrelated things together inside one component. Check that the hero, license modal, cart, and product card are cleanly separated and independently editable. This is the maintainability tell that costs the most later.
- [ ] **Structure only the model understands** — if no human could explain how a given component works, that's the underlying disease. Favor readable, boring, explicit code over clever generated structure.

---

## 10. Accessibility & SEO/AEO tells (the "shipped without a review pass" signals)

- [ ] **Missing alt text** — every cover image needs descriptive alt (`alt="Cashed Out Detroit drum kit cover"`), not empty or `alt="image"`. Common AI omission and an accessibility failure.
- [ ] **Unlabelled buttons / poor keyboard support** — icon-only buttons with no `aria-label`; test full keyboard-only navigation (tab order, focus states, modal focus trapping).
- [ ] **Missing SEO/AEO basics** — no meta descriptions, duplicate/absent page titles, missing Open Graph images, no JSON-LD structured data, thin heading structure. All flag a site that shipped without an SEO pass. (Cross-reference the playbook's SEO section; the JS-rendered-catalog-invisible-to-crawlers item is the big one.)
- [ ] **Low-contrast text** — appears on ~79% of homepages; the single most common accessibility failure. Re-check per §3.

---

## 11. What "human / handmade" looks like (positive direction)

2026 design is having an intentionally human moment — a deliberate rebellion against AI sameness. When flagging a generic element, steer toward these instead. The unifying idea: **make decisions only a person in this scene would make.**

- **Texture and grit** — tactile elements (paper grain, ink, halftone, VHS/tape texture, xerox/photocopy roughness) fit the Detroit/underground identity perfectly and read as "made by a human, not rendered." A little roughness is on-brand *and* anti-slop.
- **Real, specific imagery** — actual cover art, real Detroit/Michigan visuals (map, skyline, area-code energy), real FL Studio/session shots. Not AI images, not stock.
- **Intentional irregularity** — slight asymmetry, an overlap, a broken-grid moment. Signals "someone arranged this," not "content dropped into a template." Keep it purposeful.
- **A committed color system** — use the full gold+purple system confidently across states, not one timid accent.
- **Distinctive type doing real work** — let DM Serif Display carry personality in the hero and section heads.
- **Opinionated, scene-fluent copy** — pick favorites, name the artists/sound, have a point of view, vary the length. Talk like someone in the culture.
- **Motion with a job** — micro-interactions that give feedback (button press, add-to-cart confirmation, form validation), not decorative fade-ups.
- **Consistent spacing rhythm** — the quiet signal of considered design.

---

## 12. Audit output format

For each finding, Claude Code should report:

```
[severity] [file:line or page/section]
Tell: <which item from this doc>
What's there: <the specific element/code/copy>
Fix: <the specific, on-brand replacement>
```

Severity key: 🔴 dead giveaway (fix first) · 🟠 generic/weak (fix soon) · 🟢 already good (note it, no action).

End with a short summary: the 3 highest-impact fixes, and an honest overall read on whether the site currently passes the "could a person tell a human made this?" test.

---

## Sources / basis

This checklist synthesizes 2026 reporting and practitioner writing on AI-generated / vibe-coded website tells: Business Insider's "3 telltale signs" (regression-to-the-mean aesthetic, polished-shell-over-broken-function), NewWebsite.ai's "10 signs a website was designed by AI" (aurora backgrounds, gradient headlines, floating badges, stats bars, scroll icon, glassmorphism, worn-out fonts, over-animation, generic copy), Sinton Agency and DNSK.work on structural/maintainability tells (welded components, structure only the model understands, dependency bloat), AquilaX on code-level signatures (over-engineering, inconsistent patterns), and multiple 2026 design-trend surveys (Webflow, Envato, TBH Creative, DesignMantic) on the human/handmade counter-direction (texture, intentional irregularity, committed color systems, real imagery). Copywriting tells draw on working copy/content writers cataloguing AI phrasings (negation structure, forced tricolons, "tapestry/landscape/delve," suspiciously balanced prose).
