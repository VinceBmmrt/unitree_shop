# Sprint 8 — Legal & SEO

**Date:** 2026-06-02

## What changed

### `app/sitemap.ts`

- Next.js App Router sitemap — static routes + dynamic product pages fetched from API at build time
- Gracefully falls back to static routes if API is unreachable at build time
- Accessible at `/sitemap.xml`

### `app/robots.ts`

- Disallows crawling of `/admin/`, `/compte/`, `/checkout/`, `/auth/`
- Points to `/sitemap.xml`
- Accessible at `/robots.txt`

### Checkout — droit de rétractation (art. L221-18 Code de la consommation)

- Added withdrawal notice on the recap step, before the payment button
- Mentions the 14-day return window, return shipping at customer's expense, and exclusion for custom-configured products

### `/compte/donnees` — GDPR data page

- Export: calls `GET /gdpr/export`, downloads a `.json` file with profile, orders, quotes, consent history
- Deletion: two-step confirm dialog, calls `DELETE /gdpr/me` with optional reason, shows 30-day processing notice
- Linked from the account dashboard (`/compte`) as a full-width tile

## Why

Legal requirements for a French e-commerce site:

- RGPD Art. 20 — right to data portability
- RGPD Art. 17 — right to erasure
- Art. L221-18 Code de la consommation — mandatory pre-payment withdrawal notice
- SEO: sitemap and robots.txt required for Google to index the catalog correctly
