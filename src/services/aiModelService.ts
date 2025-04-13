import { supabase } from "@/lib/supabaseClient";
import { AIModel } from "@/types";

// Get all AI models
export const getAIModels = async () => {
  try {
    const { data, error } = await supabase
      .from("ai_models")
      .select("*")
      .order("created_at", { ascending: false });

    return { data, error };
  } catch (error) {
    console.error("Error fetching AI models:", error);
    return { data: null, error };
  }
};

// Get a single AI model by ID
export const getAIModel = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("ai_models")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  } catch (error) {
    console.error(`Error fetching AI model with ID ${id}:`, error);
    return { data: null, error };
  }
};

// Create a new AI model
export const createAIModel = async (modelData: Partial<AIModel>) => {
  try {
    const { data, error } = await supabase
      .from("ai_models")
      .insert([{ ...modelData, created_at: new Date().toISOString() }])
      .select()
      .single();

    return { success: !error, model: data, error };
  } catch (error) {
    console.error("Error creating AI model:", error);
    return { success: false, model: null, error };
  }
};

// Update an existing AI model
export const updateAIModel = async (
  id: string,
  modelData: Partial<AIModel>,
) => {
  try {
    const { data, error } = await supabase
      .from("ai_models")
      .update({ ...modelData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    return { success: !error, model: data, error };
  } catch (error) {
    console.error(`Error updating AI model with ID ${id}:`, error);
    return { success: false, model: null, error };
  }
};

// Update AI model status
export const updateAIModelStatus = async (
  id: string,
  status: "active" | "inactive" | "static",
) => {
  try {
    const { data, error } = await supabase
      .from("ai_models")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    return { success: !error, error };
  } catch (error) {
    console.error(`Error updating status for AI model with ID ${id}:`, error);
    return { success: false, error };
  }
};

// Delete an AI model
export const deleteAIModel = async (id: string) => {
  try {
    // First check if the model is being used by any prompts
    const { data: promptsData, error: promptsError } = await supabase
      .from("prompts")
      .select("id")
      .eq("model_id", id);

    if (promptsError) throw promptsError;

    // If the model is in use, don't delete it
    if (promptsData && promptsData.length > 0) {
      return {
        success: false,
        error: new Error(
          `Cannot delete model as it is used by ${promptsData.length} prompts`,
        ),
      };
    }

    // If not in use, proceed with deletion
    const { error } = await supabase.from("ai_models").delete().eq("id", id);

    return { success: !error, error };
  } catch (error) {
    console.error(`Error deleting AI model with ID ${id}:`, error);
    return { success: false, error };
  }
};

// Test an AI model with a prompt
export const testAIModel = async (id: string, prompt: string) => {
  try {
    // Call the edge function to test the model
    const { data, error } = await supabase.functions.invoke("test-ai-model", {
      body: { modelId: id, prompt },
    });

    return { data, error };
  } catch (error) {
    console.error(`Error testing AI model with ID ${id}:`, error);
    return { data: null, error };
  }
};
