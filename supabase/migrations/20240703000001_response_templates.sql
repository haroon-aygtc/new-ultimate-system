-- Create response_templates table
CREATE TABLE IF NOT EXISTS response_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some default templates
INSERT INTO response_templates (name, description, template, is_active)
VALUES 
  ('Standard Response', 'Basic response with greeting and answer', 'Hello {{user.name}},\n\n{{response.content}}\n\nIs there anything else I can help with?', true),
  ('Detailed Response', 'Comprehensive response with sources', 'Hello {{user.name}},\n\n{{response.content}}\n\nSources: {{response.sources}}\n\nPlease let me know if you need more information.', false),
  ('Concise Response', 'Brief, to-the-point answers', '{{response.content}}', false),
  ('Step-by-Step Guide', 'Instructions in numbered steps', 'Here''s how to {{query.topic}}:\n\n{{response.steps}}', false);

-- Enable RLS
ALTER TABLE response_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Admins can do anything" ON response_templates;
CREATE POLICY "Admins can do anything"
  ON response_templates
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE response_templates;