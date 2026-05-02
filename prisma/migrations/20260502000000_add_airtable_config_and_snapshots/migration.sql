-- CreateEnum
CREATE TYPE "CapitalAirtableEntityType" AS ENUM ('ACCOUNTS', 'LIABILITIES', 'GOALS', 'SNAPSHOTS', 'HOLDINGS');

-- CreateTable
CREATE TABLE "capital_snowball_snapshots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "snapshot_date" TIMESTAMP(3) NOT NULL,
    "import_method" TEXT NOT NULL,
    "total_value_usd" BIGINT NOT NULL,
    "total_value_thb" BIGINT NOT NULL,
    "fx_rate_usd_thb" DOUBLE PRECISION NOT NULL,
    "total_profit_usd" BIGINT NOT NULL,
    "total_profit_pct" DOUBLE PRECISION NOT NULL,
    "irr_pct" DOUBLE PRECISION NOT NULL,
    "passive_income_usd" BIGINT NOT NULL,
    "passive_yield_pct" DOUBLE PRECISION NOT NULL,
    "cash_balance_usd" BIGINT,
    "strategic_value_usd" BIGINT,
    "strategic_alloc_pct" DOUBLE PRECISION,
    "strategic_profit_pct" DOUBLE PRECISION,
    "tactical_value_usd" BIGINT,
    "tactical_alloc_pct" DOUBLE PRECISION,
    "tactical_profit_pct" DOUBLE PRECISION,
    "global_equities_usd" BIGINT,
    "global_equities_pct" DOUBLE PRECISION,
    "fixed_income_usd" BIGINT,
    "fixed_income_pct" DOUBLE PRECISION,
    "real_asset_usd" BIGINT,
    "thematic_usd" BIGINT,
    "airtable_snapshot_id" TEXT,
    "notes" TEXT,
    "total_holdings" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "capital_snowball_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capital_position_snapshots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "snapshot_id" UUID NOT NULL,
    "ticker" TEXT NOT NULL,
    "portfolio_name" TEXT NOT NULL,
    "shares_held" DOUBLE PRECISION NOT NULL,
    "cost_basis_usd" BIGINT NOT NULL,
    "current_value_usd" BIGINT NOT NULL,
    "total_profit_usd" BIGINT,
    "total_profit_pct" DOUBLE PRECISION,
    "irr_pct" DOUBLE PRECISION,
    "dividend_yield_pct" DOUBLE PRECISION,
    "pe_ratio" DOUBLE PRECISION,
    "beta" DOUBLE PRECISION,

    CONSTRAINT "capital_position_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capital_airtable_configs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "base_id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Airtable Base',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_sync_at" TIMESTAMPTZ(6),
    "last_error" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "capital_airtable_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capital_airtable_table_mappings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "config_id" UUID NOT NULL,
    "entity_type" "CapitalAirtableEntityType" NOT NULL,
    "table_name" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "field_map" JSONB,
    "filter_formula" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "capital_airtable_table_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capital_airtable_snapshots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "config_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "sync_run_id" UUID NOT NULL,
    "entity_type" "CapitalAirtableEntityType" NOT NULL,
    "record_id" TEXT NOT NULL,
    "raw_data" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "capital_entity_id" UUID,
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "capital_airtable_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "capital_snowball_snapshots_user_id_snapshot_date_idx" ON "capital_snowball_snapshots"("user_id", "snapshot_date" DESC);

-- CreateIndex
CREATE INDEX "capital_position_snapshots_snapshot_id_idx" ON "capital_position_snapshots"("snapshot_id");

-- CreateIndex
CREATE INDEX "capital_airtable_configs_user_id_is_active_idx" ON "capital_airtable_configs"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "capital_airtable_table_mappings_config_id_is_enabled_idx" ON "capital_airtable_table_mappings"("config_id", "is_enabled");

-- CreateIndex
CREATE UNIQUE INDEX "capital_airtable_table_mappings_config_id_entity_type_key" ON "capital_airtable_table_mappings"("config_id", "entity_type");

-- CreateIndex
CREATE INDEX "capital_airtable_snapshots_config_id_sync_run_id_entity_typ_idx" ON "capital_airtable_snapshots"("config_id", "sync_run_id", "entity_type");

-- CreateIndex
CREATE INDEX "capital_airtable_snapshots_user_id_created_at_idx" ON "capital_airtable_snapshots"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "capital_airtable_snapshots_record_id_config_id_idx" ON "capital_airtable_snapshots"("record_id", "config_id");

-- AddForeignKey
ALTER TABLE "capital_snowball_snapshots" ADD CONSTRAINT "capital_snowball_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "nexus_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capital_position_snapshots" ADD CONSTRAINT "capital_position_snapshots_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "capital_snowball_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capital_airtable_configs" ADD CONSTRAINT "capital_airtable_configs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "nexus_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capital_airtable_table_mappings" ADD CONSTRAINT "capital_airtable_table_mappings_config_id_fkey" FOREIGN KEY ("config_id") REFERENCES "capital_airtable_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capital_airtable_snapshots" ADD CONSTRAINT "capital_airtable_snapshots_config_id_fkey" FOREIGN KEY ("config_id") REFERENCES "capital_airtable_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capital_airtable_snapshots" ADD CONSTRAINT "capital_airtable_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "nexus_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

