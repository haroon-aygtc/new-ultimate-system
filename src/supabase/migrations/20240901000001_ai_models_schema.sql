-- Create AI models table
CREATE TABLE IF NOT EXISTS ai_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  model_id TEXT NOT NULL,
  api_key TEXT,
  endpoint TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  max_tokens INTEGER,
  temperature FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  system_prompt TEXT,
  description TEXT,
  model_id UUID REFERENCES ai_models(id),
  knowledge_base_id UUID,
  status TEXT NOT NULL DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create follow-up questions table
CREATE TABLE IF NOT EXISTS follow_up_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge bases table
CREATE TABLE IF NOT EXISTS knowledge_bases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge base documents table
CREATE TABLE IF NOT EXISTS knowledge_base_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_base_id UUID REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create response formats table
CREATE TABLE IF NOT EXISTS response_formats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create branding settings table
CREATE TABLE IF NOT EXISTS branding_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#3b82f6',
  secondary_color TEXT NOT NULL DEFAULT '#1e3a8a',
  accent_color TEXT NOT NULL DEFAULT '#f97316',
  font_family TEXT NOT NULL DEFAULT 'Inter, sans-serif',
  chat_widget_title TEXT NOT NULL DEFAULT 'Chat with us',
  chat_widget_subtitle TEXT NOT NULL DEFAULT 'Ask us anything',
  chat_widget_position TEXT NOT NULL DEFAULT 'right',
  chat_widget_theme TEXT NOT NULL DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Admin users can do everything with AI models" ON ai_models;
CREATE POLICY "Admin users can do everything with AI models"
  ON ai_models
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin users can do everything with prompts" ON prompts;
CREATE POLICY "Admin users can do everything with prompts"
  ON prompts
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin users can do everything with follow-up questions" ON follow_up_questions;
CREATE POLICY "Admin users can do everything with follow-up questions"
  ON follow_up_questions
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin users can do everything with knowledge bases" ON knowledge_bases;
CREATE POLICY "Admin users can do everything with knowledge bases"
  ON knowledge_bases
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin users can do everything with knowledge base documents" ON knowledge_base_documents;
CREATE POLICY "Admin users can do everything with knowledge base documents"
  ON knowledge_base_documents
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin users can do everything with response formats" ON response_formats;
CREATE POLICY "Admin users can do everything with response formats"
  ON response_formats
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin users can do everything with branding settings" ON branding_settings;
CREATE POLICY "Admin users can do everything with branding settings"
  ON branding_settings
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_models_status ON ai_models(status);
CREATE INDEX IF NOT EXISTS idx_prompts_status ON prompts(status);
CREATE INDEX IF NOT EXISTS idx_prompts_model_id ON prompts(model_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_questions_prompt_id ON follow_up_questions(prompt_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_status ON knowledge_bases(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_documents_kb_id ON knowledge_base_documents(knowledge_base_id);
CREATE INDEX IF NOT EXISTS idx_response_formats_status ON response_formats(status);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE ai_models;
ALTER PUBLICATION supabase_realtime ADD TABLE prompts;
ALTER PUBLICATION supabase_realtime ADD TABLE follow_up_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE knowledge_bases;
ALTER PUBLICATION supabase_realtime ADD TABLE knowledge_base_documents;
ALTER PUBLICATION supabase_realtime ADD TABLE response_formats;
ALTER PUBLICATION supabase_realtime ADD TABLE branding_settings;
