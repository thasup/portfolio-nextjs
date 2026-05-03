-- Migration: Add global user preferences to capital_settings
-- Adds support for:
-- - Multi-currency with preferred display currency
-- - Number format preferences (locale-based)
-- - Date format preferences
-- - Theme preference (dark/light)
-- - FX rate cache timestamp

ALTER TABLE "capital_settings"
  ADD COLUMN IF NOT EXISTS "preferred_currency" TEXT NOT NULL DEFAULT 'THB',
  ADD COLUMN IF NOT EXISTS "number_format" TEXT NOT NULL DEFAULT 'en-US',
  ADD COLUMN IF NOT EXISTS "date_format" TEXT NOT NULL DEFAULT 'YYYY-MM-DD',
  ADD COLUMN IF NOT EXISTS "theme" TEXT NOT NULL DEFAULT 'dark',
  ADD COLUMN IF NOT EXISTS "fx_rates_updated_at" TIMESTAMPTZ(6);

-- Add check constraints for valid values
ALTER TABLE "capital_settings"
  ADD CONSTRAINT "capital_settings_theme_check" 
    CHECK (theme IN ('dark', 'light'));

-- Create index for FX rate staleness checks
CREATE INDEX IF NOT EXISTS "capital_settings_fx_cache_idx" 
  ON "capital_settings"("fx_rates_updated_at");

-- Comment on new columns
COMMENT ON COLUMN "capital_settings"."preferred_currency" IS 'ISO 4217 currency code (e.g., THB, USD, EUR)';
COMMENT ON COLUMN "capital_settings"."number_format" IS 'BCP 47 locale for number formatting (e.g., en-US, th-TH)';
COMMENT ON COLUMN "capital_settings"."date_format" IS 'Date format string (YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY)';
COMMENT ON COLUMN "capital_settings"."theme" IS 'UI theme preference: dark (default) or light';
COMMENT ON COLUMN "capital_settings"."fx_rates_updated_at" IS 'Timestamp of last FX rate fetch for cache invalidation';
