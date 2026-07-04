# prod.essential — Marketing Strategy Options (Research Spec)

> **Purpose:** This is a context/options document, not a locked-in plan. It captures marketing strategies, funnel models, tactics, and tooling researched for prod.essential in a session focused on promoting producer products (kits, packs, Serum/Zenology banks, one-shots, MIDI, multikits, plugin presets). Nothing here is mandatory — treat it as a menu Owen can pull from when deciding what to actually build next. Paste into a Claude Code session or Claude Project for context.
>
> **Research date:** 2026-07-03 · **Scope:** Promotion/marketing for producer-facing products specifically (not beat-lease marketing, which is covered in `PROD_ESSENTIAL_PLAYBOOK.md`)

---

## 0. Key reframe from this research

Producer products (kits/packs/banks/bundles) are the scalable revenue — one product, unlimited buyers. Beats are the brand + artist funnel — one beat, one buyer (per lease, though leases can sell multiple times).

Social media is now the storefront's front door, not just an awareness channel. Social drives an estimated 58% of beat sales for producers, and a single viral TikTok/Reel can generate $5,000–$20,000 in sales within a month when the content is good enough that viewers want to buy. The practical implication: marketing = building one content engine that feeds an email funnel that sells kits on autopilot, not a list of disconnected social posts.

**Blocking issue identified:** as of this research, prod.essential's 5 producer products (Complete Kit Vol.1, Essential Drums Vol.1, Essential One Shots Vol.1, Essential Serum 2 Bank Vol.1, etc.) had `checkoutUrl: "#"` in `products.json` — not buyable. No marketing strategy matters until this is fixed. This is flagged in `PROD_ESSENTIAL_PLAYBOOK.md` §4 and §20 as the top Phase 1 priority.

---

## 1. The funnel model (WavGrind-style — proven in this exact niche)

WavGrind (producers.wavgrind.com) is the clearest working example in the beat/sample-pack space: built to 50,000+ customers and 120,000+ pack downloads using this exact funnel.

**Structure:**
1. **Free pack (email-gated)** — not charity, it's top-of-funnel lead capture
2. **Email list** — the compounding asset
3. **Tripwire offer** — low-price bundle shown immediately after signup / in email #1
4. **Ascension** — bigger bundles, flagship "everything" bundle
5. **Affiliates** — recruit other producers to promote for a cut

**WavGrind's specific tactics worth studying (not necessarily copying verbatim):**
- Value-stack framing: list items' individual "value," sum it, cross it out, drop one price (e.g. "$497 value → $27")
- Lifetime money-back guarantee, no proof required, no need to delete the pack (see §5 below for whether this fits prod.essential)
- "$XXX in bonuses" stacking to increase perceived value without increasing cost
- Genuinely massive free packs (thousands of files) to build trust before the paid ask

**How this could map to prod.essential (option, not a plan):**
- Free Detroit Loop Pack (loops/one-shots/MIDI harvested from existing 36 beats) → Kit email signup
- Tripwire: "Detroit Starter Pack" at $15–29 shown on confirmation page + email #1
- Ascension: bigger bundles (e.g. "The Vault" flagship already scoped in `PROD_ESSENTIAL_PLAYBOOK.md` §5)
- Payhip has built-in affiliates — could reuse for producer-to-producer referral

**Efficiency note:** every beat already made is also a loop kit + MIDI pack + one-shot kit waiting to be exported. One production session → 3–4 sellable SKUs. This is called out in the Playbook (§3) as the "harvest" strategy.

---

## 2. Content engine — platform roles (2026 research)

