# Unitree Shop — CLAUDE.md

French-market robotics e-commerce platform. Sells Unitree humanoid robots (G1, H1) and accessories. Robots go through a **quote flow** (not direct purchase); accessories use standard **cart → Stripe checkout**.

---

## Monorepo Structure

```
apps/web         — Next.js 14 App Router  → deployed on Vercel
apps/api         — NestJS + Fastify        → deployed on Fly.io (cdg, Paris)
packages/types   — shared TypeScript types (@unitree/types)
```

**Run everything:** `pnpm dev` at repo root (Turborepo runs both in parallel)
**First-time setup:** `pnpm setup` (installs deps + generates Prisma client + runs migrations)

- Frontend: `http://localhost:3000`
- API + Swagger: `http://localhost:3001/api/docs`

---

## Key Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 App Router, Tailwind CSS, Framer Motion |
| Backend | NestJS, Fastify, Prisma ORM |
| Database | PostgreSQL via Supabase |
| Auth | JWT (access token in memory, refresh in httpOnly cookie) |
| Payments | Stripe (PaymentIntent + webhook) |
| Email | Resend + BullMQ queue |
| Cache | Redis via Upstash |
| Storage | Cloudflare R2 (product images) — admin presigned upload via `StorageModule` |

---

## Shared Types — `@unitree/types`

The `packages/types` workspace package is the single source of truth for all shared types. Both `apps/api` and `apps/web` import from it as `@unitree/types`.

**What's exported:**
- `Product`, `ProductImage`, `ProductOption`, `ProductConfigChoice`, `Review` — product domain
- `CartItem`, `CartState` — cart store
- `JwtPayload`, `User`, `AuthResponse` — auth

**Rules:**
- **Never re-declare a type locally** if it already exists in `@unitree/types`
- Add types there when they are needed by both apps, or to replace a local duplicate
- After editing `packages/types/src/`, run `pnpm --filter @unitree/types build` (or `pnpm dev` runs `tsc --watch` automatically)
- `packages/types/dist/` is gitignored — it is built via the `prepare` script on `pnpm install`

---

## Frontend conventions

### Dark/light theme
- `defaultTheme="dark"` in providers, toggle in navbar
- **Always use `dark:` Tailwind variants** — never hardcode dark colors without a light fallback
- Pattern: `bg-white dark:bg-[#04040a]`, `text-slate-900 dark:text-white`, `border-slate-200 dark:border-white/8`
- Design palette: dark bg `#04040a`, card bg `#06060f`, accent `blue-600`
- CSS variables in `globals.css` use HSL matching these hex values (blue-tinted, not neutral gray) — dark bg is `240 43% 2.7%`, card is `240 40% 4.1%`

### Auth token
- Access token lives in **`window.__unitreeAccessToken`** (memory only — not localStorage, not sessionStorage)
- Refresh token is in an **httpOnly cookie** — used automatically by `/auth/refresh`
- On 401: the `apiClient` interceptor in `lib/api/client.ts` auto-refreshes; on failure it redirects to **`/compte/connexion`** (NOT `/login` — that route does not exist)
- Login page: `/compte/connexion` | Register: `/compte/inscription`

### Data fetching
- Server components + ISR: `export const revalidate = 300` for catalog pages
- API calls in server components go through `lib/api/client.ts` (axios)
- `apiClient` handles JWT refresh automatically on 401 (client-side only)
- Always `try/catch` API calls and return `[]` on failure — pages must render without data

### Route groups
```
app/(marketing)/    — public landing pages (robots, about, services…)
app/(shop)/         — product pages, cart, checkout
app/(account)/      — /compte/** (auth required, client-side guard)
app/(admin)/        — /admin/** (ADMIN role required)
app/devis/          — quote request form
```

### Pages — fused / redirected
- `/enterprise` → **redirects to `/services#enterprise`** — enterprise content lives in the services page

### Components
- `components/layout/` — Navbar, Footer, HeroSection, providers
- `components/product/` — ProductCard (takes `product: Product`), ProductActions, QuoteRequestForm, ProductGallery
- `components/3d/` — G1ModelViewer (Sketchfab iframe embed)
- `ProductActions` — client component that owns configurator state, saves config to API, then redirects to `/devis?product=…&config=…`
- No comment blocks. Name functions clearly; skip obvious comments.

---

## Configure → Quote flow

When a user configures a robot and requests a quote:
1. `ProductActions` (client) holds `selections` state and calls `POST /products/:id/configure` (public endpoint, no auth required)
2. API saves a `Configuration` record (`userId` optional — works for guests) and returns its `id`
3. Frontend redirects to `/devis?product=<productId>&config=<configId>`
4. `DevisPage` passes both IDs to `QuoteRequestForm` as pre-selected values
5. `QuotesService.create` looks up the `Configuration.totalPrice` and uses it as `unitPrice` in the `QuoteItem`
6. On `convertToOrder`, the `configurationId` is carried forward to the `OrderItem`

