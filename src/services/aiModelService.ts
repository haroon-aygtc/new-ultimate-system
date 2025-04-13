import { supabase } from "@/lib/supabaseClient";

export interface AIModel {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "google" | "custom";
  model_id: string;
  description?: string;
  status: "static" | "active" | "inactive";
  created_at: string;
  updated_at: string;
  config: AIModelConfig;
}

export interface AIModelConfig {
  api_key?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop_sequences?: string[];
  custom_endpoint?: string;
  additional_params?: Record<string, any>;
}

export interface AIPrompt {
  id: string;
  name: string;
  description?: string;
  prompt_text: string;
  model_id: string;
  status: "static" | "active" | "inactive";
  created_at: string;
  updated_at: string;
  variables?: string[];
}

export interface AIModelCreateParams {
  name: string;
  provider: "openai" | "anthropic" | "google" | "custom";
  model_id: string;
  description?: string;
  status?: "static" | "active" | "inactive";
  config: AIModelConfig;
}

export interface AIPromptCreateParams {
  name: string;
  description?: string;
  prompt_text: string;
  model_id: string;
  status?: "static" | "active" | "inactive";
  variables?: string[];
}

// Get all AI models
export const getAIModels = async (): Promise<{
  data: AIModel[] | null;
  error: any;
}> => {
  const { data, error } = await supabase
    .from("ai_models")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
};

// Get active AI models
export const getActiveAIModels = async (): Promise<{
  data: AIModel[] | null;
  error: any;
}> => {
  const { data, error } = await supabase
    .from("ai_models")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return { data, error };
};

// Get AI model by ID
export const getAIModelById = async (
  id: string,
): Promise<{ data: AIModel | null; error: any }> => {
  const { data, error } = await supabase
    .from("ai_models")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
};

// Create a new AI model
export const createAIModel = async (
  params: AIModelCreateParams,
): Promise<{ data: AIModel | null; error: any }> => {
  const modelData = {
    name: params.name,
    provider: params.provider,
    model_id: params.model_id,
    description: params.description || null,
    status: params.status || "inactive",
    config: params.config,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("ai_models")
    .insert(modelData)
    .select()
    .single();

  return { data, error };
};

// Update an AI model
export const updateAIModel = async (
  id: string,
  params: Partial<AIModelCreateParams>,
): Promise<{ data: AIModel | null; error: any }> => {
  const updateData = {
    ...params,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("ai_models")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

// Update AI model status
export const updateAIModelStatus = async (
  id: string,
  status: "static" | "active" | "inactive",
): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from("ai_models")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  return { success: !error, error };
};

// Delete an AI model
export const deleteAIModel = async (
  id: string,
): Promise<{ success: boolean; error: any }> => {
  // First check if there are any prompts using this model
  const { data: promptsData } = await supabase
    .from("ai_prompts")
    .select("id")
    .eq("model_id", id);

  if (promptsData && promptsData.length > 0) {
    return {
      success: false,
      error: {
        message: "Cannot delete model that has prompts associated with it",
      },
    };
  }

  const { error } = await supabase.from("ai_models").delete().eq("id", id);

  return { success: !error, error };
};

// Get all AI prompts
export const getAIPrompts = async (): Promise<{
  data: AIPrompt[] | null;
  error: any;
}> => {
  const { data, error } = await supabase
    .from("ai_prompts")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
};

// Get AI prompts for a specific model
export const getAIPromptsByModel = async (
  modelId: string,
): Promise<{ data: AIPrompt[] | null; error: any }> => {
  const { data, error } = await supabase
    .from("ai_prompts")
    .select("*")
    .eq("model_id", modelId)
    .order("created_at", { ascending: false });

  return { data, error };
};

// Get active AI prompts
export const getActiveAIPrompts = async (): Promise<{
  data: AIPrompt[] | null;
  error: any;
}> => {
  const { data, error } = await supabase
    .from("ai_prompts")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return { data, error };
};

// Get AI prompt by ID
export const getAIPromptById = async (
  id: string,
): Promise<{ data: AIPrompt | null; error: any }> => {
  const { data, error } = await supabase
    .from("ai_prompts")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
};

// Create a new AI prompt
export const createAIPrompt = async (
  params: AIPromptCreateParams,
): Promise<{ data: AIPrompt | null; error: any }> => {
  const promptData = {
    name: params.name,
    description: params.description || null,
    prompt_text: params.prompt_text,
    model_id: params.model_id,
    status: params.status || "inactive",
    variables: params.variables || [],
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("ai_prompts")
    .insert(promptData)
    .select()
    .single();

  return { data, error };
};

// Update an AI prompt
export const updateAIPrompt = async (
  id: string,
  params: Partial<AIPromptCreateParams>,
): Promise<{ data: AIPrompt | null; error: any }> => {
  const updateData = {
    ...params,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("ai_prompts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

// Update AI prompt status
export const updateAIPromptStatus = async (
  id: string,
  status: "static" | "active" | "inactive",
): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from("ai_prompts")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  return { success: !error, error };
};

// Delete an AI prompt
export const deleteAIPrompt = async (
  id: string,
): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase.from("ai_prompts").delete().eq("id", id);

  return { success: !error, error };
};
