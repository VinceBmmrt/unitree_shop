# Unitree Shop — AGENT.md

> **Location:** `docs/AGENT.md`
> **Conventions and rules:** [`CLAUDE.md`](../CLAUDE.md) — read that first.
> **Technical reference:** [`docs/SPEC.md`](SPEC.md)

File map, common task patterns, and gotchas for working in this monorepo. Does not repeat what's in CLAUDE.md.

---

## Where things live

### Frontend (`apps/web`)

| What                     | Path                                                                |
| ------------------------ | ------------------------------------------------------------------- |
| Route groups             | `app/(marketing)/`, `app/(shop)/`, `app/(account)/`, `app/(admin)/` |
| Auth pages               | `app/(account)/compte/connexion/`, `.../inscription/`               |
| OAuth callback           | `app/auth/callback/page.tsx`                                        |
| Quote form               | `app/devis/page.tsx`                                                |
| Product detail           | `app/(shop)/products/[slug]/page.tsx`                               |
| Admin panel              | `app/(admin)/admin/`                                                |
| Axios client             | `lib/api/client.ts`                                                 |
| Auth store (Zustand)     | `lib/store/auth.store.ts`                                           |
| Cart store (Zustand)     | `lib/store/cart.store.ts`                                           |
| Env validation           | `lib/env.ts` _(planned — see PLAN.md Step 10)_                      |
| Product components       | `components/product/`                                               |
| Layout components        | `components/layout/`                                                |
| Admin components         | `components/admin/`                                                 |
| 3D components            | `components/3d/`                                                    |
| Global styles + CSS vars | `app/globals.css`                                                   |

### Backend (`apps/api`)

| What                     | Path                                               |
| ------------------------ | -------------------------------------------------- |
| App bootstrap            | `src/main.ts`                                      |
| Module registry          | `src/app.module.ts`                                |
| Env validation           | `src/config/env.validation.ts`                     |
| Auth module              | `src/modules/auth/`                                |
| Users module             | `src/modules/users/`                               |
| Products module          | `src/modules/products/`                            |
| Orders module            | `src/modules/orders/`                              |
| Payments module          | `src/modules/payments/`                            |
| Quotes module            | `src/modules/quotes/`                              |
| Admin module             | `src/modules/admin/`                               |
| Analytics module         | `src/modules/analytics/`                           |
| Email module + templates | `src/modules/email/`                               |
| GDPR module              | `src/modules/gdpr/`                                |
| Storage module (stub)    | `src/modules/storage/`                             |
| Inventory module         | `src/modules/inventory/`                           |
| Support module           | `src/modules/support/`                             |
| Prisma service           | `src/prisma/prisma.service.ts`                     |
| JWT guard                | `src/common/guards/jwt-auth.guard.ts`              |
| Roles guard              | `src/common/guards/roles.guard.ts`                 |
| Response interceptor     | `src/common/interceptors/transform.interceptor.ts` |
| Tax constants            | `src/common/constants/tax.constants.ts`            |
| Database schema          | `prisma/schema.prisma`                             |
| DB seed                  | `prisma/seed.ts`                                   |
| Migrations               | `prisma/migrations/`                               |

### Shared types (`packages/types/src/`)

| File         | Exports                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| `product.ts` | `ProductCategory`, `Product`, `ProductImage`, `ProductTag`, `ProductOption`, `ProductConfigChoice`, `Review` |
| `auth.ts`    | `JwtPayload`, `User`, `AuthResponse`                                                                         |
| `cart.ts`    | `CartItem`, `CartState`                                                                                      |

---

## Common patterns

### Adding an API endpoint

1. Add DTO in `src/modules/<module>/dto/`
2. Add method to `<module>.service.ts`
3. Add route to `<module>.controller.ts` — use `@Public()` if unauthenticated, `@Roles(Role.ADMIN)` if admin-only
4. Return raw data from the service — the transform interceptor auto-wraps to `{ success, data, message }`

### Adding a frontend page

1. Create `app/<group>/<route>/page.tsx`
2. Server component: fetch directly, add `export const revalidate = 300` for ISR on catalog pages
3. Client component: add `'use client'`, use `apiClient` from `lib/api/client.ts`
4. Always `try/catch` API calls and return an empty state on failure — pages must render when the API is down

### Adding a shared type

1. Add to `packages/types/src/<domain>.ts`
2. Export from `packages/types/src/index.ts`
3. Run `pnpm --filter @unitree/types build` (or let `pnpm dev` rebuild automatically)
4. Import as `import { MyType } from '@unitree/types'` in both apps

### Sending an email

Use `EmailService.send(templates.xxx(...))` — non-blocking. Always wrap in `.catch()`:

```ts
this.emailService.send(templates.xxx({...}))
  .catch(err => this.logger.error('Email failed', err));
```

Templates live in `src/modules/email/templates/index.ts`.

### Running a DB migration

```bash
# 1. Write the SQL manually
# 2. Apply it
npx prisma db execute --file prisma/migrations/<folder>/migration.sql --schema prisma/schema.prisma
# 3. Mark it applied
npx prisma migrate resolve --applied <folder_name>
```

Never run `prisma migrate dev` — Supabase shadow DB will always fail.

---

## Gotchas

| Trap                            | Rule                                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| GitHub OAuth profile ID         | `profile.id` is a **number** — cast to `String(profile.id)` before saving to Prisma                          |
| `API_URL` on Render             | Must NOT include `/api/v1` — routes add it; double-prefixing breaks OAuth redirect_uri                       |
| `NEXT_PUBLIC_API_URL` on Vercel | MUST include `/api/v1`                                                                                       |
| Three.js in server components   | Never import directly — use `'use client'` or the `g1-model-dynamic.tsx` dynamic-import pattern              |
| Product images from new CDNs    | Add the hostname to `apps/web/next.config.mjs` `images.remotePatterns` first                                 |
| Playwright screenshots          | Save to `screenshots/` at repo root — never in `apps/`                                                       |
| Token storage                   | Access token in `window.__unitreeAccessToken` (memory only). Never localStorage.                             |
| Login redirect                  | Always `/compte/connexion` — the route `/login` does not exist                                               |
| `convertToOrder` isolation      | Uses `Prisma.TransactionIsolationLevel.Serializable` with 15s timeout — intentional, don't downgrade         |
| OAuth callback init             | `auth.store.ts` `initialize()` skips on `/auth/callback` — that page handles its own token from the URL hash |
