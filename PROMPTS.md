# PROMPTS — copy-paste library

Ready-to-paste prompts for common jobs. The shape that works: **point at a spec → define done → constrain scope → report-first**. Works with any model; especially good for fast models (Fable) executing a well-defined task.

Add prompts that worked well; delete ones that didn't.

---

## 1. Full audit (report only)
```
Read SPECS/AUDIT.md and execute the report pass. Walk every check against source and the live preview (home, a beat page, a kit page, /confirmed). Produce AUDIT_RESULTS.md in the spec's format, findings grouped P0/P1/P2 with file:line and a proposed fix each. Do NOT change any code — report only. End with counts per priority and your top 5 recommendations.
```

## 2. Fix the audit findings (autonomous, guardrailed)
```
From AUDIT_RESULTS.md, fix every P0 and P1. Rules: products.json is the single source of truth — edit source, never derived output (out/, sitemap.xml). After each fix, verify in the preview. Run npx tsc --noEmit at the end. Update AUDIT_RESULTS.md marking each item done. If any item is ambiguous or risks brand voice/pricing, skip it and list it for me instead of guessing.
```

## 3. SEO pass
```
Run the /seo-check skill. Report pass first: score every product against the rubric, findings P0/P1/P2 with file:line. Then fix P0/P1 by editing lib/*.ts and products.json only. Verify rendered <head> and JSON-LD for 3 products in the preview. Don't keyword-stuff.
```

## 4. Conversion review
```
Run the /conversion-review skill. Walk the buy flow in the preview on desktop AND 375px mobile. Give me a P0/P1/P2 findings report, then name the top 3 highest-impact/lowest-effort changes. Don't implement yet — wait for my pick.
```

## 5. Implement a picked conversion change
```
Implement <change> from the conversion review. Keep products.json as source of truth. Verify on desktop + mobile in the preview, npx tsc --noEmit, and tell me which GA4 event would confirm it works.
```

## 6. Design polish pass
```
Use the frontend-design skill. Do a consistency + polish pass on <page/component> against style.css's existing system — spacing, typography, hover/focus states, mobile at 375px. No new magic numbers; reuse tokens. Show before/after screenshots from the preview. Report what you changed and why.
```

## 7. Pull from the backlog (autonomous burst — good for a fast-model window)
```
Read CLAUDE.md and ROADMAP.md. Work top-down through the unblocked P0/P1 items. For each: implement, verify in preview, npx tsc --noEmit, check it off in ROADMAP.md. Batch related edits. Stop and ask only on ambiguity or anything touching pricing/brand voice. Give me a running summary as you go.
```

## 8. Add a beat
```
Use the /add-beat skill for <title>. <paste details: bpm, key, tags, price, payhip links, files>.
```

## 9. Plan a bigger feature (use a reasoning model)
```
I want to <feature>. Don't code yet. Read the relevant files, then give me a short plan: approach, files to touch, trade-offs, risks, and a definition of done. Write it to SPECS/<name>.md using SPECS/_TEMPLATE.md if it's something I'll repeat.
```

## Tips
- Prefer one focused task per session; long omni-sessions waste context re-reading.
- For a fast-model window: front-load with report/plan prompts (2, 4, 9) done cheaply first, then let it execute (7).
- End risky prompts with: "stop and ask instead of guessing."
