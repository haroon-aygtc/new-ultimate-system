import { supabase } from "@/lib/supabaseClient";
import { handleSupabaseError } from "@/lib/supabaseHelpers";

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

// Chat Sessions
export const createChatSession = async (sessionData: ChatSession) => {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert([sessionData])
      .select()
      .single();

    if (error) throw error;
    return { session: data, error: null };
  } catch (error) {
    return {
      session: null,
      error: handleSupabaseError(error, "creating chat session"),
    };
  }
};

export const getChatSession = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error) throw error;
    return { session: data, error: null };
  } catch (error) {
    return {
      session: null,
      error: handleSupabaseError(error, "fetching chat session"),
    };
  }
};

export const updateChatSession = async (
  sessionId: string,
  updates: Partial<ChatSession>,
) => {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .select()
      .single();

    if (error) throw error;
    return { session: data, error: null };
  } catch (error) {
    return {
      session: null,
      error: handleSupabaseError(error, "updating chat session"),
    };
  }
};

export const closeChatSession = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .update({
        status: "closed",
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .select()
      .single();

    if (error) throw error;
    return { session: data, error: null };
  } catch (error) {
    return {
      session: null,
      error: handleSupabaseError(error, "closing chat session"),
    };
  }
};

export const getUserChatSessions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { sessions: data, error: null };
  } catch (error) {
    return {
      sessions: [],
      error: handleSupabaseError(error, "fetching user chat sessions"),
    };
  }
};

// Chat Messages
export const addChatMessage = async (messageData: ChatMessage) => {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;
    return { message: data, error: null };
  } catch (error) {
    return {
      message: null,
      error: handleSupabaseError(error, "adding chat message"),
    };
  }
};

export const getSessionMessages = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { messages: data, error: null };
  } catch (error) {
    return {
      messages: [],
      error: handleSupabaseError(error, "fetching session messages"),
    };
  }
};

// Guest Registration
export const registerGuest = async (registrationData: GuestRegistration) => {
  try {
    const { data, error } = await supabase
      .from("guest_registrations")
      .insert([registrationData])
      .select()
      .single();

    if (error) throw error;
    return { registration: data, error: null };
  } catch (error) {
    return {
      registration: null,
      error: handleSupabaseError(error, "registering guest"),
    };
  }
};

export const getGuestRegistration = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("guest_registrations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return { registration: data, error: null };
  } catch (error) {
    return {
      registration: null,
      error: handleSupabaseError(error, "fetching guest registration"),
    };
  }
};

// Chat Analytics
export const trackAnalyticsEvent = async (eventData: ChatAnalyticsEvent) => {
  try {
    const { data, error } = await supabase
      .from("chat_analytics")
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;
    return { event: data, error: null };
  } catch (error) {
    return {
      event: null,
      error: handleSupabaseError(error, "tracking analytics event"),
    };
  }
};

export const getSessionAnalytics = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from("chat_analytics")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { events: data, error: null };
  } catch (error) {
    return {
      events: [],
      error: handleSupabaseError(error, "fetching session analytics"),
    };
  }
};

// Widget Settings
export const getActiveWidgetSettings = async () => {
  try {
    const { data, error } = await supabase
      .from("chat_widget_settings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return { settings: data, error: null };
  } catch (error) {
    return {
      settings: null,
      error: handleSupabaseError(error, "fetching widget settings"),
    };
  }
};

export const getAllWidgetSettings = async () => {
  try {
    const { data, error } = await supabase
      .from("chat_widget_settings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { settings: data, error: null };
  } catch (error) {
    return {
      settings: [],
      error: handleSupabaseError(error, "fetching all widget settings"),
    };
  }
};

export const createWidgetSettings = async (
  settingsData: ChatWidgetSettings,
) => {
  try {
    const { data, error } = await supabase
      .from("chat_widget_settings")
      .insert([settingsData])
      .select()
      .single();

    if (error) throw error;
    return { settings: data, error: null };
  } catch (error) {
    return {
      settings: null,
      error: handleSupabaseError(error, "creating widget settings"),
    };
  }
};

export const updateWidgetSettings = async (
  settingsId: string,
  updates: Partial<ChatWidgetSettings>,
) => {
  try {
    const { data, error } = await supabase
      .from("chat_widget_settings")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", settingsId)
      .select()
      .single();

    if (error) throw error;
    return { settings: data, error: null };
  } catch (error) {
    return {
      settings: null,
      error: handleSupabaseError(error, "updating widget settings"),
    };
  }
};

export const setWidgetSettingsActive = async (settingsId: string) => {
  try {
    // First deactivate all settings
    const { error: deactivateError } = await supabase
      .from("chat_widget_settings")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .neq("id", "dummy"); // This will update all records

    if (deactivateError) throw deactivateError;

    // Then activate the selected settings
    const { data, error: activateError } = await supabase
      .from("chat_widget_settings")
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq("id", settingsId)
      .select()
      .single();

    if (activateError) throw activateError;

    return { settings: data, error: null };
  } catch (error) {
    return {
      settings: null,
      error: handleSupabaseError(error, "setting widget settings active"),
    };
  }
};

export const deleteWidgetSettings = async (settingsId: string) => {
  try {
    const { error } = await supabase
      .from("chat_widget_settings")
      .delete()
      .eq("id", settingsId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error, "deleting widget settings"),
    };
  }
};
