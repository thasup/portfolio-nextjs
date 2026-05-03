-- Add customTitle and customDescription to capital_airtable_table_mappings

ALTER TABLE "capital_airtable_table_mappings" 
ADD COLUMN IF NOT EXISTS "custom_title" TEXT,
ADD COLUMN IF NOT EXISTS "custom_description" TEXT;

-- Create index for faster lookups by custom title
CREATE INDEX IF NOT EXISTS "capital_airtable_table_mappings_custom_title_idx" 
ON "capital_airtable_table_mappings"("custom_title");
