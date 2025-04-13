// AI Model types
export interface AIModel {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "google" | "custom";
  model_id: string;
  api_key?: string;
  endpoint?: string;
  status: "active" | "inactive" | "static";
  description?: string;
  max_tokens?: number;
  temperature?: number;
  created_at: string;
  updated_at?: string;
}

// Prompt types
export interface Prompt {
  id: string;
  title: string;
  content: string; // Keeping for backward compatibility
  template?: string; // New field for template with variables
  model_id: string;
  status: "active" | "inactive" | "static";
  description?: string;
  created_at: string;
  updated_at?: string;
  system_prompt?: string;
  knowledge_base_id?: string;
  follow_up_questions?: FollowUpQuestion[];
}

// Knowledge Base types
export interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive" | "static";
  created_at: string;
  updated_at?: string;
  documents?: KnowledgeBaseDocument[];
}

export interface KnowledgeBaseDocument {
  id: string;
  knowledge_base_id: string;
  title: string;
  content: string;
  source_url?: string;
  created_at: string;
  updated_at?: string;
}

// Follow-up Question types
export interface FollowUpQuestion {
  id: string;
  prompt_id: string;
  question: string;
  order: number;
  created_at: string;
  updated_at?: string;
}

// Guest Session types
export interface GuestSession {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  status: "active" | "inactive" | "completed";
  created_at: string;
  last_active_at: string;
  messages?: GuestMessage[];
}

export interface GuestMessage {
  id: string;
  session_id: string;
  content: string;
  sender: "guest" | "ai";
  created_at: string;
  prompt_id?: string;
}

// Audit Log types
export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  user_id?: string;
  user_name?: string;
  details?: Record<string, any>;
  created_at: string;
}

// Branding types
export interface BrandingSettings {
  id: string;
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  brand_name: string;
  widget_title: string;
  welcome_message: string;
  input_placeholder: string;
  corner_radius: number;
  header_opacity: number;
  show_avatar: boolean;
  created_at: string;
  updated_at?: string;
}

// Response Template types
export interface ResponseTemplate {
  id: string;
  name: string;
  template: string;
  description?: string;
  status: "active" | "inactive" | "static";
  created_at: string;
  updated_at?: string;
}

// Scraping types
export interface ScrapingProject {
  id: string;
  name: string;
  target_url: string;
  description?: string;
  status: "active" | "inactive" | "static";
  created_at: string;
  last_run?: string;
  selectors?: ScrapingSelector[];
}

export interface ScrapingSelector {
  id: string;
  project_id: string;
  name: string;
  selector: string;
  attribute?: string;
  group_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface ScrapingResult {
  id: string;
  project_id: string;
  result_data: Record<string, any>;
  created_at: string;
}

// Chat types
export * from "./chat";
