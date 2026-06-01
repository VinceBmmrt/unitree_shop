# Unitree Shop — Improvement Plan

> **Location:** `docs/PLAN.md`
> **Related:** [`docs/STATUS.md`](STATUS.md) · [`docs/changelogs/`](changelogs/)

---

## How to use this document

Each step is self-contained and can be done in isolation. When you **complete a step**:

1. Check it off here: change `[ ]` → `[x]`
2. Update `docs/STATUS.md` — move items from "not implemented" to "working"
3. Create `docs/changelogs/YYYY-MM-DD-step-N-name.md` with what changed and why
4. Update `docs/SPEC.md` if the API surface or data model changed
5. Update `CLAUDE.md` if a convention or rule changed

---

## Phase 1 — Bug Fixes (< 30 min total)

- [ ] **Step 1** — Fix broken `db:studio` script
  - **File:** `package.json` (root), line 15
  - **Problem:** `cd packages/database` — that directory does not exist.
  - **Fix:** Change to `pnpm --filter @unitree/api exec prisma studio`

- [ ] **Step 2** — Fix Turbo global dependency watching
  - **File:** `turbo.json`
  - **Problem:** `globalDependencies: [".env"]` — API loads `.env.local` first; Turbo never invalidates cache when `.env.local` changes.
  - **Fix:** Change to `[".env", ".env.local"]`

- [ ] **Step 3** — Remove dead Express middleware from the API
  - **File:** `apps/api/package.json`
  - **Problem:** `compression` and `helmet` are Express-only; `@fastify/compress` and `@fastify/helmet` already cover both.
  - **Fix:** `pnpm --filter @unitree/api remove compression helmet @types/compression`

- [ ] **Step 4** — Remove unused WebSocket packages from the API
  - **File:** `apps/api/package.json`
  - **Problem:** `@nestjs/websockets` and `@nestjs/platform-socket.io` — no WebSocket module exists, V2 item.
  - **Fix:** `pnpm --filter @unitree/api remove @nestjs/websockets @nestjs/platform-socket.io`

- [ ] **Step 5** — Remove `next-auth` from the frontend
  - **File:** `apps/web/package.json`
  - **Problem:** `next-auth` (~220 KB) installed but the project uses its own JWT auth. Completely unused.
  - **Fix:** `pnpm --filter @unitree/web remove next-auth`

- [ ] **Step 6** — Move React Query devtools to devDependencies
  - **File:** `apps/web/package.json`
  - **Problem:** `@tanstack/react-query-devtools` is in `dependencies` — ships to production.
  - **Fix:** Move it to `devDependencies`.

---

## Phase 2 — Developer Experience (2–3 hours total)

- [ ] **Step 7** — Add `.prettierrc` and wire the format script
  - **Problem:** `prettier` is installed at root but no config file, no `format` script. Style drifts silently.
  - **Files:** Create `.prettierrc`, add `format` and `format:check` to root `package.json` scripts.
  - **`.prettierrc`:**
    ```json
    { "semi": true, "singleQuote": true, "trailingComma": "all", "printWidth": 100, "tabWidth": 2 }
    ```

- [ ] **Step 8** — Add shared ESLint config package
  - **Problem:** Each app configures ESLint independently; rules drift.
  - **Steps:**
    1. Create `packages/config-eslint/index.js` with a shared base config
    2. Add `"@unitree/config-eslint": "workspace:*"` to both apps' devDependencies
    3. Point each app's `.eslintrc.js` to `extends: ['@unitree/config-eslint']`

- [ ] **Step 9** — Add pre-commit hooks (husky + lint-staged)
  - **Problem:** TypeScript errors only surface in CI. Catches issues too late.
  - **Steps:**
    1. `pnpm add -wD husky lint-staged`
    2. `npx husky init`
    3. Set `.husky/pre-commit` to run `npx lint-staged`
    4. Add to root `package.json`:
       ```json
       "lint-staged": {
         "apps/web/**/*.{ts,tsx}": ["eslint --fix", "prettier --write"],
         "apps/api/src/**/*.ts": ["eslint --fix", "prettier --write"]
       }
       ```

