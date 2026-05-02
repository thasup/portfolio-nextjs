-- CapitalOS v4 Dual-Source Support Migration
-- Adds: SA categories, SA assets, mapping configuration, dual-source enums

-- 1. Add new enums
CREATE TYPE "CapitalMappingRole" AS ENUM ('SA_COVERED', 'YNAB_ONLY');
CREATE TYPE "CapitalPortfolioType" AS ENUM ('STRATEGIC', 'TACTICAL');
CREATE TYPE "CapitalInsightSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'INFO');

-- 2. Extend existing enum
ALTER TYPE "CapitalAccountSource" ADD VALUE IF NOT EXISTS 'SA_SNAPSHOT';

-- 3. Add mapping fields to capital_accounts
ALTER TABLE "capital_accounts" 
  ADD COLUMN IF NOT EXISTS "sa_category" TEXT,
  ADD COLUMN IF NOT EXISTS "mapping_role" "CapitalMappingRole";

-- 4. Add SA fields to capital_snapshots
ALTER TABLE "capital_snapshots"
  ADD COLUMN IF NOT EXISTS "sa_total" BIGINT,
  ADD COLUMN IF NOT EXISTS "sa_portfolios" JSONB,
  ADD COLUMN IF NOT EXISTS "fx_rate_usd_thb" DECIMAL(10, 4);

-- 5. Create capital_sa_categories table
CREATE TABLE IF NOT EXISTS "capital_sa_categories" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "nexus_users"("id"),
  "portfolio_type" "CapitalPortfolioType" NOT NULL,
  "name" TEXT NOT NULL,
  "target_pct" DECIMAL(5, 2),
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "capital_sa_categories_user_portfolio_idx" 
  ON "capital_sa_categories"("user_id", "portfolio_type");

-- 6. Create capital_sa_assets table
CREATE TABLE IF NOT EXISTS "capital_sa_assets" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "category_id" UUID NOT NULL REFERENCES "capital_sa_categories"("id") ON DELETE CASCADE,
  "ticker" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "value_thb" BIGINT,
  "shares" DECIMAL(18, 6),
  "target_pct" DECIMAL(5, 2),
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "capital_sa_assets_category_idx" 
  ON "capital_sa_assets"("category_id");

-- 7. Create capital_mapping_configs table
CREATE TABLE IF NOT EXISTS "capital_mapping_configs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "nexus_users"("id"),
  "ynab_acc_id" TEXT NOT NULL,
  "sa_category" TEXT,
  "role" "CapitalMappingRole" NOT NULL,
  "note" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  UNIQUE("user_id", "ynab_acc_id")
);

CREATE INDEX IF NOT EXISTS "capital_mapping_configs_user_idx" 
  ON "capital_mapping_configs"("user_id");
