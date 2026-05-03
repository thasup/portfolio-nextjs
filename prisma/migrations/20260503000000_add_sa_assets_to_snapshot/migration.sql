-- Add saAssets column to capital_snapshots for storing full asset-level snapshot data
ALTER TABLE "capital_snapshots" ADD COLUMN IF NOT EXISTS "sa_assets" JSONB;

-- Add comment explaining the field structure
COMMENT ON COLUMN "capital_snapshots"."sa_assets" IS 'Full asset details per snapshot: array of {ticker, name, categoryId, investedValue, currentValue, currency, shares}';
