# Sprint 6 — Customer Account Pages

**Date:** 2026-06-01
**Branch:** `feat/sprint-6-account` (merged via PR #4)

## What changed

### Backend additions

- `POST /users/me/addresses` — create shipping address (used by checkout step 2)
- `GET /users/me/addresses` — list addresses ordered by default-first
- `GET /quotes/my` — customer quote list (paginated)
- `GET /quotes/my/:id` — customer quote detail
- `POST /quotes/my/:id/accept` — customer accepts a quote
- `POST /quotes/my/:id/reject` — customer rejects a quote with optional reason

### Frontend — new pages

- `/compte` — updated dashboard with 4-tile grid (orders, quotes, settings, address)
- `/compte/commandes` — order history list with status badges
- `/compte/commandes/[id]` — order detail with items, totals, status timeline, cancel action
- `/compte/devis` — quote list with status badges
- `/compte/devis/[id]` — quote detail with accept/reject actions
- `/compte/parametres` — profile edit form (firstName, lastName, phone)

### Frontend — new API helpers (`apps/web/lib/api/account.ts`)

- `getOrders`, `getQuotes`, `getQuote`, `acceptQuote`, `rejectQuote`, `updateProfile`

### Shared types (`packages/types`)

- Added `Address` interface
- Added `phone?: string` to `User`
- Added `Order` and `Quote` interfaces

## Why

Customers had no way to track orders or manage quotes after submitting them. The checkout flow (Sprint 4) created orders with no visibility post-purchase.
