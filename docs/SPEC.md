# Unitree Shop — Technical Specification

French-market robotics e-commerce platform. Demo/portfolio project; production-grade implementation.

---

## Business domain

**Products sold:**
- Humanoid robots (G1, H1) — high-value, require quote; not directly purchasable
- Accessories, spare parts, peripherals — standard cart checkout with Stripe

**Markets:** France (primary), EU. Currency: EUR. Tax: TVA 20% (French VAT).

**User types:**
- `CUSTOMER` — individual buyer (B2C)
- `ENTERPRISE_ADMIN` / `ENTERPRISE_MEMBER` — B2B company account
- `SUPPORT_AGENT` — handles tickets
- `SALES_REP` — manages quotes
- `ADMIN` / `SUPER_ADMIN` — full platform access

---

## System architecture

```
┌─────────────────────────────┐     HTTPS     ┌──────────────────────────────┐
│   Next.js 14 (Vercel)       │ ────────────► │   NestJS + Fastify (Render)  │
│   apps/web                  │               │   apps/api                   │
│   SSR + ISR + Client        │               │   REST API + Swagger          │
└─────────────────────────────┘               └──────────────┬───────────────┘
                                                             │
              ┌──────────────────────────────────────────────┼─────────────────────┐
              │                                              │                     │
       ┌──────▼──────┐                             ┌────────▼──────┐    ┌─────────▼──────┐
       │  PostgreSQL  │                             │     Redis      │    │   Cloudflare   │
       │  (Supabase)  │                             │   (Upstash)    │    │       R2       │
       └─────────────┘                             └───────────────┘    └────────────────┘
```

**Third-party integrations:**
| Service | Purpose | Status |
|---|---|---|
| Supabase (PostgreSQL) | Primary database | Live |
| Stripe | Card payments, webhooks | Live |
| Resend | Transactional email | Live |
| BullMQ + Redis (Upstash) | Email job queue | Live |
| Cloudflare R2 | Product image storage | Stub (mock URL) |
| Google OAuth | Social login | Live |
| GitHub OAuth | Social login | Live |

---

## Database schema

**32 Prisma models across these domains:**

### Users & auth
- `User` — core account, `role: UserRole`, optional `enterpriseId`
- `OAuthAccount` — linked Google/GitHub accounts (unique on `provider + providerId`)
- `RefreshToken` — JWT rotation (revocable, IP + UA logged)
- `ApiKey` — developer API keys (hashed, scoped)

### Enterprise (B2B)
- `Enterprise` — company account with credit limit, payment terms
- `Contract` — signed documents linked to enterprise

### Products
- `Category` — hierarchical tree (self-referential `parentId`)
- `Product` — `sku`, `slug`, `basePrice`, `requiresQuote`, `isConfigurable`, `isFeatured`; specs as JSONB; optional `modelUrl` for 3D
- `ProductImage` — gallery, `isPrimary` flag
- `ProductVariant` — SKU variants with `priceDelta`
- `ProductTag` — simple tagging
- `ProductReview` — one per user per product, must be published

### Robot configurator
- `ConfigurationOption` — named option for a product (e.g. "Colour", "Battery")
- `ConfigurationChoice` — variant of an option with `priceDelta`
- `Configuration` — saved selections as JSONB with computed `totalPrice`; optionally linked to `User`; status: `DRAFT → SAVED → IN_CART → ORDERED`

### Inventory
- `Warehouse` — physical location
- `InventoryItem` — stock per product×variant×warehouse (`quantityOnHand`, `quantityReserved`)

### Orders
- `Order` — `orderNumber` (`UT-<timestamp>-<nanoid>`), `OrderStatus`, currency EUR, TVA stored at order time
- `OrderItem` — line item with `configurationId` linkage
- `OrderStatusHistory` — full transition log
- `Address` — shared by users and enterprises; used as shipping/billing

