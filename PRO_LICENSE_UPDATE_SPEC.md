# prod.essential — License & Site Update Spec (PRO / ASCAP)

> Handoff doc for Claude Code. Implements two reviewer-flagged contract fixes plus
> the ASCAP registration info now that prod.essential is a registered ASCAP member.
> Voice rule for any new contract text: no em dashes, plain and consistent with existing clauses.

---

## 0. Status snapshot (read first)

ASCAP membership is set up. There are TWO sides, and one IPI is live, one is pending:

| Side | Entity | Member ID | IPI / CAE | Status |
|---|---|---|---|---|
| Publisher | PROD.ESSENTIAL PUBLISHING | 8312487 | **1358011863** | Accepted ✅ |
| Writer | Owen Hucal | 8312488 | _pending (2–4 wks)_ | Pending ⏳ |

**Implication:** the publisher IPI is final and can go in now. The writer IPI is not issued
yet. Where this spec shows `[WRITER_IPI]`, leave it as a literal placeholder until the writer
IPI email arrives, then do the one-line follow-up edit in §A1. Everything else can ship today.

---

## 1. Canonical values (use these exactly)

- Legal name: **Owen Hucal**
- Professionally known as (p/k/a): **prod.essential**
- Required producer credit format (unchanged, already in contracts): **Prod. essential**
- PRO: **ASCAP**
- Publishing company: **prod.essential Publishing**
- Publisher IPI/CAE: **1358011863**
- Writer IPI/CAE: **[WRITER_IPI]**  ← fill when issued
- Contact: prodessential@gmail.com

---

## PART A — License document changes

Files live in the project (the six `.docx` license agreements). Three distinct edits below.
Apply each edit to the files listed under it. Use the quoted "FIND" text as the anchor.

### A1. Add ASCAP registration info to the Publishing Splits section

**Why:** the contracts already tell buyers to register the Licensor's writer and publisher
shares, but never give them the data to do it. This adds it.

**Apply to (5 files):**
- `basic-mp3-license.docx` (Section 8 — Publishing Splits)
- `premium-license.docx` (Section 7 — Publishing Splits)
- `premium-stems-license.docx` (Section 7 — Publishing Splits)
- `unlimited-license.docx` (Section 7 — Publishing Splits)
- `exclusive-license.docx` (Section 7 — Publishing Splits)

Do NOT add to the Free/Demo license (non-profit demo use, no registration).

**How:** in each file's Publishing Splits section there is a closing sentence that begins
"If the Licensee registers the New Song with a Performing Rights Organization (PRO)...".
Insert the block below **immediately after that sentence**, as a new paragraph.

**INSERT this block:**

> **Licensor Registration Information.** For the purpose of registering the Licensor's
> share of the underlying composition with any PRO, distributor, or rights administrator,
> the Licensor's information is: Legal Name: Owen Hucal, professionally known as
> prod.essential; Performing Rights Organization: ASCAP; Writer IPI/CAE Number:
> [WRITER_IPI]; Publishing Company: prod.essential Publishing; Publisher IPI/CAE Number:
> 1358011863. When registering the New Song with any PRO, distributor, or rights
> administrator, the Licensee must list the Licensor as a co-writer using this information.

**Writer-IPI follow-up:** once the writer IPI is issued, find-and-replace `[WRITER_IPI]` with
the real number in SEVEN places: the five paid `.docx` files in `public/licenses/` (these also
carry an inline `(REMINDER: INSERT ASCAP WRITER IPI ONCE RECEIVED)` tag — delete that tag at
the same time), plus `lib/licenseTexts.ts` (the on-site license modal text, five occurrences,
no reminder tag). Then re-export the PDFs and re-attach in Payhip. That is the only remaining
step after this ships.

---

### A2. Add the "cap exceeded" upgrade sentence to Permitted Uses

**Why:** the capped tiers state stream/unit limits but never say what happens at the ceiling.
This makes the upgrade-or-remove consequence explicit, giving clean leverage if a song blows up.

**Apply to (3 files — the capped tiers only):**
- `basic-mp3-license.docx` (Section 5 — Permitted Uses; caps: 2,000 units / 50,000 streams)
- `premium-license.docx` (Section 4 — Permitted Uses; caps: 3,000 units / 100,000 streams)
- `premium-stems-license.docx` (Section 4 — Permitted Uses; caps: 10,000 units / 500,000 streams)

Do NOT add to Unlimited or Exclusive (no caps) or Free.

