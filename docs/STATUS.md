# Unitree Shop — Project Status

> **Location:** `docs/STATUS.md`
> **Related:** [`docs/PLAN.md`](PLAN.md) · [`docs/changelogs/`](changelogs/) · [`docs/SPEC.md`](SPEC.md)

---

## How to keep this file current

When you finish a feature or step:

1. Move items from "Not implemented / Not yet built" → to "Working"
2. Update the sprint table at the bottom
3. Update `Last updated` date at the top
4. Create a changelog entry in `docs/changelogs/YYYY-MM-DD-description.md`

**Last updated:** 2026-06-02 — Sprint 8 done: sitemap.xml, robots.txt, GDPR data page, withdrawal notice on checkout

---

## Summary

Backend is feature-complete at scaffold level. Frontend has marketing pages, auth, the configurator/quote flow, full checkout, customer account pages, and admin management pages. Pre-launch work (tests, Sentry, R2, Stripe live, custom domain) is next.

---

## Backend (`apps/api`)

### Working

| Module        | What's there                                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Auth          | JWT login/register, refresh rotation, logout, forgot/reset password, Google OAuth, GitHub OAuth                                         |
| Users         | Profile read/update, address create/list (`POST /me/addresses`, `GET /me/addresses`)                                                    |
| Products      | Full CRUD (admin), paginated catalog, filter, slug lookup, compare, featured, configurator (`POST /configure`), admin by-ID endpoint    |
| Orders        | Create order, list/get own orders, cancel, admin list (`GET /orders/admin/all`), admin status update (`PATCH /orders/admin/:id/status`) |
| Payments      | Stripe PaymentIntent, webhook handler (idempotent), lease/financing creation                                                            |
| Quotes        | Submit request (public, GDPR consent), customer list/detail/accept/reject, full admin pipeline (list, search, edit, convert to order)   |
| Admin         | Dashboard KPIs, quotes pipeline                                                                                                         |
| Email         | 5 templates via Resend + BullMQ queue; non-blocking sends                                                                               |
| GDPR          | Consent recording, data export, deletion request                                                                                        |
| Analytics     | Service exists; no controller endpoints exposed yet                                                                                     |
| Rate limiting | Global 100 req/60s via Throttler; auth/payment routes have tighter limits                                                               |
| Health        | `GET /api/health` → `{ status: 'ok' }`                                                                                                  |

### Not implemented

- Inventory management API (stock levels, warehouse CRUD, reorder alerts) — module imported, service empty
- Support ticket API — module imported, no routes
- Notifications API
- Wishlist API
- Coupon/discount validation in checkout
- Audit log query API
- Real Cloudflare R2 integration (`StorageModule` is a stub) → see `docs/PLAN.md` Step 20
- Sentry error monitoring → see `docs/PLAN.md` Step 19

---

## Frontend (`apps/web`)

### Working

| Area        | Pages / Components                                                                                                                                                                                                |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Marketing   | Home (`/`), About, Services (+ enterprise section), Contact, Docs                                                                                                                                                 |
| Robots      | `/robots`, `/robots/g1`, `/robots/h1` (marketing pages)                                                                                                                                                           |
| Shop        | `/products/[slug]` — product detail with gallery, configurator, quote/cart buttons                                                                                                                                |
| Accessories | `/accessoires` — catalog page with Add to Cart on each card                                                                                                                                                       |
| Quote flow  | `/devis` — full form with product/config pre-fill, GDPR consent                                                                                                                                                   |
| Checkout    | `/checkout` — 4-step flow (contact → address → recap → Stripe payment), `/checkout/success`                                                                                                                       |
| Auth        | `/compte/connexion`, `/compte/inscription`, forgot/reset password, OAuth callback (with post-login redirect)                                                                                                      |
| Account     | `/compte` dashboard, `/compte/commandes`, `/compte/commandes/[id]`, `/compte/devis`, `/compte/devis/[id]`, `/compte/parametres`                                                                                   |
| Admin       | `/admin` KPIs, `/admin/quotes` pipeline, `/admin/commandes`, `/admin/commandes/[id]`, `/admin/produits`, `/admin/produits/nouveau`, `/admin/produits/[id]`                                                        |
| Legal       | `/mentions-legales`, `/cgv`, `/privacy`, `/cookies`                                                                                                                                                               |
| Global      | Navbar (dark/light toggle, cart badge), Footer, Cookie banner, 404                                                                                                                                                |
| Components  | ProductCard (with cart button), ProductGallery, ProductInfo, ProductActions (configurator), ProductReviews, FeaturedProducts, RelatedProducts, QuoteRequestForm, CheckoutFlow, G1ModelViewer, ProductForm (admin) |
| Stores      | Auth store (Zustand, in-memory token), Cart store (Zustand)                                                                                                                                                       |
| API client  | Axios with JWT attach + 401 auto-refresh interceptor                                                                                                                                                              |

