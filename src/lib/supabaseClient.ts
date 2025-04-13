import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Provide fallback values for development if env variables are not set
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project-url.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

if (
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY
) {
  console.warn(
    "Missing Supabase environment variables. Using fallback values for development.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signUp = async (
  email: string,
  password: string,
  role: "user" | "admin" = "user",
) => {
  // First create the auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    return { data, error };
  }

  // Then set their role in the auth_users table
  const { error: roleError } = await supabase.from("auth_users").insert([
    {
      id: data.user.id,
      email: data.user.email,
      role: role,
    },
  ]);

  if (roleError) {
    console.error("Error setting user role:", roleError);
  }

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

// Role management functions
export const getUserRole = async (userId: string) => {
  // First check auth_users table
  const { data: authUserData, error: authUserError } = await supabase
    .from("auth_users")
    .select("role")
    .eq("id", userId)
    .single();

  if (authUserData) {
    return { role: authUserData.role, isGuest: false, error: null };
  }

  // Then check guest_users table
  const { data: guestUserData, error: guestUserError } = await supabase
    .from("guest_users")
    .select("role")
    .eq("id", userId)
    .single();

  if (guestUserData) {
    return { role: guestUserData.role || "guest", isGuest: true, error: null };
  }

  return { role: null, isGuest: false, error: guestUserError || authUserError };
};

export const setUserRole = async (
  userId: string,
  role: "guest" | "user" | "admin",
) => {
  // First check if user exists in auth_users
  const { data: authUserData } = await supabase
    .from("auth_users")
    .select("id")
    .eq("id", userId)
    .single();

  if (authUserData) {
    const { error } = await supabase
      .from("auth_users")
      .update({ role })
      .eq("id", userId);

    return { error };
  }

  // If not in auth_users, check guest_users
  const { data: guestUserData } = await supabase
    .from("guest_users")
    .select("id")
    .eq("id", userId)
    .single();

  if (guestUserData) {
    const { error } = await supabase
      .from("guest_users")
      .update({ role })
      .eq("id", userId);

    return { error };
  }

  return { error: new Error("User not found") };
};

// Admin functions
export const createUserAsAdmin = async (
  email: string,
  password: string,
  role: "user" | "admin" = "user",
) => {
  // Check if current user is admin
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) {
    return { error: new Error("Not authenticated") };
  }

  const { role: currentRole, error: roleError } = await getUserRole(
    currentUser.user.id,
  );
  if (roleError || currentRole !== "admin") {
    return { error: new Error("Not authorized") };
  }

  // Create user with admin service role (would require server-side implementation)
  // For now, we'll use the regular signup and then update the role
  return signUp(email, password, role);
};

// Guest user functions
export const registerGuestUser = async (name: string, phone: string) => {
  const guestId = crypto.randomUUID();

  const { error } = await supabase.from("guest_users").insert([
    {
      id: guestId,
      name,
      phone,
      role: "guest",
      created_at: new Date().toISOString(),
      last_active_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    return { user: null, error };
  }

  return {
    user: {
      id: guestId,
      name,
      phone,
      role: "guest",
      isGuest: true,
    },
    error: null,
  };
};

// Convert guest to regular user
export const convertGuestToUser = async (
  guestId: string,
  email: string,
  password: string,
) => {
  // First create the auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    return { data, error };
  }

  // Get guest user data
  const { data: guestData, error: guestError } = await supabase
    .from("guest_users")
    .select("*")
    .eq("id", guestId)
    .single();

  if (guestError || !guestData) {
    return { data, error: guestError || new Error("Guest user not found") };
  }

  // Update auth_users with guest info
  const { error: updateError } = await supabase
    .from("auth_users")
    .update({
      role: "user",
      // Add any additional fields you want to transfer
    })
    .eq("id", data.user.id);

  if (updateError) {
    console.error("Error updating user data:", updateError);
  }

  // Optionally, mark the guest user as converted or delete it
  const { error: guestUpdateError } = await supabase
    .from("guest_users")
    .update({ converted_to_user_id: data.user.id })
    .eq("id", guestId);

  if (guestUpdateError) {
    console.error("Error updating guest user:", guestUpdateError);
  }

  return { data, error: null };
};
