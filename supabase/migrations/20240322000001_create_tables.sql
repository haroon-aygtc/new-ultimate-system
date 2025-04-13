-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE
);

-- Create guest_sessions table
CREATE TABLE IF NOT EXISTS public.guest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  session_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guest_messages table
CREATE TABLE IF NOT EXISTS public.guest_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.guest_sessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('guest', 'ai')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_models table
CREATE TABLE IF NOT EXISTS public.ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google', 'custom')),
  model_id TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('static', 'active', 'inactive')),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_prompts table
CREATE TABLE IF NOT EXISTS public.ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  model_id UUID REFERENCES public.ai_models(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('static', 'active', 'inactive')),
  variables JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create branding_settings table
CREATE TABLE IF NOT EXISTS public.branding_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_color TEXT NOT NULL DEFAULT '#4A6FA5',
  secondary_color TEXT NOT NULL DEFAULT '#2C3E50',
  accent_color TEXT NOT NULL DEFAULT '#16A085',
  logo_url TEXT,
  brand_name TEXT NOT NULL DEFAULT 'GuestApp',
  tagline TEXT,
  widget_title TEXT NOT NULL DEFAULT 'Chat with us',
  welcome_message TEXT NOT NULL DEFAULT 'Hello! How can we assist you today?',
  input_placeholder TEXT NOT NULL DEFAULT 'Type your message...',
  widget_position TEXT NOT NULL DEFAULT 'bottom-right' CHECK (widget_position IN ('bottom-right', 'bottom-left')),
  corner_radius INTEGER NOT NULL DEFAULT 8,
  header_opacity INTEGER NOT NULL DEFAULT 100,
  show_avatar BOOLEAN NOT NULL DEFAULT true,
  offline_message TEXT,
  timeout_message TEXT,
  error_message TEXT,
  enable_markdown BOOLEAN NOT NULL DEFAULT true,
  enable_code_highlighting BOOLEAN NOT NULL DEFAULT true,
  enable_emojis BOOLEAN NOT NULL DEFAULT true,
  enable_link_preview BOOLEAN NOT NULL DEFAULT false,
  ai_persona TEXT,
  ai_tone TEXT DEFAULT 'friendly' CHECK (ai_tone IN ('formal', 'casual', 'friendly', 'professional')),
  ai_knowledge_level TEXT DEFAULT 'expert' CHECK (ai_knowledge_level IN ('basic', 'intermediate', 'expert')),
  ai_response_length TEXT DEFAULT 'balanced' CHECK (ai_response_length IN ('concise', 'balanced', 'detailed')),
  ai_custom_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create response_templates table
CREATE TABLE IF NOT EXISTS public.response_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scraping_projects table
CREATE TABLE IF NOT EXISTS public.scraping_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  target_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('static', 'active', 'inactive')),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scraping_results table
CREATE TABLE IF NOT EXISTS public.scraping_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.scraping_projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'failed')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  error TEXT,
  pages_scraped INTEGER NOT NULL DEFAULT 0,
  items_scraped INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.response_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraping_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraping_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
CREATE POLICY "Admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can update users" ON public.users;
CREATE POLICY "Admins can update users"
  ON public.users FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
CREATE POLICY "Admins can delete users"
  ON public.users FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Guest sessions policies
DROP POLICY IF EXISTS "Authenticated users can view guest sessions" ON public.guest_sessions;
CREATE POLICY "Authenticated users can view guest sessions"
  ON public.guest_sessions FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert guest sessions" ON public.guest_sessions;
CREATE POLICY "Authenticated users can insert guest sessions"
  ON public.guest_sessions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update guest sessions" ON public.guest_sessions;
CREATE POLICY "Authenticated users can update guest sessions"
  ON public.guest_sessions FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete guest sessions" ON public.guest_sessions;
CREATE POLICY "Authenticated users can delete guest sessions"
  ON public.guest_sessions FOR DELETE
  USING (auth.role() = 'authenticated');

-- Guest messages policies
DROP POLICY IF EXISTS "Authenticated users can view guest messages" ON public.guest_messages;
CREATE POLICY "Authenticated users can view guest messages"
  ON public.guest_messages FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert guest messages" ON public.guest_messages;
CREATE POLICY "Authenticated users can insert guest messages"
  ON public.guest_messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update guest messages" ON public.guest_messages;
CREATE POLICY "Authenticated users can update guest messages"
  ON public.guest_messages FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete guest messages" ON public.guest_messages;
CREATE POLICY "Authenticated users can delete guest messages"
  ON public.guest_messages FOR DELETE
  USING (auth.role() = 'authenticated');

-- Enable realtime for relevant tables
alter publication supabase_realtime add table guest_sessions;
alter publication supabase_realtime add table guest_messages;
