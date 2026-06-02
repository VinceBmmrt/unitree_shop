# Sprint 7 — Admin Quote Detail Page

**Date:** 2026-06-02

## What changed

### Frontend — new page

- `/admin/quotes/[id]` — full quote detail + management page

### What the page includes

- Quote header: number, creation date, current status badge
- Customer card: name, email, phone, linked orders
- Items table: product, SKU, quantity, unit price, per-item discount, line total
- Notes: customer-visible notes + internal notes (both editable)
- Pricing summary: subtotal HT, remise, TVA 20%, total TTC — recalculated live as discount changes
- Action panel (hidden for terminal statuses): status select, global discount (€), validity date, Save button
- Convert to order button — appears only when status is ACCEPTED, calls `POST /quotes/:id/convert`, redirects to `/admin/commandes`
- Terminal state message for REJECTED / EXPIRED / CONVERTED quotes

### Frontend — new API helpers (`apps/web/lib/api/admin.ts`)

- `AdminQuote` interface (full detail shape)
- `adminGetQuotes` — list with status filter + search
- `adminGetQuote` — single quote detail
- `adminUpdateQuote` — patch status, notes, internalNotes, discount, validUntil
- `adminConvertQuote` — POST convert → returns order

## Why

The `QuotesPipeline` list already existed and linked to `/admin/quotes/[id]`, but that page was missing. Without it, admins had no way to review quote contents, negotiate pricing, or trigger the conversion to order — the core sales flow for robots.
