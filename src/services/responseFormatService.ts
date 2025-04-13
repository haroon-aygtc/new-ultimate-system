import { supabase } from "@/lib/supabaseClient";
import { ResponseFormat } from "@/types";

export async function getResponseFormats() {
  try {
    const { data, error } = await supabase
      .from("response_formats")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching response formats:", error);
    return { data: null, error };
  }
}

export async function getResponseFormatById(id: string) {
  try {
    const { data, error } = await supabase
      .from("response_formats")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { format: data, error: null };
  } catch (error) {
    console.error(`Error fetching response format with ID ${id}:`, error);
    return { format: null, error };
  }
}

export async function createResponseFormat(
  formatData: Partial<ResponseFormat>,
) {
  try {
    const { data, error } = await supabase
      .from("response_formats")
      .insert([formatData])
      .select()
      .single();

    if (error) throw error;

    return { success: true, error: null, format: data };
  } catch (error) {
    console.error("Error creating response format:", error);
    return { success: false, error, format: null };
  }
}

export async function updateResponseFormat(
  id: string,
  formatData: Partial<ResponseFormat>,
) {
  try {
    const { data, error } = await supabase
      .from("response_formats")
      .update(formatData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, error: null, format: data };
  } catch (error) {
    console.error(`Error updating response format with ID ${id}:`, error);
    return { success: false, error, format: null };
  }
}

export async function deleteResponseFormat(id: string) {
  try {
    const { error } = await supabase
      .from("response_formats")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting response format with ID ${id}:`, error);
    return { success: false, error };
  }
}

export async function updateResponseFormatStatus(
  id: string,
  status: "active" | "inactive" | "static",
) {
  try {
    const { error } = await supabase
      .from("response_formats")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error(
      `Error updating status for response format with ID ${id}:`,
      error,
    );
    return { success: false, error };
  }
}

export async function getDefaultResponseFormat() {
  try {
    const { data, error } = await supabase
      .from("response_formats")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no active format exists, return a default template
      if (error.code === "PGRST116") {
        return {
          format: {
            id: "default",
            name: "Default Format",
            description: "System default response format",
            template: '<div class="response">{{aiResponse}}</div>',
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          error: null,
        };
      }
      throw error;
    }

    return { format: data, error: null };
  } catch (error) {
    console.error("Error fetching default response format:", error);
    return { format: null, error };
  }
}