### Payments
- `Payment` — Stripe `PaymentIntent`, `PaymentMethod` (CARD, BANK_TRANSFER, INVOICE_NET30/60, FINANCING)
- `Refund` — Stripe refund tracking
- `Shipment` — carrier + tracking number per order
- `Lease` — financing (monthly payment, term, Stripe subscription schedule)

### Quotes (B2B pipeline)
- `Quote` — `quoteNumber` (`QT-<timestamp>-<nanoid>`), `QuoteStatus`, 30-day expiry, optional `salesRepId`
- `QuoteItem` — line item with `configurationId` linkage and per-item `discount`

### Support
- `SupportTicket` — subject, category, `TicketPriority`, `TicketStatus`
- `TicketMessage` — threaded messages, `isInternal` flag

### GDPR & compliance
- `GdprConsent` — granular per category (essential/analytics/marketing), `bannerVersion`, IP logged
- `DataDeletionRequest` — GDPR Art. 17 erasure workflow
- `AuditLog` — before/after JSON, IP + UA

### Commerce
- `WishlistItem` — user product saves
- `Notification` — user alerts
- `Coupon` — discount codes (percentage or fixed, per-user limit)

---

## API surface

Base path: `/api/v1`. All responses: `{ success: boolean, data: T, message: string }`.

### Auth — `POST /auth/*`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Email+password registration |
| POST | `/auth/login` | Public | Returns access token + sets refresh cookie |
| POST | `/auth/refresh` | Cookie | Rotates refresh token, returns new access token |
| POST | `/auth/logout` | Bearer | Revokes refresh token |
| GET | `/auth/me` | Bearer | Returns current user |
| POST | `/auth/forgot-password` | Public | Sends reset email |
| POST | `/auth/reset-password` | Public | Resets password via token |
| GET | `/auth/google` | Public | Initiates Google OAuth |
| GET | `/auth/google/callback` | Public | Google OAuth callback |
| GET | `/auth/github` | Public | Initiates GitHub OAuth |
| GET | `/auth/github/callback` | Public | GitHub OAuth callback |

### Products — `GET /products/*`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/products` | Public | Paginated catalog (filter by category, search, featured) |
| GET | `/products/:id` | Public | Product detail with images, options, reviews |
| GET | `/products/slug/:slug` | Public | Lookup by slug |
| GET | `/products/compare` | Public | Compare up to 4 products by IDs (returns `[]` if no `ids`) |
| GET | `/products/featured` | Public | Featured products for homepage |
| POST | `/products/:id/configure` | Public | Save configuration, returns `configurationId` |
| POST | `/products` | ADMIN | Create product |
| PATCH | `/products/:id` | ADMIN | Update product |
| DELETE | `/products/:id` | ADMIN | Delete product |

### Orders — `POST /orders/*`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/orders` | Bearer | Create order from cart items |
| GET | `/orders` | Bearer | User's order history |
| GET | `/orders/:id` | Bearer | Order detail |
| GET | `/orders/admin` | ADMIN | All orders with filters |
| PATCH | `/orders/:id/status` | ADMIN | Update order status |
| POST | `/orders/:id/cancel` | Bearer | Cancel order (own only) |

### Payments — `POST /payments/*`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/payments/orders/:id/intent` | Bearer | Create Stripe PaymentIntent |
| POST | `/payments/webhook` | Stripe signature | Handle Stripe events (raw body) |
| POST | `/payments/orders/:id/lease` | Bearer | Create lease/financing schedule |

### Quotes — `POST /quotes/*`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/quotes/request` | Public | Submit quote request (GDPR consent required) |
| GET | `/quotes` | Bearer | User's quotes |
| GET | `/quotes/:id` | Bearer | Quote detail (own) |
| POST | `/quotes/:id/accept` | Bearer | Customer accepts quote |
| POST | `/quotes/:id/reject` | Bearer | Customer rejects quote |
| GET | `/quotes/admin` | ADMIN | All quotes with search/filter |
| GET | `/quotes/admin/:id` | ADMIN | Admin quote detail |
| PATCH | `/quotes/admin/:id` | ADMIN | Update quote (items, status, discount, notes) |
| POST | `/quotes/admin/:id/convert` | ADMIN | Convert accepted quote to order |

