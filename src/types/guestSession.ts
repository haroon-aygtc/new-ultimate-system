export interface GuestUser {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  last_active_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  sender_type: "user" | "system";
  created_at: string;
}

export interface GuestSession {
  id: string;
  user_id: string;
  status: "active" | "inactive";
  created_at: string;
  last_active_at: string;
  metadata?: Record<string, any>;
  user?: GuestUser;
  messages?: ChatMessage[];
}

export interface GuestSessionCreateParams {
  name: string;
  phone: string;
  metadata?: Record<string, any>;
}
