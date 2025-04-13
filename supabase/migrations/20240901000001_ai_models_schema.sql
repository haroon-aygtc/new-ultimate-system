-- Create AI models table
CREATE TABLE IF NOT EXISTS ai_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  model_id TEXT NOT NULL,
  api_key TEXT,
  endpoint TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  description TEXT,
  max_tokens INTEGER,
  temperature FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  model_id UUID NOT NULL REFERENCES ai_models(id),
  status TEXT NOT NULL DEFAULT 'inactive',
  description TEXT,
  system_prompt TEXT,
  knowledge_base_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create follow-up questions table
CREATE TABLE IF NOT EXISTS follow_up_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create knowledge base table
CREATE TABLE IF NOT EXISTS knowledge_bases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create knowledge base documents table
CREATE TABLE IF NOT EXISTS knowledge_base_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_base_id UUID NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable row-level security
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can do everything with AI models"
  ON ai_models
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admins can do everything with prompts"
  ON prompts
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admins can do everything with follow-up questions"
  ON follow_up_questions
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admins can do everything with knowledge bases"
  ON knowledge_bases
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admins can do everything with knowledge base documents"
  ON knowledge_base_documents
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

-- Create policies for regular users to read active models and prompts
CREATE POLICY "Users can read active AI models"
  ON ai_models FOR SELECT
  USING (status = 'active' OR auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Users can read active prompts"
  ON prompts FOR SELECT
  USING (status = 'active' OR auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Users can read follow-up questions for active prompts"
  ON follow_up_questions FOR SELECT
  USING (prompt_id IN (SELECT id FROM prompts WHERE status = 'active') OR 
         auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Users can read active knowledge bases"
  ON knowledge_bases FOR SELECT
  USING (status = 'active' OR auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Users can read knowledge base documents for active knowledge bases"
  ON knowledge_base_documents FOR SELECT
  USING (knowledge_base_id IN (SELECT id FROM knowledge_bases WHERE status = 'active') OR 
         auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

-- Add to realtime publication
alter publication supabase_realtime add table ai_models;
alter publication supabase_realtime add table prompts;
alter publication supabase_realtime add table follow_up_questions;
alter publication supabase_realtime add table knowledge_bases;
alter publication supabase_realtime add table knowledge_base_documents;