- [ ] **Step 10** — Add Zod env validation to the frontend
  - **Problem:** `apps/api` validates env vars at startup; `apps/web` has none — wrong `NEXT_PUBLIC_API_URL` gives cryptic Axios errors.
  - **File to create:** `apps/web/lib/env.ts`
    ```ts
    import { z } from 'zod';
    const schema = z.object({ NEXT_PUBLIC_API_URL: z.string().url() });
    export const env = schema.parse({ NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL });
    ```
  - Replace all `process.env.NEXT_PUBLIC_API_URL` usages with `env.NEXT_PUBLIC_API_URL`.

- [ ] **Step 11** — Improve `scripts/run.ps1` and `scripts/run.sh`
  - **Problem:** Both scripts are ~5 lines. Don't help a new dev onboard.
  - **Add:**
    1. Detect missing `.env.local` → print warning with instructions
    2. Detect missing `node_modules` → suggest `pnpm setup`
    3. Print service URLs once dev server starts (`:3000`, `:3001/api/v1`, `:3001/api/docs`)

- [ ] **Step 12** — Add missing root-level scripts
  - **File:** `package.json` (root)
  - **Add/fix:**
    ```json
    "db:seed":   "pnpm --filter @unitree/api db:seed",
    "db:studio": "pnpm --filter @unitree/api exec prisma studio",
    "check":     "turbo run typecheck lint",
    "format":    "prettier --write \"**/*.{ts,tsx,json,md}\""
    ```

---

## Phase 3 — Local Infrastructure (30 min)

- [ ] **Step 13** — Add `docker-compose.yml` for local dependencies
  - **Problem:** Local dev requires Supabase + Upstash accounts. New devs can't onboard without cloud credentials.
  - **File to create:** `docker-compose.yml` at repo root
    ```yaml
    version: '3.9'
    services:
      postgres:
        image: postgres:16-alpine
        environment: { POSTGRES_DB: unitree, POSTGRES_USER: postgres, POSTGRES_PASSWORD: dev }
        ports: ["5432:5432"]
        volumes: [postgres_data:/var/lib/postgresql/data]
      redis:
        image: redis:7-alpine
        ports: ["6379:6379"]
    volumes:
      postgres_data:
    ```
  - Update `.env.example`:
    ```
    DATABASE_URL=postgresql://postgres:dev@localhost:5432/unitree
    DIRECT_DATABASE_URL=postgresql://postgres:dev@localhost:5432/unitree
    REDIS_HOST=localhost
    REDIS_PORT=6379
    ```
  - Add root scripts: `infra:up`, `infra:down`, `infra:reset`

---

## Phase 4 — Shared Packages (2–4 hours)

- [ ] **Step 14** — Create `packages/ui` for shared UI components
  - **Problem:** UI primitives (Button, Input, Card, Badge, Spinner) will be duplicated when admin pages are built.
  - **Steps:**
    1. Create `packages/ui/` with `package.json` (`@unitree/ui`), `tsconfig.json`, `tsup.config.ts`
    2. Move primitives from `apps/web/components/ui/` into the package
    3. Add `"@unitree/ui": "workspace:*"` to `apps/web/dependencies`
    4. Update all imports in `apps/web`
    5. Add to `turbo.json` build pipeline

- [ ] **Step 15** — Add Zod schemas to `packages/types`
  - **Problem:** `packages/types` exports TypeScript interfaces only. Form validation and API DTOs duplicate logic.
  - **Steps:**
    1. Add Zod to `packages/types`
    2. Add `z.object(...)` schema alongside each exported interface
    3. Export schemas from `packages/types/src/index.ts`
    4. Replace React Hook Form manual validation with shared Zod schemas
    5. Optionally replace `class-validator` DTOs in `apps/api` with `ZodPipe`

---

