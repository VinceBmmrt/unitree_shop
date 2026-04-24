# Unitree Shop — MVP Roadmap
# France-first · 8–12 weeks · 1 dev + 1 engineer

## What the scaffold already delivers
- Full database schema (Prisma) — 30 models including GDPR consent
- Auth system (JWT rotate-refresh + Google/GitHub OAuth)
- Products module (catalog, filter, 3D config builder)
- Orders module (cart→order, TVA 20%, serializable transaction)
- Payments module (Stripe card, NET30/60 invoice, webhook handler)
- Quotes module — full pipeline (submit, negotiate, send, accept, convert→order)
- Email module (Resend + BullMQ — 5 templates)
- GDPR module (consent recording, data export, erasure request)
- Admin dashboard (KPIs, revenue chart, quotes pipeline, stock alerts)
- Frontend: Navbar, HeroSection, Footer, ProductCard, CartDrawer, QuoteRequestForm, CookieBanner
- CI/CD: GitHub Actions → Fly.io (cdg) + Vercel
- Docker: multi-stage, non-root, healthcheck

---

## Sprint Plan

### SPRINT 1 — Foundation (Week 1-2)
**Goal: Everything runs locally end-to-end**

Backend:
- [ ] Run `pnpm install` across the monorepo
- [ ] `prisma generate && prisma migrate dev --name init`
- [ ] Copy `.env.example` → `.env.local`, fill Stripe test keys + DB URL
- [ ] `pnpm dev` — verify Swagger at localhost:3001/api/docs
- [ ] Register first admin user, verify JWT flow in Swagger

Frontend:
- [ ] `pnpm dev` — verify homepage loads
- [ ] Verify cookie banner appears and records consent
- [ ] Test quote form submission → email arrives in Resend dashboard

Infra:
- [ ] Create Supabase project (Paris region: `eu-west-2`)
- [ ] Create Fly.io app `unitree-shop-api` with secrets from .env
- [ ] Create Upstash Redis (EU Frankfurt region)
- [ ] First deploy: `fly deploy`

---

### SPRINT 2 — Product Catalog (Week 2-3)
**Goal: Full product experience live**

Backend:
- [ ] Seed database: 3-5 robot products (requiresQuote: true) + 10-15 accessories
- [ ] Add warehouse + seed inventory records
- [ ] Verify `GET /api/v1/products` returns paginated, filterable results

Frontend:
- [ ] Build `/robots` page (server component, ISR 5min, ProductCard grid)
- [ ] Build `/accessoires` page (same pattern with category filter)
- [ ] Complete `ProductInfo` component (name, price TTC, specs table)
- [ ] Complete `ProductGallery` component (image swiper, zoom)
- [ ] Complete `AddToCartButton` component
- [ ] Complete `QuoteRequestButton` (links to /devis with product pre-selected)
- [ ] Test full flow: browse → product page → add to cart → cart drawer

---

### SPRINT 3 — Quote Flow (Week 3-4)
**Goal: A customer can submit a quote and sales team receives it**

Backend:
- [ ] Test `POST /api/v1/quotes/request` with all fields
- [ ] Verify both customer + team emails are sent via Resend
- [ ] Test admin `PATCH /api/v1/quotes/:id` status transitions
- [ ] Test `POST /api/v1/quotes/:id/convert` → order created

Frontend:
- [ ] Test `/devis` page with all robot products visible
- [ ] Verify form validation (GDPR consent required, phone required)
- [ ] Build `/compte/devis` — customer quote list page
- [ ] Build `/compte/devis/[id]` — quote detail (status, items, timeline)
- [ ] Build `/admin/quotes/[id]` — admin quote edit page (price, notes, status)

UX:
- [ ] Confirm success screen shows quote number
- [ ] Test email rendering in Gmail, Outlook, Apple Mail

---

### SPRINT 4 — Checkout (Accessories) (Week 4-5)
**Goal: A customer can buy an accessory end-to-end**

Backend:
- [ ] Test `POST /api/v1/orders` with accessory item
- [ ] Verify TVA 20% correctly applied
- [ ] Test `POST /api/v1/payments/orders/:id/intent`
- [ ] Test Stripe webhook with `stripe listen --forward-to localhost:3001/api/v1/payments/webhook`
- [ ] Verify order status updates to CONFIRMED after payment

Frontend:
- [ ] Build `/checkout` page using Stripe PaymentElement
- [ ] Build `/checkout/success` page (order confirmation, order number)
- [ ] Build address form (French format: ligne1, CP, ville)
- [ ] Add order confirmation email trigger after webhook

---

### SPRINT 5 — Admin Management (Week 5-6)
**Goal: Admin can manage catalog, orders, and quotes without touching the DB**

Frontend:
- [ ] Build `/admin/produits` — product table with edit action
- [ ] Build `/admin/produits/nouveau` — product creation form
- [ ] Build `/admin/produits/[id]` — product edit form (all fields, images, variants)
- [ ] Build `/admin/commandes` — orders table with status filter
- [ ] Build `/admin/commandes/[id]` — order detail with manual status update
- [ ] Wire admin nav active state (highlight current page)

