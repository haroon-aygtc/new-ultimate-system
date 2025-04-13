-- Add AI persona fields to branding_settings table
ALTER TABLE branding_settings
ADD COLUMN IF NOT EXISTS ai_persona VARCHAR DEFAULT 'A helpful AI assistant',
ADD COLUMN IF NOT EXISTS ai_tone VARCHAR DEFAULT 'friendly',
ADD COLUMN IF NOT EXISTS ai_knowledge_level VARCHAR DEFAULT 'expert',
ADD COLUMN IF NOT EXISTS ai_response_length VARCHAR DEFAULT 'balanced',
ADD COLUMN IF NOT EXISTS ai_custom_instructions TEXT DEFAULT '';

-- Enable realtime for these changes
alter publication supabase_realtime add table branding_settings;
