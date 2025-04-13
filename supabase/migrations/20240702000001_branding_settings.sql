-- Create branding_settings table
CREATE TABLE IF NOT EXISTS branding_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  primary_color VARCHAR NOT NULL,
  secondary_color VARCHAR NOT NULL,
  accent_color VARCHAR NOT NULL,
  logo_url TEXT NOT NULL,
  brand_name VARCHAR NOT NULL,
  tagline VARCHAR NOT NULL,
  widget_title VARCHAR NOT NULL,
  welcome_message TEXT NOT NULL,
  input_placeholder VARCHAR NOT NULL,
  widget_position VARCHAR NOT NULL,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
DROP POLICY IF EXISTS "Admin users can manage branding settings" ON branding_settings;
CREATE POLICY "Admin users can manage branding settings"
  ON branding_settings
  USING (EXISTS (
    SELECT 1 FROM auth_users
    WHERE auth_users.id = auth.uid() AND auth_users.role = 'admin'
  ));

-- Create policy for read access
DROP POLICY IF EXISTS "All users can view branding settings" ON branding_settings;
CREATE POLICY "All users can view branding settings"
  ON branding_settings
  FOR SELECT
  USING (true);

-- Enable realtime
alter publication supabase_realtime add table branding_settings;
