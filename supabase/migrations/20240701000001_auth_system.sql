-- Create enum type for user roles
CREATE TYPE user_role AS ENUM ('guest', 'user', 'admin');

-- Create guest_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS guest_users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'guest',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_to_user_id UUID
);

-- Create auth_users table for regular and admin users
CREATE TABLE IF NOT EXISTS auth_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guest_sessions table
CREATE TABLE IF NOT EXISTS guest_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES guest_users(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES guest_sessions(id),
  content TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE guest_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for guest_users
DROP POLICY IF EXISTS "Admins can view all guest users" ON guest_users;
CREATE POLICY "Admins can view all guest users"
  ON guest_users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Admins can insert guest users" ON guest_users;
CREATE POLICY "Admins can insert guest users"
  ON guest_users FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin') OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Admins can update guest users" ON guest_users;
CREATE POLICY "Admins can update guest users"
  ON guest_users FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

-- Create policies for auth_users
DROP POLICY IF EXISTS "Admins can view all auth users" ON auth_users;
CREATE POLICY "Admins can view all auth users"
  ON auth_users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can view their own auth user" ON auth_users;
CREATE POLICY "Users can view their own auth user"
  ON auth_users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update auth users" ON auth_users;
CREATE POLICY "Admins can update auth users"
  ON auth_users FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

-- Create policies for guest_sessions
DROP POLICY IF EXISTS "Admins can view all guest sessions" ON guest_sessions;
CREATE POLICY "Admins can view all guest sessions"
  ON guest_sessions FOR SELECT
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Anyone can insert guest sessions" ON guest_sessions;
CREATE POLICY "Anyone can insert guest sessions"
  ON guest_sessions FOR INSERT
  WITH CHECK (true);

-- Create policies for chat_messages
DROP POLICY IF EXISTS "Admins can view all chat messages" ON chat_messages;
CREATE POLICY "Admins can view all chat messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() IN (SELECT id FROM auth_users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Anyone can insert chat messages" ON chat_messages;
CREATE POLICY "Anyone can insert chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (true);

-- Enable realtime for tables
alter publication supabase_realtime add table guest_users;
alter publication supabase_realtime add table auth_users;
alter publication supabase_realtime add table guest_sessions;
alter publication supabase_realtime add table chat_messages;