### Admin — `GET /admin/*`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/admin/dashboard` | ADMIN | KPIs: revenue, order counts, quote pipeline |
| POST | `/admin/storage/upload-url` | ADMIN | Get presigned R2 URL (stub) |

### GDPR — `POST /gdpr/*`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/gdpr/consent` | Public | Record cookie consent |
| GET | `/gdpr/export` | Bearer | Export user data (JSON) |
| POST | `/gdpr/delete` | Bearer | Request account deletion |

### Health
| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Liveness check — returns `{ status: 'ok' }` |

---

## Frontend routes

```
/                           Home (hero, featured products, trust badges, enterprise CTA)
/robots                     Robot listing
/robots/g1                  G1 robot detail (marketing page)
/robots/h1                  H1 robot detail (marketing page)
/accessoires                Accessories catalog
/products/[slug]            Product detail (configurator + add-to-cart or quote button)
/devis                      Quote request form (pre-filled from configurator)
/services                   Services + enterprise section
/enterprise                 → redirects to /services#enterprise
/about                      About page
/contact                    Contact form
/docs                       Documentation

/compte/connexion           Login
/compte/inscription         Register
/compte/mot-de-passe-oublie Forgot password
/compte/reinitialiser-mot-de-passe  Reset password
/compte                     Account dashboard
/compte/devis               Customer quote list       [NOT YET BUILT]
/compte/devis/[id]          Quote detail              [NOT YET BUILT]
/compte/commandes           Order history             [NOT YET BUILT]
/compte/commandes/[id]      Order detail              [NOT YET BUILT]
/compte/parametres          Profile settings          [NOT YET BUILT]
/compte/donnees             GDPR data/deletion        [NOT YET BUILT]

/admin                      Admin dashboard (KPIs, revenue chart)
/admin/quotes               Quote pipeline (Kanban-style)
/admin/produits             Product management        [NOT YET BUILT]
/admin/commandes            Order management          [NOT YET BUILT]

/auth/callback              OAuth token exchange landing

/mentions-legales           Legal notices (French law)
/cgv                        Conditions générales de vente
/privacy                    Privacy policy (RGPD)
/cookies                    Cookie policy + consent
```

---

## Business logic

### Configure → Quote flow

```
ProductActions (client component)
  │  holds selections state
  ▼
POST /products/:id/configure
  │  saves Configuration record (userId optional — works for guests)
  │  returns { configurationId }
  ▼
redirect → /devis?product=<productId>&config=<configId>
  │
  ▼
QuoteRequestForm (requires: firstName, lastName, email, phone, gdprConsent)
  │
  ▼
POST /quotes/request
  │  validates GDPR consent
  │  looks up Configuration.totalPrice → unitPrice
  │  creates Quote with items, TVA estimate
  │  records GdprConsent
  │  sends emails to customer + sales team (non-blocking)
  │  returns { quoteNumber }
  ▼
Admin: PATCH /quotes/admin/:id
  │  can update items, prices, discount, notes, salesRep
  │  on status → SENT: sends quoteSentCustomer email
  ▼
Customer: POST /quotes/:id/accept
  ▼
Admin: POST /quotes/admin/:id/convert
  │  Serializable transaction (15s timeout)
  │  reserves inventory in single warehouse
  │  creates Order (status: CONFIRMED)
  │  marks Quote CONVERTED
```

### Accessory checkout flow

```
CartStore (Zustand) → persisted in localStorage
  ▼
POST /orders  (backend re-validates prices from DB)
  ▼
POST /payments/orders/:id/intent  → Stripe PaymentIntent
  ▼
Stripe PaymentElement (frontend)
  ▼
POST /payments/webhook  (payment_intent.succeeded)
  │  idempotent check (order status before processing)
  │  updates Order → CONFIRMED
  │  sends confirmation email
```

