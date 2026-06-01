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

**Last updated:** 2026-06-01

---

## Summary

Backend is feature-complete at scaffold level. Frontend has marketing pages, auth, the configurator/quote flow, and the admin quote pipeline. Several account and admin management pages are not yet built.

---

## Backend (`apps/api`)

### Working

| Module | What's there |
|---|---|
| Auth | JWT login/register, refresh rotation, logout, forgot/reset password, Google OAuth, GitHub OAuth |
| Users | Profile read/update |
| Products | Full CRUD (admin), paginated catalog, filter, slug lookup, compare, featured, product configurator (`POST /configure`) |
| Orders | Create order, list/get own orders, admin list/status update, cancel |
| Payments | Stripe PaymentIntent, webhook handler (idempotent), lease/financing creation |
| Quotes | Submit request (public, GDPR consent), customer list/detail/accept/reject, full admin pipeline (list, search, edit, convert to order) |
| Admin | Dashboard KPIs, quotes pipeline |
| Email | 5 templates via Resend + BullMQ queue; non-blocking sends |
| GDPR | Consent recording, data export, deletion request |
| Analytics | Service exists; no controller endpoints exposed yet |
| Rate limiting | Global 100 req/60s via Throttler; auth/payment routes have tighter limits |
| Health | `GET /api/health` → `{ status: 'ok' }` |

### Not implemented

- Inventory management API (stock levels, warehouse CRUD, reorder alerts) — module imported, service empty
- Support ticket API (CRUD for tickets and messages) — module imported, no routes
- Notifications API
- Wishlist API
- Coupon/discount validation in checkout
- Audit log query API
- Real Cloudflare R2 integration (`StorageModule` is a stub — needs `@aws-sdk/client-s3`) → see `docs/PLAN.md` Step 20
- Sentry error monitoring → see `docs/PLAN.md` Step 19

---

## Frontend (`apps/web`)

### Working

| Area | Pages / Components |
|---|---|
| Marketing | Home (`/`), About, Services (+ enterprise section), Contact, Docs |
| Robots | `/robots`, `/robots/g1`, `/robots/h1` (marketing pages) |
| Shop | `/products/[slug]` — product detail with gallery, configurator, quote/cart buttons |
| Accessories | `/accessoires` — catalog page |
| Quote flow | `/devis` — full form with product/config pre-fill, GDPR consent |
| Auth | `/compte/connexion`, `/compte/inscription`, forgot/reset password, OAuth callback |
| Account | `/compte` — account dashboard |
| Admin | `/admin` — KPIs dashboard, `/admin/quotes` — quote pipeline |
| Legal | `/mentions-legales`, `/cgv`, `/privacy`, `/cookies` |
| Global | Navbar (dark/light toggle), Footer, Cookie banner, 404 |
| Components | ProductCard, ProductGallery, ProductInfo, ProductActions (configurator), ProductReviews, FeaturedProducts, RelatedProducts, QuoteRequestForm, CheckoutFlow, G1ModelViewer |
| Stores | Auth store (Zustand, in-memory token), Cart store (Zustand) |
| API client | Axios with JWT attach + 401 auto-refresh interceptor |

### Not yet built

| Route | Description | Sprint |
|---|---|---|
| `/checkout` | Stripe PaymentElement checkout page | Sprint 4 |
| `/checkout/success` | Order confirmation | Sprint 4 |
| `/compte/devis` | Customer quote list | Sprint 6 |
| `/compte/devis/[id]` | Customer quote detail + status timeline | Sprint 6 |
| `/compte/commandes` | Customer order history | Sprint 6 |
| `/compte/commandes/[id]` | Order tracking with status steps | Sprint 6 |
| `/compte/parametres` | Profile edit, password change | Sprint 6 |
| `/compte/donnees` | GDPR data export + deletion request | Sprint 6 |
| `/admin/produits` | Product management table | Sprint 5 |
| `/admin/produits/nouveau` | Create product form | Sprint 5 |
| `/admin/produits/[id]` | Edit product form | Sprint 5 |
| `/admin/commandes` | Order list with status filter | Sprint 5 |
| `/admin/commandes/[id]` | Order detail + manual status update | Sprint 5 |

### Polish / gaps

- Loading skeletons on all data-fetching components
- Error boundaries (graceful fallback when API is down)
- Page transitions (Framer Motion configured but not wired to route changes)
- `generateMetadata` on product pages (SEO)
- `sitemap.xml` + `robots.txt`
- Schema.org `Product` markup on product pages
- Mobile audit at 375px not completed for all pages
- Right of withdrawal notice on checkout (French law — 14-day droit de rétractation)

---

## Infrastructure & DevOps

### Working

- Vercel deployment (auto on push to `main`, monorepo config in `vercel.json`)
- Render deployment (Docker, `render.yaml` Blueprint, Frankfurt)
- GitHub Actions CI (`.github/workflows/`)
- Prisma migrations (manual workflow — Supabase shadow DB incompatible with `migrate dev`)
- Multi-stage Dockerfile (Alpine, Node 20, non-root, OpenSSL 3, healthcheck)
- Turborepo build pipeline with caching

### Not set up

- Sentry DSN (both apps) → `docs/PLAN.md` Step 19
- Uptime monitoring
- Plausible Analytics (GDPR-compliant, no cookie required)
- Custom domain (currently on `.vercel.app` and `.onrender.com`) → `docs/PLAN.md` Step 22
- Stripe live keys (test keys in use) → `docs/PLAN.md` Step 21
- Playwright E2E tests → `docs/PLAN.md` Step 18

---

## Third-party integrations

| Service | Status | Notes |
|---|---|---|
| Supabase (DB) | Live | Paris region |
| Stripe | Test mode | Webhook configured |
| Resend | Live | 5 templates |
| BullMQ + Upstash Redis | Live | Email queue |
| Google OAuth | Live | Credentials configured |
| GitHub OAuth | Live | OAuth app configured |
| Cloudflare R2 | Stub | Returns mock URL; needs AWS SDK → Step 20 |

---

## Sprint progress

| Sprint | Goal | Status |
|---|---|---|
| 1 — Foundation | Local E2E running | Done |
| 2 — Product Catalog | Full product experience | Mostly done (missing checkout flow) |
| 3 — Quote Flow | Submit → pipeline → convert | Backend done; customer-facing quote pages missing |
| 4 — Checkout (Accessories) | Buy accessory end-to-end | Backend done; `/checkout` page not built |
| 5 — Admin Management | Catalog/order management in UI | Quotes pipeline done; product/order admin pages missing |
| 6 — Authentication & Account | Full account experience | Login/register done; account sub-pages missing |
| 7 — Polish & Performance | Production-ready UX | Partially done |
| 8 — Pre-launch | E2E tests, Sentry, security | Not started |
| 9 — Launch | Custom domain, live Stripe | Not started |
