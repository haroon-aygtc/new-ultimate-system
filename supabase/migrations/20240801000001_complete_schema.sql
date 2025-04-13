-- Create auth_users table if not exists
CREATE TABLE IF NOT EXISTS auth_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('guest', 'user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guest_users table if not exists
CREATE TABLE IF NOT EXISTS guest_users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('guest', 'user', 'admin')) DEFAULT 'guest',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_to_user_id UUID REFERENCES auth_users(id)
);

-- Create guest_sessions table if not exists
CREATE TABLE IF NOT EXISTS guest_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES guest_users(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create chat_messages table if not exists
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES guest_sessions(id),
  content TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create branding_settings table if not exists
CREATE TABLE IF NOT EXISTS branding_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  widget_title TEXT NOT NULL,
  welcome_message TEXT NOT NULL,
  input_placeholder TEXT NOT NULL,
  widget_position TEXT NOT NULL CHECK (widget_position IN ('bottom-right', 'bottom-left')),
  corner_radius INTEGER NOT NULL,
  header_opacity INTEGER NOT NULL,
  show_avatar BOOLEAN NOT NULL,
  offline_message TEXT NOT NULL,
  timeout_message TEXT NOT NULL,
  error_message TEXT NOT NULL,
  enable_markdown BOOLEAN NOT NULL,
  enable_code_highlighting BOOLEAN NOT NULL,
  enable_emojis BOOLEAN NOT NULL,
  enable_link_preview BOOLEAN NOT NULL,
  ai_persona TEXT,
  ai_tone TEXT CHECK (ai_tone IN ('formal', 'casual', 'friendly', 'professional')),
  ai_knowledge_level TEXT CHECK (ai_knowledge_level IN ('basic', 'intermediate', 'expert')),
  ai_response_length TEXT CHECK (ai_response_length IN ('concise', 'balanced', 'detailed')),
  ai_custom_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create response_templates table if not exists
CREATE TABLE IF NOT EXISTS response_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_models table if not exists
CREATE TABLE IF NOT EXISTS ai_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive', 'Testing')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create follow_up_questions table if not exists
CREATE TABLE IF NOT EXISTS follow_up_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('start', 'middle', 'end')),
  ai_model_id TEXT NOT NULL REFERENCES ai_models(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create follow_up_options table if not exists
CREATE TABLE IF NOT EXISTS follow_up_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES follow_up_questions(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_base_articles table if not exists
CREATE TABLE IF NOT EXISTS knowledge_base_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  ai_model_id TEXT NOT NULL REFERENCES ai_models(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_articles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Auth users policies
DROP POLICY IF EXISTS "Admins can read all auth users" ON auth_users;
CREATE POLICY "Admins can read all auth users"
  ON auth_users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Admins can insert auth users" ON auth_users;
CREATE POLICY "Admins can insert auth users"
  ON auth_users FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Admins can update auth users" ON auth_users;
CREATE POLICY "Admins can update auth users"
  ON auth_users FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

-- Guest users policies
DROP POLICY IF EXISTS "Admins can read all guest users" ON guest_users;
CREATE POLICY "Admins can read all guest users"
  ON guest_users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Anyone can insert guest users" ON guest_users;
CREATE POLICY "Anyone can insert guest users"
  ON guest_users FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update guest users" ON guest_users;
CREATE POLICY "Admins can update guest users"
  ON guest_users FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

-- Enable realtime for all tables
alter publication supabase_realtime add table auth_users;
alter publication supabase_realtime add table guest_users;
alter publication supabase_realtime add table guest_sessions;
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table branding_settings;
alter publication supabase_realtime add table response_templates;
alter publication supabase_realtime add table ai_models;
alter publication supabase_realtime add table follow_up_questions;
alter publication supabase_realtime add table follow_up_options;
alter publication supabase_realtime add table knowledge_base_articles;