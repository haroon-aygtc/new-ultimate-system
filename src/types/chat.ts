export interface ChatSession {
  id?: string;
  user_id: string;
  started_at?: string;
  ended_at?: string | null;
  status?: "active" | "inactive" | "closed";
  source?: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ChatMessage {
  id?: string;
  session_id: string;
  sender_type: "user" | "system" | "agent";
  content: string;
  attachments?: any[];
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface GuestRegistration {
  id?: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  registration_data?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ChatAnalyticsEvent {
  id?: string;
  session_id: string;
  event_type: string;
  event_data?: Record<string, any>;
  page_url?: string;
  created_at?: string;
}

export interface ChatWidgetSettings {
  id?: string;
  name: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  primary_color?: string;
  title?: string;
  welcome_message?: string;
  offline_message?: string;
  input_placeholder?: string;
  show_branding?: boolean;
  allow_attachments?: boolean;
  enable_history?: boolean;
  hide_on_mobile?: boolean;
  auto_open?: boolean;
  load_delay?: number;
  require_registration?: boolean;
  registration_fields?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