## Phase 5 — Testing Infrastructure (3–5 hours)

- [ ] **Step 16** — Add Vitest for `apps/web`
  - **Problem:** No unit tests. Jest is slow for Next.js.
  - **Steps:**
    1. `pnpm --filter @unitree/web add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`
    2. Create `apps/web/vitest.config.ts`
    3. Add `"test": "vitest run"` to `apps/web/package.json`
    4. First tests: `auth.store.ts`, `cart.store.ts`, `lib/utils.ts`

- [ ] **Step 17** — Wire Jest for `apps/api` unit tests
  - **Problem:** `@nestjs/testing` installed but zero tests written. Core services have no coverage.
  - **Steps:**
    1. Create `apps/api/src/modules/quotes/quotes.service.spec.ts`
    2. Use `Test.createTestingModule` with mocked `PrismaService`
    3. Test: GDPR consent required, convertToOrder rejects non-ACCEPTED, acceptQuote rejects expired
    4. Repeat for `OrdersService` (price re-validation, inventory check)

- [ ] **Step 18** — Add Playwright for E2E tests
  - **Problem:** No E2E tests — core flows break silently.
  - **Steps:**
    1. `pnpm add -wD @playwright/test`
    2. Create `playwright.config.ts` at repo root (target `http://localhost:3000`)
    3. Create `tests/e2e/` directory
    4. Write: `quote-flow.spec.ts`, `auth.spec.ts`, `product-page.spec.ts`
    5. Add `"test:e2e": "playwright test"` to root `package.json`
    6. Add E2E step to GitHub Actions CI

---

## Phase 6 — Production Readiness

- [ ] **Step 19** — Add Sentry to both apps
  - **Problem:** No error monitoring. Production errors are invisible.
  - **Steps:**
    1. `pnpm --filter @unitree/web add @sentry/nextjs` + run wizard
    2. `pnpm --filter @unitree/api add @sentry/nestjs @sentry/profiling-node`
    3. Add `SentryModule.forRoot()` in `apps/api/src/app.module.ts`
    4. Add `SENTRY_DSN` to env validation in both apps and to `render.yaml`

- [ ] **Step 20** — Activate Cloudflare R2 in `StorageModule`
  - **Problem:** `StorageModule` returns a mock URL; admin image upload doesn't work.
  - **Steps:**
    1. `pnpm --filter @unitree/api add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
    2. Replace stub in `apps/api/src/modules/storage/storage.service.ts` with real `getSignedUrl`
    3. Add R2 env vars to `env.validation.ts` and `render.yaml`
    4. Add R2 public domain to `apps/web/next.config.mjs` `images.remotePatterns`

- [ ] **Step 21** — Switch Stripe to live mode
  - **Pre-requisites:** Steps 16–18 done, Step 19 done.
  - **Steps:**
    1. Replace `STRIPE_SECRET_KEY` with live key in Render secrets
    2. Replace `STRIPE_WEBHOOK_SECRET` with live secret from Stripe dashboard
    3. Register live webhook: `https://unitree-shop-api.onrender.com/api/v1/payments/webhook`
    4. Subscribe: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
    5. Send a real €1 test transaction before opening to customers

- [ ] **Step 22** — Set up custom domain
  - **Steps:**
    1. Point domain A-record to Vercel, add in dashboard (SSL auto-provisioned)
    2. Point `api.<domain>` CNAME to Render service URL
    3. Update env vars: `FRONTEND_URL`, `API_URL` on Render; `NEXT_PUBLIC_API_URL` on Vercel
    4. Update Google + GitHub OAuth apps with new callback URLs

---

## Execution order

| Phase | When to do it |
|---|---|
| 1 — Bug fixes | Immediately, ~30 min |
| 2 — DX | Before next feature, ~3h |
| 3 — Docker Compose | Alongside Phase 2, ~30 min |
| 4 — Shared packages | When starting admin pages |
| 5 — Testing | Before pre-launch sprint |
| 6 — Production | Launch sprint |
