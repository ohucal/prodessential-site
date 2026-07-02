# prod.essential — dev reference

Static Next.js (App Router) beat/kit store. `output: 'export'` (Netlify, no server), `trailingSlash: true`. Payhip handles checkout.

## Golden rule: `products.json` is the single source of truth
Every beat/kit surface is derived from `products.json` at build time. Add/edit a beat there and it automatically flows to:
- Beat store list & filters (`components/BeatStore.tsx`)
- Static per-beat page `/beats/<id>/` (`app/beats/[id]/page.tsx` via `generateStaticParams`)
- Featured strip on the home hero (`components/FeaturedBeats.tsx`, when `featured: true`)
- `sitemap.xml` (`app/sitemap.ts`)

**Never hand-edit derived output** (the `out/` folder, sitemap, etc.) — regenerate by editing `products.json` and rebuilding. Kits work the same way (`kits` array).

## Data flow
`products.json` → `lib/products.ts` (imports it, normalizes, derives Payhip checkout state) → components. Payhip URL parsing lives in `lib/products.ts` (`parsePayhipCheckout` / `deriveCheckout`); a license's buy button state is auto-derived from its `checkoutUrl`.

## Assets
Live in `public/` (served at site root). Beat audio → `public/audio/<name>.mp3`, covers → `public/images/<name>.jpg`. In `products.json` the paths are root-relative **without** `public/` and **without** a leading slash: `"audioFile": "audio/x.mp3"`, `"imgFile": "images/x.jpg"`. `imgGradient` is the fallback shown when the image is missing.

## Audio tagging
`python scripts/tag_audio.py` writes ID3 tags to every beat's mp3 (driven by `products.json`). Idempotent — safe to re-run. Resolves files under `public/`. Skips (doesn't fail on) missing files. Needs `mutagen`. Free beats get a `[FREE FOR NON-PROFIT]` title, others `[PREVIEW]`.

## Key files
- `components/BeatCard.tsx` — the beat card (variants: `store` full card, `compact` minimal). Store variant = tags, NEW badge, featured star, price/free, inline timeline player, opens glass overlay.
- `components/BeatDetail.tsx` + `components/BeatPurchase.tsx` — the beat page body + license picker/checkout (shared by the standalone page and the glass overlay modal).
- `lib/products.ts` — types + normalization. `lib/licenses.ts` — license copy/details. `lib/keywords.ts` — SEO copy. `lib/assets.ts` — asset URL helper.
- `style.css` — single global stylesheet.

## Commands
- Dev: `npm run dev` (or the `dev` preview config). Build/export: `npm run build` → `out/`.
- Verify UI changes in the preview (`preview_*` tools), not by asking the user to check.
- ⚠️ **Never run `next build` while a dev server is running.** This is `output: 'export'`, so build and `next dev` share the same `.next` dir — a build corrupts the dev server's webpack chunks (symptoms: "Cannot find module './NNN.js'", unstyled page). To recover: stop the server, `rm -rf .next`, restart. To verify compilation without building, rely on the dev server + typecheck (`npx tsc --noEmit`).

## Adding a beat
Use the `/add-beat` skill — it has the full checklist and JSON template.

## Model routing & AI workflow (spend the right model on the right job)
Pick the model by job, not habit — this is the main cost control:
- **Opus** — deep reasoning: architecture, audits, writing/refining specs & skills, gnarly bugs. Use it to produce **reusable artifacts** (specs, skills, plans) that make cheaper models smart, not for routine edits.
- **Fable / fast models** — execution and broad sweeps: run a spec across many files, mechanical fixes, repetitive edits. Fastest way to burn through a well-defined backlog.
- **Sonnet** — everyday workhorse once a spec/plan exists.

Working rules that cut credit use without cutting quality:
- **Point at a spec, don't re-explain.** Recurring/multi-step work lives in `SPECS/` — reference it instead of re-describing context each session.
- **Report first, fix second, verify each.** Ask for a findings report before edits; it prevents rework and back-and-forth.
- **Constrain scope + define done.** State what NOT to touch and the finish criteria up front.
- Ready-to-paste prompts live in `PROMPTS.md`. Prioritized backlog in `ROADMAP.md`.

## Keep ROADMAP.md current
`ROADMAP.md` is the living backlog — maintain it as you work, without being asked:
- When you finish something that was on it, check it off (or move it to `## Done` with the date).
- When you notice a bug, gap, or idea that's out of scope for the current task, add a one-liner to the `## Inbox` section instead of derailing. Triage Inbox items into the prioritized sections when asked.
- Don't let it go stale: if an item is clearly obsolete or already handled, remove it.

## Skills
- `/add-beat` — add a beat (checklist + JSON template).
- `/seo-check` — audit/fix SEO quality across products.
- `/conversion-review` — CRO review of the buy flow.

## Other docs
- `SPECS/` — executable specs (start with `SPECS/AUDIT.md`). `SPECS/README.md` explains the pattern.
- `ROADMAP.md` — prioritized backlog (SEO, conversion, perf, features). Pull tasks from here.
- `PROMPTS.md` — copy-paste prompt library for common jobs.
- `PROD_ESSENTIAL_PLAYBOOK.md` — business/growth strategy (not technical). Only read if the task is about marketing/pricing/roadmap.
