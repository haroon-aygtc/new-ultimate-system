import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// This client uses the service role key which has admin privileges
// IMPORTANT: Only use this client in server-side code or secure edge functions
const supabaseUrl = import.meta.env.SUPABASE_URL || "";
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "Missing Supabase admin environment variables. Some admin functions may not work.",
  );
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  },
);

// Helper function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .single();

    return !error && !!data;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

// Helper function to run raw SQL
export async function runSQL(sql: string) {
  try {
    const { data, error } = await supabaseAdmin.rpc("pgcall", { query: sql });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error running SQL:", error);
    return { data: null, error };
  }
}

// Helper function to create a database backup
export async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupName = `backup_${timestamp}`;

  try {
    // This would typically call a stored procedure or edge function
    // that handles the actual backup process
    console.log(`Creating backup: ${backupName}`);
    return { success: true, backupName, error: null };
  } catch (error) {
    console.error("Error creating backup:", error);
    return { success: false, backupName: null, error };
  }
}

// Helper function to restore from a backup
export async function restoreFromBackup(backupName: string) {
  try {
    // This would typically call a stored procedure or edge function
    // that handles the actual restore process
    console.log(`Restoring from backup: ${backupName}`);
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error restoring from backup ${backupName}:`, error);
    return { success: false, error };
  }
}
