-- Ensure custom fields exist on capital_airtable_table_mappings
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'capital_airtable_table_mappings' 
        AND column_name = 'custom_title'
    ) THEN
        ALTER TABLE "capital_airtable_table_mappings" ADD COLUMN "custom_title" TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'capital_airtable_table_mappings' 
        AND column_name = 'custom_description'
    ) THEN
        ALTER TABLE "capital_airtable_table_mappings" ADD COLUMN "custom_description" TEXT;
    END IF;
END $$;
