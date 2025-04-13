import { supabase } from "./supabaseClient";

/**
 * Utility function to handle Supabase errors consistently
 */
export function handleSupabaseError(error: any, context: string): Error {
  console.error(`Supabase error in ${context}:`, error);
  return new Error(`Error in ${context}: ${error.message || "Unknown error"}`);
}

/**
 * Utility function to handle database transactions
 */
export async function withTransaction<T>(
  callback: () => Promise<T>,
): Promise<{ data: T | null; error: Error | null }> {
  try {
    // Start transaction
    await supabase.rpc("begin_transaction");

    // Execute the callback
    const result = await callback();

    // Commit transaction
    await supabase.rpc("commit_transaction");

    return { data: result, error: null };
  } catch (error) {
    // Rollback transaction on error
    await supabase.rpc("rollback_transaction");
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Utility function to retry a Supabase operation with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  maxRetries: number = 3,
  initialDelay: number = 300,
): Promise<{ data: T | null; error: any }> {
  let retries = 0;
  let delay = initialDelay;

  while (retries < maxRetries) {
    const result = await operation();

    if (!result.error) {
      return result;
    }

    // If error is not retryable, return immediately
    if (result.error.code === "PGRST301" || result.error.code === "PGRST302") {
      return result;
    }

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Exponential backoff
    delay *= 2;
    retries++;
  }

  // Final attempt
  return await operation();
}

/**
 * Utility function to check if a user has the required role
 */
export async function checkUserRole(
  userId: string,
  requiredRole: "guest" | "user" | "admin",
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("auth_users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error checking user role:", error);
      return false;
    }

    if (!data) return false;

    const roleHierarchy: Record<string, number> = {
      guest: 1,
      user: 2,
      admin: 3,
    };

    return roleHierarchy[data.role] >= roleHierarchy[requiredRole];
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
}

/**
 * Utility function to get real-time updates for a table
 */
export function subscribeToTable(
  tableName: string,
  callback: (payload: any) => void,
  filter?: { column: string; value: any },
) {
  let subscription = supabase
    .channel(`public:${tableName}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: tableName,
        ...(filter ? { filter: `${filter.column}=eq.${filter.value}` } : {}),
      },
      callback,
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
}
