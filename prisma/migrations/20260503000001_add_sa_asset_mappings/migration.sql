-- Migration: add sa_asset_mappings column to capital_mapping_configs
-- Replaces the deprecated sa_category TEXT field with a JSONB array that
-- supports many-to-one SA asset → YNAB account mapping.
--
-- Format: [{"saTicker": "KXF"}, {"saTicker": "VUAA"}, ...]
-- One YNAB account can hold multiple SA assets.

ALTER TABLE "capital_mapping_configs"
  ADD COLUMN IF NOT EXISTS "sa_asset_mappings" JSONB NOT NULL DEFAULT '[]'::jsonb;
