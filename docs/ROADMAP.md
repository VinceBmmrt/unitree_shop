# Unitree Shop — Feature Roadmap

> **Location:** `docs/ROADMAP.md`
> **What's currently in progress:** see [`docs/STATUS.md`](STATUS.md) — sprint table + not-yet-built pages
> **DX improvement steps:** see [`docs/PLAN.md`](PLAN.md)

This file covers **post-launch** features only. Current sprint work is tracked in STATUS.md.

---

## V2 Backlog (post-launch)

Features intentionally deferred. Revisit after first paying customers.

### Commerce
- Real-time order tracking (WebSocket — `@nestjs/websockets` already installed)
- Elasticsearch for advanced product search + autocomplete
- Wishlist API + frontend
- Coupon/discount code validation at checkout
- Automated shipping rates (Colissimo / DHL API)
- TaxJar / Avalara for EU VAT per country (replace hardcoded TVA 20%)

### Enterprise / B2B
- Enterprise SSO (Okta SAML integration)
- Multi-seat enterprise account management
- Contract PDF generation and e-signature
- Volume discount pricing tiers
- NET30/NET60 invoice payment flow via Stripe

### Platform
- Multi-language support (EN for international, FR default)
- Plausible Analytics dashboard (GDPR-compliant, no cookie required)
- Support ticket system — UI for `SupportTicket` / `TicketMessage` (backend schema ready)
- Notification center (bell icon, backend schema ready)
- Robot fleet monitoring portal (enterprise feature, requires Unitree API)
- Unitree product API integration (when available — currently manual catalog management)

### Infrastructure
- WebSocket gateway for real-time events (order status, quote updates)
- CDN image optimization via Cloudflare Images (replace R2 direct serve)
- Upstash QStash for webhook retry / dead-letter queuing
- DB read replica for analytics queries

---

## Environment checklist (pre-launch)

| Variable | Where to get it | Status |
|---|---|---|
| `DATABASE_URL` | Supabase → Settings → Database | Live |
| `DIRECT_DATABASE_URL` | Supabase (non-pooler URL) | Live |
| `JWT_ACCESS_SECRET` | `openssl rand -base64 64` | Live |
| `JWT_REFRESH_SECRET` | `openssl rand -base64 64` | Live |
| `STRIPE_SECRET_KEY` | Stripe dashboard (switch test → live at launch) | Test only |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen` / Stripe dashboard | Test only |
| `GOOGLE_CLIENT_ID` / `SECRET` | Google Cloud Console | Live |
| `GITHUB_CLIENT_ID` / `SECRET` | GitHub OAuth App | Live |
| `RESEND_API_KEY` | resend.com dashboard | Live |
| `REDIS_HOST` / `REDIS_PASSWORD` | Upstash dashboard | Live |
| `R2_ACCOUNT_ID` / `R2_BUCKET_NAME` etc. | Cloudflare dashboard | Stub |
| `SENTRY_DSN` | Sentry project | Not set up |
| `FRONTEND_URL` | Custom domain | TBD |
| `API_URL` | Custom domain | TBD |
