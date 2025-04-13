-- Create chat_sessions table to track user conversations
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES guest_users(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  source VARCHAR(100),
  referrer VARCHAR(255),
  user_agent TEXT,
  ip_address VARCHAR(45),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_messages table to store all messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) CHECK (sender_type IN ('user', 'system', 'agent')),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create guest_registrations table for visitor information
CREATE TABLE IF NOT EXISTS guest_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES guest_users(id),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  source VARCHAR(100),
  registration_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_analytics table for tracking events
CREATE TABLE IF NOT EXISTS chat_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  page_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_widget_settings table for customization
CREATE TABLE IF NOT EXISTS chat_widget_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  position VARCHAR(20) DEFAULT 'bottom-right' CHECK (position IN ('bottom-right', 'bottom-left', 'top-right', 'top-left')),
  primary_color VARCHAR(20) DEFAULT '#4A6FA5',
  title VARCHAR(100) DEFAULT 'Chat with us',
  welcome_message TEXT DEFAULT 'Hello! How can I help you today?',
  offline_message TEXT DEFAULT 'We''re currently offline. Please leave a message and we''ll get back to you.',
  input_placeholder VARCHAR(100) DEFAULT 'Type your message...',
  show_branding BOOLEAN DEFAULT true,
  allow_attachments BOOLEAN DEFAULT false,
  enable_history BOOLEAN DEFAULT true,
  hide_on_mobile BOOLEAN DEFAULT false,
  auto_open BOOLEAN DEFAULT false,
  load_delay INTEGER DEFAULT 1000,
  require_registration BOOLEAN DEFAULT true,
  registration_fields JSONB DEFAULT '["name", "phone"]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_guest_registrations_user_id ON guest_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_analytics_session_id ON chat_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_analytics_event_type ON chat_analytics(event_type);

-- Enable row level security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_widget_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_sessions
DROP POLICY IF EXISTS "Admins can see all chat sessions" ON chat_sessions;
CREATE POLICY "Admins can see all chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Users can see their own chat sessions" ON chat_sessions;
CREATE POLICY "Users can see their own chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Create policies for chat_messages
DROP POLICY IF EXISTS "Admins can see all chat messages" ON chat_messages;
CREATE POLICY "Admins can see all chat messages"
  ON chat_messages FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Users can see messages from their sessions" ON chat_messages;
CREATE POLICY "Users can see messages from their sessions"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Create policies for guest_registrations
DROP POLICY IF EXISTS "Admins can see all guest registrations" ON guest_registrations;
CREATE POLICY "Admins can see all guest registrations"
  ON guest_registrations FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Users can see their own registrations" ON guest_registrations;
CREATE POLICY "Users can see their own registrations"
  ON guest_registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Create policies for chat_analytics
DROP POLICY IF EXISTS "Admins can see all chat analytics" ON chat_analytics;
CREATE POLICY "Admins can see all chat analytics"
  ON chat_analytics FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for chat_widget_settings
DROP POLICY IF EXISTS "Admins can manage widget settings" ON chat_widget_settings;
CREATE POLICY "Admins can manage widget settings"
  ON chat_widget_settings FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Everyone can view active widget settings" ON chat_widget_settings;
CREATE POLICY "Everyone can view active widget settings"
  ON chat_widget_settings FOR SELECT
  USING (is_active = true);

-- Enable realtime for chat_sessions and chat_messages
alter publication supabase_realtime add table chat_sessions;
alter publication supabase_realtime add table chat_messages;

-- Insert default widget settings
INSERT INTO chat_widget_settings (name, title, welcome_message)
VALUES ('Default Widget', 'Chat with GuestApp', 'Welcome to GuestApp! How can we assist you today?')
ON CONFLICT DO NOTHING;
