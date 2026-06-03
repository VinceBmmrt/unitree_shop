-- ============================================================
-- Row Level Security — Unitree Shop
--
-- Architecture:
--   • NestJS API connects as the postgres superuser via DATABASE_URL.
--     Superusers bypass RLS by default — no policy needed for the API.
--   • Supabase service_role also bypasses RLS.
--   • These policies protect the `anon` and `authenticated` Supabase
--     roles (direct dashboard queries, future Supabase client usage).
--
-- Note: Prisma generates camelCase column names (no @map on fields),
-- so PostgreSQL columns must be quoted where they differ from lowercase.
-- ============================================================

-- ─── ENABLE RLS ON ALL TABLES ────────────────────────────────

ALTER TABLE users                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_accounts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens          ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys                ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprises             ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts               ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories              ENABLE ROW LEVEL SECURITY;
ALTER TABLE products                ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images          ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants        ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags            ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuration_options   ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuration_choices   ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses              ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses               ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history    ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items             ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments                ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments               ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items             ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications           ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_consents           ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_deletion_requests  ENABLE ROW LEVEL SECURITY;

-- ─── PUBLIC CATALOGUE — SELECT open to all ───────────────────
-- Prisma camelCase columns: "isActive", "isPublished", etc.

CREATE POLICY "catalogue_public_select" ON categories
  FOR SELECT USING ("isActive" = true);

CREATE POLICY "products_public_select" ON products
  FOR SELECT USING ("isActive" = true);

CREATE POLICY "product_images_public_select" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "product_variants_public_select" ON product_variants
  FOR SELECT USING ("isActive" = true);

CREATE POLICY "product_tags_public_select" ON product_tags
  FOR SELECT USING (true);

CREATE POLICY "product_reviews_published_select" ON product_reviews
  FOR SELECT USING ("isPublished" = true);

CREATE POLICY "configuration_options_public_select" ON configuration_options
  FOR SELECT USING (true);

CREATE POLICY "configuration_choices_public_select" ON configuration_choices
  FOR SELECT USING (true);

-- ─── USER-OWNED DATA — scoped to auth.uid() ──────────────────
-- auth.uid() is the Supabase Auth user UUID.
-- Our NestJS JWT auth does not set auth.uid(), so these policies
-- only take effect when someone accesses the DB via Supabase client
-- with Supabase Auth tokens. The API (postgres superuser) bypasses RLS.

CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "oauth_accounts_own" ON oauth_accounts
  FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "refresh_tokens_own" ON refresh_tokens
  FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "api_keys_own" ON api_keys
  FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "addresses_own" ON addresses
  FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "configurations_own" ON configurations
  FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "wishlist_own" ON wishlist_items
  FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "notifications_own_select" ON notifications
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "notifications_own_update" ON notifications
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "gdpr_consents_own" ON gdpr_consents
  FOR SELECT USING (
    auth.uid()::text = "userId"
    OR ("userId" IS NULL AND "sessionId" = current_setting('app.session_id', true))
  );

CREATE POLICY "support_tickets_own" ON support_tickets
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "orders_own_select" ON orders
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "reviews_own_all" ON product_reviews
  FOR ALL USING (auth.uid()::text = "userId");

-- ─── WRITE-ONLY INSERTS (no read-back from client) ───────────

CREATE POLICY "gdpr_consents_insert" ON gdpr_consents
  FOR INSERT WITH CHECK (true);

-- ─── SENSITIVE / INTERNAL TABLES — no client policies ────────
-- No SELECT / ALL policy → only postgres superuser and service_role
-- can read or write these tables.
--
-- Blocked for anon + authenticated:
--   enterprises, contracts, order_items, order_status_history,
--   payments, refunds, shipments, leases, quotes, quote_items,
--   ticket_messages, audit_logs, inventory_items, warehouses,
--   coupons, data_deletion_requests
