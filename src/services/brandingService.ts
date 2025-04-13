import { supabase } from "@/lib/supabaseClient";

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
  ai_persona: string;
  ai_tone: "formal" | "casual" | "friendly" | "professional";
  ai_knowledge_level: "basic" | "intermediate" | "expert";
  ai_response_length: "concise" | "balanced" | "detailed";
  ai_custom_instructions: string;
  created_at?: string;
  updated_at?: string;
}

export interface ResponseTemplate {
  id?: string;
  name: string;
  description: string;
  template: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get the current branding settings
export const getBrandingSettings = async (): Promise<{
  data: BrandingSettings | null;
  error: Error | null;
}> => {
  try {
    // Get the most recent branding settings
    const { data, error } = await supabase
      .from("branding_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching branding settings:", error);
    return { data: null, error: error as Error };
  }
};

// Save branding settings
export const saveBrandingSettings = async (
  settings: BrandingSettings,
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const now = new Date().toISOString();

    // If there's an ID, update the existing record
    if (settings.id) {
      const { error } = await supabase
        .from("branding_settings")
        .update({ ...settings, updated_at: now })
        .eq("id", settings.id);

      if (error) throw error;
    } else {
      // Otherwise create a new record
      const { error } = await supabase
        .from("branding_settings")
        .insert([{ ...settings, created_at: now, updated_at: now }]);

      if (error) throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error saving branding settings:", error);
    return { success: false, error: error as Error };
  }
};

// Get all response templates
export const getResponseTemplates = async (): Promise<{
  data: ResponseTemplate[] | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase
      .from("response_templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching response templates:", error);
    return { data: null, error: error as Error };
  }
};

// Save a response template
export const saveResponseTemplate = async (
  template: ResponseTemplate,
): Promise<{
  success: boolean;
  data?: ResponseTemplate;
  error: Error | null;
}> => {
  try {
    const now = new Date().toISOString();

    // If there's an ID, update the existing record
    if (template.id) {
      const { data, error } = await supabase
        .from("response_templates")
        .update({ ...template, updated_at: now })
        .eq("id", template.id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data, error: null };
    } else {
      // Otherwise create a new record
      const { data, error } = await supabase
        .from("response_templates")
        .insert([{ ...template, created_at: now, updated_at: now }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data, error: null };
    }
  } catch (error) {
    console.error("Error saving response template:", error);
    return { success: false, error: error as Error };
  }
};

// Delete a response template
export const deleteResponseTemplate = async (
  id: string,
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from("response_templates")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting response template:", error);
    return { success: false, error: error as Error };
  }
};

// Set a template as active and deactivate others
export const setTemplateActive = async (
  id: string,
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // First deactivate all templates
    const { error: deactivateError } = await supabase
      .from("response_templates")
      .update({ is_active: false })
      .neq("id", "dummy"); // This will update all records

    if (deactivateError) throw deactivateError;

    // Then activate the selected template
    const { error: activateError } = await supabase
      .from("response_templates")
      .update({ is_active: true })
      .eq("id", id);

    if (activateError) throw activateError;

    return { success: true, error: null };
  } catch (error) {
    console.error("Error setting template as active:", error);
    return { success: false, error: error as Error };
  }
};
