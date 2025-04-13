// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: "admin" | "user";
  created_at: string;
  last_sign_in?: string;
  status: "active" | "inactive" | "pending";
}

// Guest Session types
export interface GuestSession {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  session_id: string;
  created_at: string;
  last_active: string;
  status: "active" | "inactive" | "completed";
  metadata?: Record<string, any>;
}

export interface GuestMessage {
  id: string;
  session_id: string;
  content: string;
  sender_type: "guest" | "ai";
  created_at: string;
  metadata?: Record<string, any>;
}

// AI Model types
export interface AIModel {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "google" | "custom";
  model_id: string;
  description?: string;
  status: "static" | "active" | "inactive";
  created_at: string;
  updated_at: string;
  config: AIModelConfig;
}

export interface AIModelConfig {
  api_key?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop_sequences?: string[];
  custom_endpoint?: string;
  additional_params?: Record<string, any>;
}

export interface AIPrompt {
  id: string;
  name: string;
  description?: string;
  prompt_text: string;
  model_id: string;
  status: "static" | "active" | "inactive";
  created_at: string;
  updated_at: string;
  variables?: string[];
}

// Branding types
export interface BrandingSettings {
  id?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string;
  brand_name: string;
  tagline: string;
  widget_title: string;
  welcome_message: string;
  input_placeholder: string;
  widget_position: "bottom-right" | "bottom-left";
  corner_radius: number;
  header_opacity: number;
  show_avatar: boolean;
  offline_message: string;
  timeout_message: string;
  error_message: string;
  enable_markdown: boolean;
  enable_code_highlighting: boolean;
  enable_emojis: boolean;
  enable_link_preview: boolean;
  ai_persona?: string;
  ai_tone?: "formal" | "casual" | "friendly" | "professional";
  ai_knowledge_level?: "basic" | "intermediate" | "expert";
  ai_response_length?: "concise" | "balanced" | "detailed";
  ai_custom_instructions?: string;
}

export interface ResponseTemplate {
  id?: string;
  name: string;
  description: string;
  template: string;
  is_active: boolean;
}

// Scraping types
export interface ScrapingProject {
  id: string;
  name: string;
  description?: string;
  target_url: string;
  status: "static" | "active" | "inactive";
  created_at: string;
  updated_at: string;
  last_run?: string;
  config: ScrapingConfig;
}

export interface ScrapingConfig {
  selector_groups: SelectorGroup[];
  pagination?: PaginationConfig;
  authentication?: AuthenticationConfig;
  rate_limit?: number; // in milliseconds
  timeout?: number; // in milliseconds
  user_agent?: string;
  proxy?: string;
  cookies?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface SelectorGroup {
  id: string;
  name: string;
  selector: string;
  type: "text" | "attribute" | "html";
  attribute?: string;
  is_array: boolean;
  children?: SelectorGroup[];
}

export interface PaginationConfig {
  type: "url" | "button" | "infinite_scroll";
  selector?: string;
  max_pages?: number;
  url_pattern?: string;
}

export interface AuthenticationConfig {
  type: "basic" | "form" | "cookie";
  username?: string;
  password?: string;
  form_selector?: string;
  username_selector?: string;
  password_selector?: string;
  submit_selector?: string;
  cookies?: Record<string, string>;
}

export interface ScrapingResult {
  id: string;
  project_id: string;
  status: "success" | "partial" | "failed";
  created_at: string;
  completed_at?: string;
  data: any;
  error?: string;
  pages_scraped: number;
  items_scraped: number;
}

// Audit Log types
export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
