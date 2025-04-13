-- This file contains the complete database schema for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auth Users Table
CREATE TABLE IF NOT EXISTS auth_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE,
  name TEXT,
  phone TEXT
);

-- Guest Users Table
CREATE TABLE IF NOT EXISTS guest_users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'guest' CHECK (role IN ('guest')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE,
  converted_to_user_id UUID REFERENCES auth_users(id) ON DELETE SET NULL
);

-- Users Table (for admin management)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'))
);

-- Guest Sessions Table
CREATE TABLE IF NOT EXISTS guest_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  session_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  metadata JSONB,
  converted_to_user_id UUID REFERENCES auth_users(id) ON DELETE SET NULL
);

-- Guest Messages Table
CREATE TABLE IF NOT EXISTS guest_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL REFERENCES guest_sessions(session_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('guest', 'ai')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- AI Models Table
CREATE TABLE IF NOT EXISTS ai_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  provider TEXT NOT NULL,
  model_id TEXT NOT NULL,
  api_key_variable TEXT,
  base_url TEXT,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'static')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  parameters JSONB,
  metadata JSONB
);

-- Knowledge Bases Table
CREATE TABLE IF NOT EXISTS knowledge_bases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'static')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Knowledge Base Documents Table
CREATE TABLE IF NOT EXISTS knowledge_base_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_base_id UUID NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Response Formats Table
CREATE TABLE IF NOT EXISTS response_formats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'static')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Prompts Table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  model_id UUID REFERENCES ai_models(id) ON DELETE SET NULL,
  knowledge_base_id UUID REFERENCES knowledge_bases(id) ON DELETE SET NULL,
  response_format_id UUID REFERENCES response_formats(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'static')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Follow-up Questions Table
CREATE TABLE IF NOT EXISTS follow_up_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Branding Settings Table
CREATE TABLE IF NOT EXISTS branding_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  font_family TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'static')),
  metadata JSONB
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Scraping Projects Table
CREATE TABLE IF NOT EXISTS scraping_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  target_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'static')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_run TIMESTAMP WITH TIME ZONE,
  config JSONB NOT NULL
);

-- Scraping Results Table
CREATE TABLE IF NOT EXISTS scraping_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES scraping_projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  data JSONB NOT NULL,
  error TEXT,
  pages_scraped INTEGER NOT NULL DEFAULT 0,
  items_scraped INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_results ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin users can do anything" ON auth_users
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON guest_users
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON users
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON guest_sessions
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON guest_messages
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON ai_models
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON knowledge_bases
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON knowledge_base_documents
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON response_formats
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON prompts
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON follow_up_questions
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON branding_settings
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON system_settings
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON scraping_projects
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

CREATE POLICY "Admin users can do anything" ON scraping_results
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

-- Create policies for regular users
CREATE POLICY "Users can read their own data" ON auth_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON auth_users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for public access to certain tables
CREATE POLICY "Public read access to active AI models" ON ai_models
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public read access to active knowledge bases" ON knowledge_bases
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public read access to documents in active knowledge bases" ON knowledge_base_documents
  FOR SELECT USING (
    knowledge_base_id IN (SELECT id FROM knowledge_bases WHERE status = 'active')
  );

CREATE POLICY "Public read access to active response formats" ON response_formats
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public read access to active prompts" ON prompts
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public read access to follow-up questions for active prompts" ON follow_up_questions
  FOR SELECT USING (
    prompt_id IN (SELECT id FROM prompts WHERE status = 'active')
  );

CREATE POLICY "Public read access to active branding settings" ON branding_settings
  FOR SELECT USING (status = 'active');

-- Enable realtime subscriptions for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE guest_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE guest_messages;
