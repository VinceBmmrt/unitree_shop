# Sprint 5 — Admin Management Pages

**Date:** 2026-06-01
**Branch:** `feat/sprint-5-admin` (merged via PR #5)

## What changed

### Backend additions

- `GET /orders/admin/all` — paginated all-orders list with optional status filter
- `PATCH /orders/admin/:id/status` — update order status + write to `OrderStatusHistory`
- `GET /products/admin/:id` — fetch any product by ID (no `isActive` filter, for edit page)
- Both product endpoints: `GET /products/admin/:id` declared **before** `GET /products/:slug` to avoid route conflict

### Frontend — new pages

- `/admin/commandes` — orders table with status filter dropdown + inline status update
- `/admin/commandes/[id]` — order detail with items, totals, address, full status timeline
- `/admin/produits` — product list with active/inactive toggle
- `/admin/produits/nouveau` — create product form
- `/admin/produits/[id]` — edit product form (loads via `/products/admin/:id` to include inactive)

### Frontend — new components

- `components/admin/product-form.tsx` — shared form with auto-slug generation from product name

### Frontend — new API helpers (`apps/web/lib/api/admin.ts`)

- `adminGetOrders`, `adminUpdateOrderStatus`
- `adminGetProducts`, `adminCreateProduct`, `adminUpdateProduct`
- `ProductPayload` interface (uses `tags: string[]`, not `{ tag: string }[]`)

## Key decisions

- Admin product edit uses a dedicated `/products/admin/:id` endpoint (not slug) so inactive products can be loaded
- `ProductPayload` is separate from `AdminProduct` because the form submits flat `string[]` tags while the API returns `{ tag: string }[]`
- `updateStatus` uses `await prisma.order.findUniqueOrThrow(...)` without assignment to avoid unused-variable lint errors blocking the pre-commit hook
