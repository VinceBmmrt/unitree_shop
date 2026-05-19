# Unitree Shop

> **Demo project** — A full-stack e-commerce platform for [Unitree Robotics](https://www.unitree.com) products, built as a showcase of a modern robotics retail experience for the French market.

**[→ Live demo on Vercel](https://unitree-shop-web.vercel.app)**

---

## What it is

A production-grade online shop simulating the sale of Unitree humanoid robots (G1, H1) and accessories. Robots follow a **quote request flow** (configure → request → receive offer) while accessories use a standard **cart → Stripe checkout** path.

The project covers the full stack: storefront, authentication, product catalog, configurator, quote pipeline, orders, payments, and an admin panel — all wired to real third-party services.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 App Router, Tailwind CSS, Framer Motion |
| Backend | NestJS, Fastify, Prisma ORM |
| Database | PostgreSQL via Supabase |
| Auth | JWT access token (in-memory) + httpOnly refresh cookie, Google & GitHub OAuth |
| Payments | Stripe (PaymentIntent, invoices, lease schedules) |
| Email | Resend + BullMQ async queue |
| Cache | Redis via Upstash |
| Storage | Cloudflare R2 (product images, presigned upload) |
| Deploy | Frontend → Vercel · API → Render (Docker, Frankfurt) |

---

## Monorepo layout

```
apps/
  web/          Next.js frontend
  api/          NestJS + Fastify backend
packages/
  types/        Shared TypeScript types (@unitree/types)
```

## Local setup

**Prerequisites:** Node 20+, pnpm 9+, Docker (optional)

```bash
# Install dependencies, generate Prisma client, apply migrations
pnpm setup

# Start both apps in parallel (Turborepo)
pnpm dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001/api/v1 |
| Swagger | http://localhost:3001/api/docs |

Copy `.env.example` files and fill in your own keys before running.

---

## Key flows

### Robot configurator → Quote
1. User picks a robot and selects options (`ProductActions` client component)
2. `POST /products/:id/configure` saves a `Configuration` record (guest-friendly, no auth required)
3. Frontend redirects to `/devis?product=…&config=…`
4. Sales team reviews and sends a formal quote
5. Customer accepts → admin converts to order via `convertToOrder`

### Accessory checkout
1. Cart persisted in Zustand + localStorage
2. `POST /orders` creates the order (backend re-validates all prices from DB)
3. `POST /payments/orders/:id/intent` creates a Stripe `PaymentIntent`
4. Stripe webhook confirms payment → order moves to `CONFIRMED`

---

## Environment variables

Minimum set to run locally — see `.env.example` in each app for the full list.

```
# apps/web
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# apps/api
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
REDIS_HOST=...
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

---

## Deployment

- **Frontend** → Vercel (auto-deploy on push to `main`)
- **API** → Render via Docker (`render.yaml` Blueprint at repo root)

The `vercel.json` at repo root configures the monorepo build. `API_URL` on Render must be set to the Render service URL **without** `/api/v1`.

---

## Legal pages (French market)

`/mentions-legales` · `/cgv` · `/privacy` · `/cookies` — required by French law, must stay accurate.