---

## API conventions (NestJS)

- All responses wrapped: `{ success, data, message }`
- TVA 20%: **always use `TAX_RATE` / `TAX_LABEL`** from `src/common/constants/tax.constants.ts` — never hardcode `0.20` or `'TVA 20%'`
- Stripe webhook at `POST /api/v1/payments/webhook` — verify signature, idempotent
- Admin endpoints decorated with `@Roles(Role.ADMIN)` guard
- Quotes: `PENDING → REVIEWING → SENT → ACCEPTED → CONVERTED` (no skipping states)
- `convertToOrder` uses **`Prisma.TransactionIsolationLevel.Serializable`** with a 15s timeout — prevents double-reservation races
- Inventory reservation: always find a **single warehouse** with `quantityOnHand - quantityReserved >= quantity` before reserving — never spread across multiple warehouses

### StorageModule
- Located at `src/modules/storage/`
- Admin-only endpoint: `POST /api/v1/admin/storage/upload-url` — returns a presigned R2 URL
- The service is currently a **stub** (returns mock URL, logs a warning). To activate: install `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` and implement `getSignedUrl`

---

## Prisma migrations — Supabase workaround

Supabase's shadow database lacks the `auth` schema, so `prisma migrate dev` fails. Workflow:

```bash
# 1. Write migration SQL manually in apps/api/prisma/migrations/<timestamp>_<name>/migration.sql
# 2. Apply it directly
npx prisma db execute --file prisma/migrations/<folder>/migration.sql --schema prisma/schema.prisma
# 3. Mark it as applied in migration history
npx prisma migrate resolve --applied <folder_name>
```

Never run `prisma migrate dev` against the Supabase DB — it will always fail on the shadow DB step.

---

## Success criteria

A feature is done when:
1. It works in **both dark and light mode** without white-on-white or invisible text
2. The page renders without crashing when the API is down (graceful empty state)
3. Mobile layout is not broken at 375px
4. No TypeScript errors (`pnpm tsc --noEmit`)
5. For quote/order flows: the confirmation email is sent via BullMQ (check Resend dashboard)

---

## Things to avoid

- **Don't hardcode dark colors** without `dark:` counterpart — this breaks light mode
- **Don't use `localStorage` for auth tokens** — use `window.__unitreeAccessToken` (memory) to avoid XSS
- **Don't redirect to `/login`** — that route doesn't exist; use `/compte/connexion`
- **Don't skip GDPR consent** on any form that collects personal data — `consentGdpr: true` required
- **Don't import Three.js in server components** — wrap with `'use client'` or use an iframe embed
- **Don't add error handling for impossible cases** — trust Prisma/NestJS validations at boundaries
- **Don't add features outside the task** — a quote form fix doesn't need refactoring the cart
- **Don't hardcode `0.20` or `'TVA 20%'`** — import from `tax.constants.ts`
- **Don't re-declare types** that already exist in `@unitree/types`
- **Don't run `prisma migrate dev`** — use the manual migration workflow above

---

## Legal (France — required)

Pages that must stay complete and accurate:
- `/mentions-legales` — publisher identity, host info
- `/cgv` — conditions générales de vente
- `/privacy` — politique de confidentialité (RGPD)
- `/cookies` — cookie policy + banner consent

---

## Environment variables

Minimum to run locally:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
REDIS_HOST=...
```

## Image hostnames

External image domains must be allowlisted in `apps/web/next.config.mjs` under `images.remotePatterns`. Currently allowed:
- `shop.unitree.com`, `oss-global-cdn.unitree.com`, `www.unitree.com`, `assets.unitreerobotics.com`
- `www.realsenseai.com`
- `*.supabase.co`, `images.unsplash.com`, `plus.unsplash.com`

When adding a new external image source in the seed or anywhere else, add its hostname here first or the `next/image` component will throw at runtime.

---

## Environment variables

Minimum to run locally:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
REDIS_HOST=...
```

For R2 storage (StorageModule — currently stub):
```
R2_ACCOUNT_ID=...
R2_BUCKET_NAME=...
R2_PUBLIC_DOMAIN=https://...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
```

---

## Screenshots

All Playwright screenshots must be saved to `screenshots/` at the repo root (already in `.gitignore`).
Use relative paths from the Playwright working directory: `filename: "screenshots/<name>.png"`.
Never save `.png` files to the repo root or any `apps/` subdirectory.
