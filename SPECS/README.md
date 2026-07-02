# SPECS/

Executable specs. Instead of prompting a model freeform, point it at a spec here. This is the single biggest quality-per-credit lever: the spec carries the context so the session doesn't have to rediscover it, and any model (Fable, Opus, Sonnet) produces consistent output.

## How to use
> "Read `SPECS/<name>.md` and execute it. Follow its output format. Report first; don't change code until I approve — unless the spec says otherwise."

## Files
- `_TEMPLATE.md` — copy this to start a new spec.
- `AUDIT.md` — full repeatable site audit → `AUDIT_RESULTS.md`.
- Add more as recurring tasks emerge (e.g. `RELEASE.md`, `PRICING_CHANGE.md`).

## When to write a spec vs. just prompt
Write a spec when a task is **recurring**, **multi-step**, or **needs consistent output**. One-off trivial edits don't need one.
