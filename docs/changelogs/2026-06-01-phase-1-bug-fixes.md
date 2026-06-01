# 2026-06-01 — Phase 1 bug fixes

**Branch:** `fix/phase-1-cleanup`
**Plan steps completed:** 1, 2, 3, 4, 5, 6, 12

---

## Changes

### `package.json` (root)
- Fixed `db:studio` — was pointing to `packages/database` (non-existent); now `pnpm --filter @unitree/api exec prisma studio`
- Added `db:seed` script: `pnpm --filter @unitree/api db:seed`
- Added `check` script: `turbo run typecheck lint`
- Added `format` script: `prettier --write` across all ts/tsx/json/md

### `turbo.json`
- Fixed `globalDependencies` — added `.env.local` so Turbo invalidates cache when local env changes

### `apps/api` — removed dead packages
- `compression` — Express-only middleware, silently does nothing with Fastify (already covered by `@fastify/compress`)
- `helmet` — same issue (covered by `@fastify/helmet`)
- `@types/compression` — type stubs for the removed package
- `@nestjs/websockets` — WebSocket module not wired anywhere (V2 backlog item)
- `@nestjs/platform-socket.io` — same

### `apps/web` — removed dead packages + fixed bundle
- `next-auth` (~220 KB) — project uses its own JWT auth; `next-auth` was completely unused
- `@tanstack/react-query-devtools` — moved from `dependencies` → `devDependencies` (was shipping to production)
- `@tanstack/react-query` — bumped to `5.100.14` to match devtools peer requirement

---

## Verification

- `pnpm --filter @unitree/api typecheck` — passed, no errors
- `pnpm --filter @unitree/web typecheck` — passed, no errors

---

## Next step

Phase 2 (DX): Step 7 — add `.prettierrc` and format script, then Step 9 — husky + lint-staged.
Or skip to Sprint 4 feature work: `/checkout` page (Stripe PaymentElement).