**How:** each Permitted Uses section ends with item (g):
"(g) Distribute the New Song free of charge for promotional purposes (including inclusion on
free mixtapes or promotional EPs)." Add the sentence below as a new paragraph **immediately
after item (g)**, at the end of the Permitted Uses section.

**ADD this sentence:**

> If the Licensee exceeds any of the distribution or streaming caps set forth in this Section,
> the Licensee must immediately upgrade to a higher tier license or remove the New Song from
> all distribution channels, streaming platforms, and video platforms.

---

### A3. Add the missing sync parenthetical to the Basic tier

**Why:** Premium and Premium+Stems both carry a "(separate sync license must be negotiated)"
note in their sync restriction. Basic is missing it. Pure consistency fix.

**Apply to (1 file):**
- `basic-mp3-license.docx` (Section 6 — Prohibited Uses, item (c))

**FIND this text (Basic §6(c)):**

> (c) Synchronize the Beat or the New Song with any audiovisual work other than the one (1)
> permitted non-monetized music video, including but not limited to film, television,
> commercials, video games, theatrical productions, or branded content;

**REPLACE with:**

> (c) Synchronize the Beat or the New Song with any audiovisual work other than the one (1)
> permitted non-monetized music video, including but not limited to film, television,
> commercials, video games, theatrical productions, or branded content (a separate sync
> license must be negotiated with the Licensor for any such use);

> Note: in the source the Basic sync clause may be lettered (c), (d), or (e) depending on the
> build. Anchor on the sentence text above, not the letter.

---

## PART B — Site changes

### B1. Free-download acceptance checkbox — VERIFY ONLY, no change expected
The free download flow must require a checked acceptance box linking the Free/Demo license
before the download triggers. This was already implemented (`index.html`: the `freeAgree`
checkbox, the disabled-by-default download button, and `validateFreeForm()` /
`submitFreeDownload()` gating). Action: confirm it is still present and working. No edit unless
it has regressed.

### B2. On-site license text — sync if any exists
If license terms are displayed anywhere on the site (a `/licensing` page, a modal, summary
copy), update those to match the three edits above so on-site text and delivered PDFs agree.
If no license text is rendered on-site (terms only delivered as PDFs via Payhip + the free
license link), there is nothing to do here.

There are no other site changes in this round. The substantive work is in the license docs.

---

## PART C — After editing: deployment / fulfillment steps

These are manual, outside the code edits, but required for the changes to actually reach buyers:

1. **Re-export** each edited `.docx` to PDF (whatever current export process is used).
2. **Re-attach** the updated PDF to its matching product in Payhip (so future buyers receive
   the corrected license).
3. **Replace the hosted Free/Demo license file** that the on-site checkbox links to, so the
   free-download terms match.
4. When the **writer IPI** arrives: do the §A1 find-and-replace (`[WRITER_IPI]` → real number),
   re-export, and re-attach/replace as above.

---

## PART D — Open items / not in scope

- **Writer IPI** is pending (2–4 weeks). Tracked in §A1; one-line edit when it lands.
- **Register existing works:** the songs already on Spotify/Apple that use prod.essential beats
  should be registered as works in ASCAP Member Access (song title, 50% writer share,
  prod.essential Publishing) so performance royalties match. This is an ASCAP-portal task, not
  a site/contract task. Listed here so it is not forgotten.
- **Lawyer pass:** before heavy go-live, a one-time attorney review of the licenses is advisable
  (Michigan venue, warranty/indemnity reps). Not a code task.

---

## Quick checklist for Claude Code

- [x] A1: insert registration block in 5 docs (Basic, Premium, Premium+Stems, Unlimited, Exclusive)
- [x] A2: add cap-exceeded sentence in 3 docs (Basic, Premium, Premium+Stems)
- [x] A3: add sync parenthetical in Basic
- [x] B1: verify free-download checkbox still present (BeatPurchase.tsx `agree` state gates the download)
- [x] B2: sync on-site license text (`lib/licenseTexts.ts` now matches the docx text verbatim)
- [x] Reviewer fix 1: Publisher's Share changed to 50/50 in all non-exclusive paid tiers (docx + site)
- [x] Reviewer fix 2: "Except as expressly stated below" warranty qualifier added to all 5 paid tiers (docx + site)
- [x] Cleanup: removed stray "subject to the caps in this Section" from Unlimited (it has no caps)
- [ ] C: re-export PDFs, re-attach in Payhip, replace hosted free license
- [ ] Later: replace `[WRITER_IPI]` when issued (7 places — see §A1 follow-up)
