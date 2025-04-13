-- Add template column to prompts table
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS template TEXT;

-- Update existing prompts to use content as template
UPDATE prompts SET template = content WHERE template IS NULL;

-- Enable realtime for prompts table
alter publication supabase_realtime add table prompts;
