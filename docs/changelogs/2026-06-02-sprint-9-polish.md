# Sprint 9 — Polish & Performance

**Date:** 2026-06-02

## What changed

### Loading skeletons

Replaced all full-page `<Loader2>` spinners with contextual skeleton placeholders that match the shape of the actual content:

- `/compte/commandes` — 4 animated card skeletons while orders load
- `/compte/devis` — 4 animated card skeletons while quotes load
- `/admin/commandes` — 6-row table skeleton with correct column count
- `/admin/produits` — 6-row table skeleton with correct column count
- `components/admin/quotes-pipeline.tsx` — 5-row table skeleton (both list and pipeline views)
- `components/admin/dashboard.tsx` — inline skeleton replacing the spinner on KPI values

New reusable primitives in `components/ui/skeleton.tsx`:

- `Skeleton` — base animated pulse bar, any size via `className`
- `SkeletonCard` — card-shaped placeholder (title + subtitle)
- `SkeletonTableRow` — configurable column count table row

### Error boundary

New `components/ui/error-boundary.tsx` — React class component that catches render errors within admin pages. Shows a friendly "Une erreur est survenue" message with a "Réessayer" button that resets the boundary. Accepts an optional `fallback` prop for custom error UI.

Wrapped admin `<main>` in `app/(admin)/admin/layout.tsx` so every admin page is covered.

### Schema.org Product structured data

Added JSON-LD `<script type="application/ld+json">` to `app/(shop)/products/[slug]/page.tsx`:

- `@type: Product` with name, description, SKU, images, brand
- `Offer` block with price, currency (EUR), availability (InStock/OutOfStock)
- `AggregateRating` block included when the product has reviews

This makes Google Search eligible to show rich product snippets (price, rating stars) in results.

### Mobile audit at 375px

Verified all key pages render correctly at 375px viewport:

- Home, Accessoires, G1 robot, Devis form — single-column layouts, text readable
- Checkout (auth guard) — login form fills viewport correctly
- Product detail — gallery + thumbnail strip stacks without overflow
- No layout breaks found

## Why

Sprint 9 goal: improve perceived performance (no layout shift during data fetch), improve resilience (admin doesn't white-screen on API errors), and improve SEO (structured data for product rich snippets).