Backend:
- [ ] Add image upload endpoint (to Cloudflare R2 via pre-signed URL)
- [ ] Add `PATCH /api/v1/admin/orders/:id/status` for manual fulfillment

---

### SPRINT 6 — Authentication & Account (Week 6-7)
**Goal: Customer account experience complete**

Frontend:
- [ ] Build `/login` page (email/password + Google/GitHub buttons)
- [ ] Build `/register` page
- [ ] Build `/compte` — dashboard (recent orders, recent quotes)
- [ ] Build `/compte/commandes` — order history
- [ ] Build `/compte/commandes/[id]` — order tracking with status timeline
- [ ] Build `/compte/parametres` — profile edit, password change
- [ ] Build `/compte/donnees` — GDPR data export + deletion request

---

### SPRINT 7 — Polish & Performance (Week 7-9)
**Goal: Production-ready UX**

Frontend:
- [ ] Add page transitions (Framer Motion between routes)
- [ ] Add loading skeletons for all data-fetching components
- [ ] Add error boundaries (graceful fallbacks for API failures)
- [ ] Optimize images: all product images via next/image with R2 hostname
- [ ] Implement 3D viewer for H1 robot (if GLTF file available from engineer)
- [ ] Mobile audit: all pages fully usable on 375px viewport
- [ ] Dark/light mode toggle in navbar

SEO:
- [ ] `generateMetadata` on all product pages
- [ ] `robots.txt` and `sitemap.xml` (Next.js App Router native)
- [ ] Schema.org Product markup on product pages (for rich snippets)
- [ ] French `lang="fr"` confirmed in layout

Legal (France):
- [ ] `/mentions-legales` page (required by French law)
- [ ] `/cgv` page (Conditions Générales de Vente — required for e-commerce)
- [ ] `/privacy` page (RGPD privacy policy)
- [ ] Right of withdrawal notice on checkout (14-day droit de rétractation)

---

### SPRINT 8 — Pre-launch (Week 9-11)

Testing:
- [ ] E2E: Playwright tests for quote flow, checkout flow, admin quote pipeline
- [ ] Manual test on real Stripe test cards (success, decline, 3DS)
- [ ] Test GDPR consent recording + data export endpoint
- [ ] Test on iPhone Safari, Chrome Android, Firefox

Monitoring:
- [ ] Add Sentry DSN to API and web (`@sentry/nextjs`, `@sentry/nestjs`)
- [ ] Set up Uptime monitoring (BetterUptime or Fly.io built-in)
- [ ] Add Plausible Analytics (GDPR-compliant, no cookie required)

Security:
- [ ] Run `npm audit` — fix critical + high
- [ ] Confirm Stripe webhook endpoint only accepts Stripe IP ranges (Cloudflare WAF rule)
- [ ] Confirm admin routes return 403 for non-admin users
- [ ] Test rate limiting on auth endpoints

---

### SPRINT 9 — Launch (Week 11-12)

- [ ] Point custom domain → Vercel (web) + Fly.io (API)
- [ ] SSL certificates auto-provisioned
- [ ] Switch Stripe from test → live keys in production secrets
- [ ] Send first real quote to yourself as a smoke test
- [ ] Submit Google Search Console sitemap
- [ ] Share with 3 pilot customers for feedback

---

## V2 Backlog (Post-launch)
- Real-time order tracking (WebSocket via Socket.io)
- Elasticsearch for advanced product search
- Multi-language support (EN for international)
- Enterprise SSO (Okta SAML)
- Automated shipping rates (Colissimo/DHL API)
- TaxJar/Avalara for automated EU VAT per country
- Support ticket system
- Robot fleet monitoring portal (enterprise feature)
- Unitree API integration (when available)

---

## Environment Checklist (before first deploy)

| Variable | Where | Status |
|---|---|---|
| DATABASE_URL | Supabase → Settings → Database | ☐ |
| DIRECT_DATABASE_URL | Supabase (non-pooler) | ☐ |
| JWT_ACCESS_SECRET | `openssl rand -base64 64` | ☐ |
| JWT_REFRESH_SECRET | `openssl rand -base64 64` | ☐ |
| STRIPE_SECRET_KEY | Stripe dashboard (test first) | ☐ |
| STRIPE_WEBHOOK_SECRET | `stripe listen` output | ☐ |
| GOOGLE_CLIENT_ID/SECRET | Google Cloud Console | ☐ |
| GITHUB_CLIENT_ID/SECRET | GitHub OAuth App | ☐ |
| RESEND_API_KEY | resend.com dashboard | ☐ |
| REDIS_HOST/PASSWORD | Upstash dashboard | ☐ |
| R2_* | Cloudflare dashboard | ☐ |
| TEAM_EMAIL | Your sales email | ☐ |
| FRONTEND_URL | https://unitreerobotics.fr | ☐ |
| API_URL | https://api.unitreerobotics.fr | ☐ |
