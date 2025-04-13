-- Chat Widget Tables

-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_id UUID,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL, -- 'user', 'guest', 'system', 'ai'
  sender_id UUID,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Guest Registration Table
CREATE TABLE IF NOT EXISTS guest_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Chat Analytics Table
CREATE TABLE IF NOT EXISTS chat_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page_url TEXT,
  user_agent TEXT
);

-- Chat Widget Settings Table
CREATE TABLE IF NOT EXISTS chat_widget_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID,
  position VARCHAR(20) DEFAULT 'bottom-right',
  primary_color VARCHAR(20) DEFAULT '#4A6FA5',
  title VARCHAR(100) DEFAULT 'Chat with us',
  welcome_message TEXT DEFAULT 'Hello! How can I help you today?',
  offline_message TEXT DEFAULT 'We''re currently offline. Please leave a message and we''ll get back to you.',
  input_placeholder VARCHAR(100) DEFAULT 'Type your message...',
  show_branding BOOLEAN DEFAULT true,
  allow_attachments BOOLEAN DEFAULT false,
  enable_history BOOLEAN DEFAULT true,
  require_registration BOOLEAN DEFAULT true,
  registration_fields JSONB DEFAULT '["name", "phone"]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for chat tables
alter publication supabase_realtime add table chat_sessions;
alter publication supabase_realtime add table chat_messages;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_guest_id ON chat_sessions(guest_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_analytics_session_id ON chat_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_analytics_event_type ON chat_analytics(event_type);
