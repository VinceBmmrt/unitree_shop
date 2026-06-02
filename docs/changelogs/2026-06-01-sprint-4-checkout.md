# 2026-06-01 — Sprint 4: /checkout page

**Branch:** `feat/sprint-4-checkout`
**PR:** #3

---

## What was built

Full accessory checkout flow — cart to Stripe payment to confirmation.

### Backend additions

**New:** `apps/api/src/modules/users/dto/create-address.dto.ts`

- class-validator DTO for Address creation
- All Prisma Address fields, optional fields properly marked

**Modified:** `apps/api/src/modules/users/users.service.ts`

- `createAddress(userId, dto)` — handles isDefault uniqueness via transaction
- `getAddresses(userId)` — ordered by isDefault desc, createdAt desc

**Modified:** `apps/api/src/modules/users/users.controller.ts`

- `POST /users/me/addresses` — new route
- `GET /users/me/addresses` — new route

### Shared types

**Modified:** `packages/types/src/auth.ts`

- Added `Address` interface
- Added `phone?` to `User`

### Frontend additions

**New:** `apps/web/lib/env.ts`

- Zod validates `NEXT_PUBLIC_API_URL` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Fails fast at startup with clear error if either is missing/malformed

**New:** `apps/web/lib/api/checkout.ts`

- `createAddress()`, `createOrder()`, `createPaymentIntent()` — typed helpers over `apiClient`

**New:** `apps/web/app/checkout/layout.tsx`

- Stripped checkout layout (logo + lock badge, no navbar/footer)

**New:** `apps/web/app/checkout/page.tsx`

- Server component, robots noindex, renders `<CheckoutFlow />`

**New:** `apps/web/app/checkout/success/page.tsx`

- Clears cart on mount, shows order number, links to account + accessories

**Rewritten:** `apps/web/components/checkout/checkout-flow.tsx`

- Auth guard → redirect to `/compte/connexion?redirect=/checkout`
- Cart guard → empty state
- Step 1 Contact: react-hook-form, pre-fills from auth store
- Step 2 Livraison: address form → `POST /users/me/addresses`
- Step 3 Récapitulatif: pricing (HT + TVA 20% + shipping €150/free ≥€5000) + address summary
- Step 3 → 4 transition: creates order + PaymentIntent, sets `clientSecret`
- Step 4 Paiement: `<Elements clientSecret>` + `PaymentStepInner` (useStripe/useElements)
- `loadStripe()` at module level (singleton)
- Two-column layout: form + sticky order summary sidebar

**Modified:** `apps/web/app/(account)/compte/connexion/page.tsx`

- `router.push(searchParams.get('redirect') ?? '/')` after login

---

## Architecture decisions made

1. **Stripe Elements initialized dynamically** — `clientSecret` set in state at step 3→4 transition; `<Elements>` only mounts when secret is available
2. **`PaymentStepInner` sub-component** — isolates `useStripe()`/`useElements()` hooks inside `<Elements>` provider; outer `CheckoutFlow` never calls these hooks
3. **Address created at step 2** — address persisted before review, so user can go back without losing it; same `shippingAddressId` used throughout
4. **Order + PaymentIntent created at step 3 submit** — not at step 4 render, to avoid double-creation on re-render

---

## What still needs to be done

- Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...` to `apps/web/.env.local` before testing
- Run `stripe listen --forward-to localhost:3001/api/v1/payments/webhook` to test webhook confirmation
- Sprint 5: admin product/order management pages
