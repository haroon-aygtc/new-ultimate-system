import { supabase } from "@/lib/supabaseClient";

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: "admin" | "user";
  created_at: string;
  last_sign_in?: string;
  status: "active" | "inactive" | "pending";
}

export interface UserCreateParams {
  email: string;
  password: string;
  full_name?: string;
  role?: "admin" | "user";
}

export interface UserUpdateParams {
  full_name?: string;
  role?: "admin" | "user";
  status?: "active" | "inactive" | "pending";
}

// Get all users
export const getUsers = async (): Promise<{
  data: User[] | null;
  error: any;
}> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
};

// Get user by ID
export const getUserById = async (
  id: string,
): Promise<{ data: User | null; error: any }> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
};

// Create a new user
export const createUser = async (
  params: UserCreateParams,
): Promise<{ success: boolean; error: any }> => {
  // First create the auth user
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: params.email,
      password: params.password,
      email_confirm: true,
    });

  if (authError) {
    return { success: false, error: authError };
  }

  // Then create the user profile
  const { error: profileError } = await supabase.from("users").insert({
    id: authData.user.id,
    email: params.email,
    full_name: params.full_name || null,
    role: params.role || "user",
    status: "active",
  });

  if (profileError) {
    // Attempt to clean up the auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    return { success: false, error: profileError };
  }

  return { success: true, error: null };
};

// Update a user
export const updateUser = async (
  id: string,
  params: UserUpdateParams,
): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase.from("users").update(params).eq("id", id);

  return { success: !error, error };
};

// Delete a user
export const deleteUser = async (
  id: string,
): Promise<{ success: boolean; error: any }> => {
  // First delete from the users table
  const { error: profileError } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (profileError) {
    return { success: false, error: profileError };
  }

  // Then delete the auth user
  const { error: authError } = await supabase.auth.admin.deleteUser(id);

  return { success: !authError, error: authError };
};

// Change user status
export const changeUserStatus = async (
  id: string,
  status: "active" | "inactive" | "pending",
): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from("users")
    .update({ status })
    .eq("id", id);

  return { success: !error, error };
};