### Not yet built

| Route              | Description         | Priority |
| ------------------ | ------------------- | -------- |
| `/admin/analytics` | Analytics dashboard | Low      |
| `/admin/clients`   | Customer list       | Low      |

### Polish / gaps

- Loading skeletons on data-fetching components
- Error boundaries (graceful fallback when API is down)
- Schema.org `Product` markup on product pages
- Mobile audit at 375px not done for all pages

---

## Infrastructure & DevOps

### Working

- Vercel deployment (auto on push to `main`, monorepo config in `vercel.json`)
- Render deployment (Docker, `render.yaml` Blueprint, Frankfurt, auto-deploy via GitHub)
- GitHub Actions CI — lint, typecheck, test (deploy steps are no-ops, both services auto-deploy)
- Prisma migrations (manual workflow — Supabase shadow DB incompatible with `migrate dev`)
- Multi-stage Dockerfile (Alpine, Node 20, non-root, OpenSSL 3, healthcheck)
- Turborepo build pipeline with caching

### Not set up

- Sentry DSN (both apps) → `docs/PLAN.md` Step 19
- Uptime monitoring (recommended: UptimeRobot free tier pinging `/api/health` every 5 min to prevent Render cold starts)
- Custom domain → `docs/PLAN.md` Step 22
- Stripe live keys (test keys in use) → `docs/PLAN.md` Step 21
- Playwright E2E tests → `docs/PLAN.md` Step 18
- `docker-compose.yml` for local Postgres + Redis → `docs/PLAN.md` Step 13

---

## Third-party integrations

| Service                | Status    | Notes                                         |
| ---------------------- | --------- | --------------------------------------------- |
| Supabase (DB)          | Live      | Paris region                                  |
| Stripe                 | Test mode | Webhook configured, live keys not yet applied |
| Resend                 | Live      | 5 templates                                   |
| BullMQ + Upstash Redis | Live      | Email queue                                   |
| Google OAuth           | Live      | Credentials configured                        |
| GitHub OAuth           | Live      | OAuth app configured                          |
| Cloudflare R2          | Stub      | Returns mock URL; needs AWS SDK → Step 20     |

---

## Sprint progress

| Sprint                       | Goal                            | Status      |
| ---------------------------- | ------------------------------- | ----------- |
| 1 — Foundation               | Local E2E running               | Done        |
| 2 — Product Catalog          | Full product experience         | Done        |
| 3 — Quote Flow               | Submit → pipeline → convert     | Done        |
| 4 — Checkout (Accessories)   | Buy accessory end-to-end        | Done        |
| 5 — Admin Management         | Catalog/order management in UI  | Done        |
| 6 — Authentication & Account | Full account experience         | Done        |
| 7 — Admin Quote Pipeline     | Quote detail + convert to order | Done        |
| 8 — Legal & SEO              | sitemap, GDPR, withdrawal       | Done        |
| 9 — Polish & Performance     | Skeletons, error boundaries     | Not started |
| 10 — Pre-launch              | R2 storage, Stripe live         | Not started |
| 11 — Launch                  | Custom domain, monitoring       | Not started |
