# Unitree Shop — CLAUDE.md

French-market robotics e-commerce platform. Sells Unitree humanoid robots (G1, H1) and accessories. Robots go through a **quote flow** (not direct purchase); accessories use standard **cart → Stripe checkout**.

---

## Monorepo Structure

```
apps/web    — Next.js 14 App Router  → deployed on Vercel
apps/api    — NestJS + Fastify        → deployed on Fly.io (cdg, Paris)
packages/   — shared types, utils
```

**Run everything:** `pnpm dev` at repo root (Turborepo runs both in parallel)

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
| Storage | Cloudflare R2 (product images) |

---

## Frontend conventions

### Dark/light theme
- `defaultTheme="dark"` in providers, toggle in navbar
- **Always use `dark:` Tailwind variants** — never hardcode dark colors without a light fallback
- Pattern: `bg-white dark:bg-[#04040a]`, `text-slate-900 dark:text-white`, `border-slate-200 dark:border-white/8`
- Design palette: dark bg `#04040a`, card bg `#06060f`, accent `blue-600`

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

### Components
- `components/layout/` — Navbar, Footer, HeroSection, providers
- `components/product/` — ProductCard, QuoteRequestForm, ProductGallery
- `components/3d/` — G1ModelViewer (Sketchfab iframe embed)
- No comment blocks. Name functions clearly; skip obvious comments.

---

## API conventions (NestJS)

- All responses wrapped: `{ success, data, message }`
- TVA 20% applied in `orders` module, stored in DB
- Stripe webhook at `POST /api/v1/payments/webhook` — verify signature, idempotent
- Admin endpoints decorated with `@Roles(Role.ADMIN)` guard
- Quotes: `PENDING → REVIEWING → SENT → ACCEPTED → CONVERTED` (no skipping states)

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
- **Don't skip GDPR consent** on any form that collects personal data — `consentGdpr: true` required
- **Don't import Three.js in server components** — wrap with `'use client'` or use an iframe embed
- **Don't add error handling for impossible cases** — trust Prisma/NestJS validations at boundaries
- **Don't add features outside the task** — a quote form fix doesn't need refactoring the cart

---

## Legal (France — required)

Pages that must stay complete and accurate:
- `/mentions-legales` — publisher identity, host info
- `/cgv` — conditions générales de vente
- `/privacy` — politique de confidentialité (RGPD)
- `/cookies` — cookie policy + banner consent

---

## Environment variables (see ROADMAP.md for full list)

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