### JWT auth flow

```
Login → POST /auth/login
  │  returns { accessToken } in body
  │  sets httpOnly Secure SameSite=None refresh cookie
  ▼
Frontend stores accessToken in window.__unitreeAccessToken
  ▼
Every request: Authorization: Bearer <token>
  ▼
On 401: apiClient interceptor fires
  │  uses shared refreshPromise (prevents concurrent rotation)
  │  POST /auth/refresh → new accessToken
  │  retries original request
  ▼
On refresh failure: redirect → /compte/connexion
```

### OAuth flow

```
User clicks "Sign in with Google/GitHub"
  ▼
GET /auth/google  (or /auth/github)
  ▼
Passport redirects to provider consent screen
  ▼
GET /auth/google/callback
  │  exchanges code server-side
  │  upserts User + OAuthAccount
  │  issues refresh cookie + accessToken
  │  redirects to ${FRONTEND_URL}/auth/callback#token=<accessToken>
  ▼
app/auth/callback/page.tsx
  │  extracts #token from URL hash
  │  calls setUser(user, accessToken)
  │  redirects to /compte
```

---

## Tax

`TAX_RATE = 0.20` and `TAX_LABEL = 'TVA 20%'` from `src/common/constants/tax.constants.ts`.

Stored on Order at creation time so historical orders are unaffected by future rate changes.

Quote taxTotal is indicative (estimate at `subtotal × 0.20`). Final tax is on the converted Order.

---

## Rate limiting

Global: 100 requests / 60 seconds per IP via `@nestjs/throttler` (configured in `AppModule`).

Auth and payment endpoints apply stricter limits via `@Throttle()` decorator on the controller.

---

## Email templates

Located in `apps/api/src/modules/email/templates/index.ts`:

| Template function | Trigger |
|---|---|
| `quoteReceivedCustomer` | Customer submits quote request |
| `quoteReceivedTeam` | Customer submits quote request |
| `quoteSentCustomer` | Admin sets quote status → SENT |
| `orderConfirmation` | Order confirmed (Stripe webhook) |
| `passwordReset` | User requests password reset |

---

## Security model

- JWT access tokens: short-lived (15 min), memory-only, never persisted client-side
- Refresh tokens: long-lived (7 days), httpOnly Secure SameSite=None cookie, stored hashed in DB, revocable
- `@Roles(Role.ADMIN)` guard on all admin endpoints
- `@Public()` decorator bypasses JWT guard for public endpoints
- Stripe webhook: raw body + signature verification
- GDPR consent recorded and linked on every quote submission
- `AuditLog` table for all sensitive state changes
- Row-level security policies on Supabase (migration `20260424000001_rls_policies`)

---

## Infrastructure

| Layer | Service | Region | Deploy |
|---|---|---|---|
| Frontend | Vercel | Auto (CDN) | Push to `main` |
| API | Render (Docker) | Frankfurt (eu-central) | Push to `main` via `render.yaml` |
| Database | Supabase (PostgreSQL) | Paris (eu-west-2) | Managed |
| Cache | Upstash (Redis) | Frankfurt | Managed |
| Email | Resend | - | API key |
| Storage | Cloudflare R2 | Auto | API key (stub) |
| Payments | Stripe | - | API key |

Docker image: multi-stage Alpine, Node 20, non-root user (`nestjs:1001`), OpenSSL 3, healthcheck at `/api/health`.

---

## Legal requirements (France)

Required pages under French e-commerce law:
- `/mentions-legales` — publisher identity, host info
- `/cgv` — conditions générales de vente (including 14-day droit de rétractation)
- `/privacy` — RGPD privacy policy
- `/cookies` — cookie policy + consent banner

GDPR requirements implemented:
- Granular consent per category (essential/analytics/marketing)
- Consent banner version tracking
- Data export endpoint (`GET /gdpr/export`)
- Right to erasure (`POST /gdpr/delete`)
- `GdprConsent` recorded on every quote submission
