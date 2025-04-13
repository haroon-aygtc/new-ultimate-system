import { supabase } from "@/lib/supabaseClient";

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

export interface GuestSessionCreateParams {
  name: string;
  phone?: string;
  email?: string;
  metadata?: Record<string, any>;
}

// Get all guest sessions
export const getGuestSessions = async (): Promise<{
  data: GuestSession[] | null;
  error: any;
}> => {
  const { data, error } = await supabase
    .from("guest_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
};

// Get active guest sessions
export const getActiveGuestSessions = async (): Promise<{
  data: GuestSession[] | null;
  error: any;
}> => {
  const { data, error } = await supabase
    .from("guest_sessions")
    .select("*")
    .eq("status", "active")
    .order("last_active", { ascending: false });

  return { data, error };
};

// Get guest session by ID
export const getGuestSessionById = async (
  id: string,
): Promise<{ data: GuestSession | null; error: any }> => {
  const { data, error } = await supabase
    .from("guest_sessions")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
};

// Create a new guest session
export const createGuestSession = async (
  params: GuestSessionCreateParams,
): Promise<{ data: GuestSession | null; error: any }> => {
  const sessionData = {
    name: params.name,
    phone: params.phone || null,
    email: params.email || null,
    session_id: crypto.randomUUID(),
    status: "active",
    metadata: params.metadata || {},
    last_active: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("guest_sessions")
    .insert(sessionData)
    .select()
    .single();

  return { data, error };
};

// Update guest session status
export const updateGuestSessionStatus = async (
  id: string,
  status: "active" | "inactive" | "completed",
): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from("guest_sessions")
    .update({
      status,
      last_active: new Date().toISOString(),
    })
    .eq("id", id);

  return { success: !error, error };
};

// Update guest session last active time
export const updateGuestSessionActivity = async (
  id: string,
): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from("guest_sessions")
    .update({ last_active: new Date().toISOString() })
    .eq("id", id);

  return { success: !error, error };
};

// Get messages for a guest session
export const getGuestSessionMessages = async (
  sessionId: string,
): Promise<{ data: GuestMessage[] | null; error: any }> => {
  const { data, error } = await supabase
    .from("guest_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  return { data, error };
};

// Add a message to a guest session
export const addGuestSessionMessage = async (
  sessionId: string,
  content: string,
  senderType: "guest" | "ai",
  metadata?: Record<string, any>,
): Promise<{ data: GuestMessage | null; error: any }> => {
  // First update the session's last_active timestamp
  await updateGuestSessionActivity(sessionId);

  const messageData = {
    session_id: sessionId,
    content,
    sender_type: senderType,
    metadata: metadata || {},
  };

  const { data, error } = await supabase
    .from("guest_messages")
    .insert(messageData)
    .select()
    .single();

  return { data, error };
};

// Delete a guest session and all its messages
export const deleteGuestSession = async (
  id: string,
): Promise<{ success: boolean; error: any }> => {
  // First delete all messages
  const { error: messagesError } = await supabase
    .from("guest_messages")
    .delete()
    .eq("session_id", id);

  if (messagesError) {
    return { success: false, error: messagesError };
  }

  // Then delete the session
  const { error: sessionError } = await supabase
    .from("guest_sessions")
    .delete()
    .eq("id", id);

  return { success: !sessionError, error: sessionError };
};
