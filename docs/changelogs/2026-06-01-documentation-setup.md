# 2026-06-01 — Documentation setup

## What was done

Full project documentation written from a codebase audit and reorganised into `docs/`.

## Files created

| File | Contents |
|---|---|
| `docs/AGENT.md` | AI agent navigation guide — file map, critical invariants, common patterns, gotchas |
| `docs/SPEC.md` | Full technical specification — 32 DB models, complete API surface, all frontend routes, business flow diagrams, security model |
| `docs/STATUS.md` | Current build state — module-by-module backend status, built vs not-yet-built frontend pages, sprint progress, integration status |
| `docs/PLAN.md` | 22 improvement steps across 6 phases with checkboxes and workflow instructions |
| `docs/ROADMAP.md` | Replaced original sprint checklist with a lean forward-looking doc: remaining features, V2 backlog, env checklist |
| `docs/changelogs/` | This folder — one dated file per completed step going forward |

## Files moved from root → `docs/`

- `AGENT.md` → `docs/AGENT.md`
- `SPEC.md` → `docs/SPEC.md`
- `STATUS.md` → `docs/STATUS.md`
- `PLAN.md` → `docs/PLAN.md`
- `ROADMAP.md` → `docs/ROADMAP.md`
- `GEMINI.md` → `docs/GEMINI.md`

Root keeps only: `README.md`, `CLAUDE.md`.

## Files updated

| File | Change |
|---|---|
| `CLAUDE.md` | Added `## Documentation` section — points to `docs/`, explains changelog workflow |
| `docs/ROADMAP.md` | Stripped redundant sprint checklists (now in STATUS.md + PLAN.md); kept V2 backlog and env checklist |
| `docs/STATUS.md` | Added "How to keep this file current" instructions; updated sprint table references |
| `docs/PLAN.md` | Added "How to use this document" workflow header with 5-step update instructions |

## Bug documented (not yet fixed)

`CLAUDE.md` correction: QuoteStatus enum in the actual Prisma schema is `DRAFT → SENT → VIEWED → NEGOTIATING → ACCEPTED → REJECTED/EXPIRED → CONVERTED` — the old CLAUDE.md had a wrong state sequence.

## Next step

Start Phase 1 of `docs/PLAN.md` — fix the 6 bugs (broken `db:studio`, Turbo deps, dead packages). ~30 min.
