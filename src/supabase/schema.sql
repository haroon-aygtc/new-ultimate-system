-- Create guest_users table
CREATE TABLE guest_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guest_sessions table
CREATE TABLE guest_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES guest_users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES guest_sessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_guest_sessions_user_id ON guest_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_guest_users_phone ON guest_users(phone);

-- Create RLS policies
ALTER TABLE guest_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access)
CREATE POLICY "Authenticated users can read all guest_users"
  ON guest_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert guest_users"
  ON guest_users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update guest_users"
  ON guest_users FOR UPDATE
  TO authenticated
  USING (true);

-- Similar policies for guest_sessions and chat_messages
CREATE POLICY "Authenticated users can read all guest_sessions"
  ON guest_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert guest_sessions"
  ON guest_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update guest_sessions"
  ON guest_sessions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read all chat_messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert chat_messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for anonymous users (limited access)
CREATE POLICY "Anonymous users can insert guest_users"
  ON guest_users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can insert guest_sessions"
  ON guest_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can insert chat_messages"
  ON chat_messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anonymous users can only read their own data (based on session cookie or token)
CREATE POLICY "Anonymous users can read their own guest_users"
  ON guest_users FOR SELECT
  TO anon
  USING (id IN (
    SELECT user_id FROM guest_sessions WHERE id = current_setting('request.session_id', true)::UUID
  ));

CREATE POLICY "Anonymous users can read their own guest_sessions"
  ON guest_sessions FOR SELECT
  TO anon
  USING (id = current_setting('request.session_id', true)::UUID);

CREATE POLICY "Anonymous users can read their own chat_messages"
  ON chat_messages FOR SELECT
  TO anon
  USING (session_id = current_setting('request.session_id', true)::UUID);