### YouTube — compounding, search-driven asset
- Type-beat videos rank in search and pull traffic for years (passive, doesn't decay like social posts)
- Channels above 10k subscribers commonly report 60–80% of beat sales coming from YouTube traffic
- **2026-specific tactic — outlier detection / artist-subgenre combos:** oversaturated terms like "Drake type beat" are owned by catalogue channels. The move is niche artist-subgenre combos where search demand is rising faster than upload supply (e.g. "Veeze x Lucki type beat" rather than just "Veeze type beat")
- An "outlier" video performs 3–10x its channel's own median views. When a new artist name appears in outlier thumbnails, that signals a breakout 3–6 weeks after an album/viral single — the move is to cut a beat targeting that artist within 7 days
- Tools for this: OutlierKit, VidIQ, TubeBuddy
- Title structure: `[Artist] Type Beat 2026 | 'Title' | [Mood/Subgenre]` — artist name first since that's the search term
- Every video description should carry the store link + a free-pack link, not just the checkout link

### TikTok / Instagram Reels — top-of-funnel discovery
- Algorithm rewards watch time and shares, not follower count — a zero-follower account can reach thousands if content holds attention
- Winning formats for this niche: 30–60s cookup clips (laying an 808, building a melody, "all these sounds are in the free pack" reveal), before/after (raw loop vs. finished beat), "made this in 5 minutes with my kit"
- Cadence: 3–7 posts/week minimum across sources; some cite up to 2–3/day as optimal. Hook in first 2 seconds is non-negotiable
- Viral moments typically come after months of consistent posting, not the first two weeks — don't judge a strategy on a 2-week trial
- Post multiple angles/versions of the same concept rather than one "perfect" video — gives the algorithm more chances to find the winning cut
- **Critical connection most producers miss:** end cookup videos with a CTA to the free pack specifically ("the loops in this are free, link in bio"), not a generic "go buy beats" — this is what converts a viewer into an email capture, which is what actually compounds

### Reddit — underused distribution + AI-SEO signal
- Active drum-kit sharing culture exists on r/Drumkits, r/makinghiphop
- Aggregator sites (e.g. Kits4Beats) publish monthly "Top Drum Kits — Reddit Edition" roundups compiling the best free community kits
- Dropping a genuinely good free mini-kit there (tagged, DAW-agnostic, described by style/artist reference) can get organic distribution + a mention on a third-party site that AI answer engines (ChatGPT, Perplexity) may cite — ties into the AI-SEO strategy already in `PROD_ESSENTIAL_PLAYBOOK.md` §10

---

## 3. Automation / AI tooling stack (options, roughly ordered by effort)

**Content repurposing (biggest time-saver identified across sources — cuts production time 60–80%):**
- Record one longer cookup video (10–20 min) → run through **Opus Clip** or **Descript** to auto-cut 5–10 vertical shorts with captions, ranked by predicted engagement
- One filming session → a week of TikTok/Reels/Shorts content

**Scheduling / batch posting:**
- **Buffer, Later, or Metricool** — queue a week of content across TikTok/IG/YouTube from one calendar
- AI-assisted versions suggest optimal posting times based on audience activity data
- Reported time savings: 10+ hours/week from batch scheduling alone

**Writing / ideation batching:**
- Feed a model (Claude, ChatGPT) a list of 10 beat titles or content ideas in one session → get back full content packages (hook, caption, hashtags, YouTube title/description) for all 10 at once
- Reported output: ~10 posts + ~30 repurposed formats + ~50 hooks in about 30 minutes of session time
- **Caveat repeated across every credible source:** AI does ~80% of the work, human refines ~20%. Raw AI captions read like raw AI captions — brand voice (underground, minimal, no em dashes, lowercase preferred) needs a manual pass every time

**Advanced / future-state option — MCP-based pipeline:**
- Since Owen already runs Claude Code + Claude Projects, a longer-term option is an MCP-connected pipeline where Claude reads a content brief, generates the asset batch, and routes organic vs. paid variants to different destinations (scheduling queue vs. ad platform) in one automated session
- Recommended starting point: keep a human review/approval gate before anything posts; only remove the gate once output quality is trusted
- Not a day-one build — flagged here as a direction to grow into, not a current task

**Email automation (already partially built):**
- Kit (ConvertKit) can run the entire welcome sequence automatically: free-pack delivery → day-2 "best beat" email → day-4 bundle offer w/ discount code → weekly cadence after
- This is where the funnel actually monetizes without ongoing manual work once set up

---

## 4. Specific tactics (the "random things that help" list)

- **Tag preview/free audio files before promoting anything.** Untagged preview MP3s sitting at directly-downloadable URLs are already giving away release-quality files for free — this undermines the whole free-tier strategy. (Also flagged in Playbook §7.)
- **Turn on Payhip reviews and seed them honestly** — give the free pack to early users, ask for genuine feedback. Zero social proof currently exists; even 5 real reviews changes conversion meaningfully.
- **Value-stack every bundle** using the crossed-out "value → price" format — the single most copied conversion tactic across every competitor analyzed in the Playbook.
- **Use real, rotating urgency** rather than a permanently "fake" sale — a small, scene-aware audience notices fake scarcity fast.
- **Post multiple content angles of the same concept**, not one polished version — increases odds the algorithm finds a winning cut.
- **Watch for artist breakouts and move fast** — cutting a targeted beat within ~7 days of a new artist-reference trend outperforms slower, broader content.
- **Every cookup video ends with a free-pack CTA**, not a direct sales pitch — converts viewers to emails, which is the actual compounding asset.

---

## 5. Refund / money-back guarantee — analysis (option, not a decision)

**What a "lifetime money-back guarantee" actually means (WavGrind's version):** no time limit on refund requests, no proof of dissatisfaction required, and the buyer isn't even asked to delete the files. It's a deliberate risk-reversal tactic to remove purchase hesitation entirely.

**Why it doesn't map cleanly onto all of prod.essential's catalog:**
- WavGrind sells royalty-free samples/MIDI with no license agreement tied to a specific released song — there's no ongoing liability once refunded.
- prod.essential's **beat leases are licensed products** with contracts. The existing license agreements (see `basic-mp3-license.docx`, `premium-license.docx`, etc.) already state the license fee is non-refundable once the beat is delivered, except for a Licensor breach of warranty. A public "refund anytime, no questions" promise would directly contradict these signed agreements. Risk scenario: someone leases a beat, releases a song, then asks for a refund months later while the song is still live/streaming.
- **Kits, packs, bundles, presets, MIDI have no license agreement or producer-credit chain tied to a release** — much closer to WavGrind's actual product, and a generous guarantee here carries far less downside.

**Recommendation surfaced in this session (option, not a directive):**
- **Kits/packs/bundles/presets/MIDI:** a bounded guarantee (7 days is the norm among the competitor set in the Playbook — e.g. eleftheriosaudio) captures most of the conversion benefit without leaving the door open indefinitely. At $10–30 price points, abuse risk is low regardless.
- **Beat leases/exclusives:** keep non-refundable post-delivery, consistent with the existing signed license agreements. Do not extend a guarantee here.

**Legal/practical notes to verify before committing to any refund policy:**
- Once a refund policy is publicly stated, it becomes a real obligation — both reputationally (small scene, producers talk) and potentially under consumer protection law if the stated policy isn't honored. (Not legal advice — worth a real lawyer check if pursuing this.)
- A stated, bounded refund policy also protects against **chargebacks** — an unhappy buyer with no refund channel disputes the charge with their bank/Stripe/PayPal instead, which costs a fee on top of the lost sale and can flag/restrict the merchant account with repeated occurrences.
- Unverified: how Payhip handles the 5% platform fee on a refunded sale (whether it's returned or eaten). Check Payhip's own documentation before finalizing policy language.

---

## 6. Suggested weekly operating rhythm (option — one possible cadence)

**Production day (1x/week):**
- Produce 2–3 beats
- Harvest each into loops/MIDI/one-shots for the free pack and future kit releases
- Record one longer cookup video while working

**Same day — content batching:**
- Run the cookup through Opus Clip/Descript for the week's shorts
- Batch-write captions/titles/descriptions with AI, then manually pass for brand voice
- Load into Buffer/Metricool scheduled across the week

**Running in the background:**
- Kit welcome sequence delivers free pack + tripwire offer automatically
- YouTube uploads sit and accumulate search traffic
- GA4 / Meta Pixel collecting data

**Low-effort ongoing:**
- Weekly check of outlier tools for breakout artists
- Reply to comments (algorithm signal)
- Occasional free kit drop on Reddit

**Later, once funnel converts organically:**
- Small Meta ad budget ($5–15/day) pointed at the free-pack landing page specifically, not the homepage
- Don't run paid traffic before the organic funnel is proven — otherwise ad spend fills a leaky bucket

**Suggested build order if pursuing this direction:** kits made buyable → free pack built → Kit email sequence automated → content engine running → paid ads.

---

## 7. Open questions / things to decide before building any of this

- Which specific option(s) from §1–6 does Owen actually want to pursue first, if any?
- Free pack: how many files, which beats to harvest from, timeline to assemble?
- Refund policy: bounded guarantee on kits only, or skip a formal guarantee entirely for now?
- Automation stack: worth paying for Opus Clip/Descript/Buffer now, or manual repurposing until volume justifies it?
- Reddit distribution: comfortable posting kits there, or prefer to keep distribution limited to owned channels (site, YouTube, TikTok, email)?

---

*This document is a research/options reference, not a roadmap commitment. Cross-reference `PROD_ESSENTIAL_PLAYBOOK.md` for the fuller existing strategy (bundles, pricing, SEO, AI-SEO, competitor notes) — this file supplements it with the marketing/promotion research from the 2026-07-03 session.*
