import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  modelId: string;
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get request body
    const requestData: RequestBody = await req.json();
    const { modelId, prompt, systemPrompt, maxTokens, temperature } =
      requestData;

    if (!modelId || !prompt) {
      return new Response(
        JSON.stringify({ error: "Model ID and prompt are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Get model details from database
    const { data: model, error: modelError } = await supabaseClient
      .from("ai_models")
      .select("*")
      .eq("id", modelId)
      .single();

    if (modelError || !model) {
      return new Response(JSON.stringify({ error: "Model not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Prepare API call based on provider
    let response;
    const apiKey =
      model.api_key || Deno.env.get(`${model.provider.toUpperCase()}_API_KEY`);
    const endpoint = model.endpoint || getDefaultEndpoint(model.provider);

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured for this model" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Make API call based on provider
    switch (model.provider.toLowerCase()) {
      case "openai":
        response = await callOpenAI(
          apiKey,
          endpoint,
          model.model_id,
          prompt,
          systemPrompt,
          maxTokens || model.max_tokens,
          temperature || model.temperature,
        );
        break;
      case "anthropic":
        response = await callAnthropic(
          apiKey,
          endpoint,
          model.model_id,
          prompt,
          systemPrompt,
          maxTokens || model.max_tokens,
          temperature || model.temperature,
        );
        break;
      case "google":
        response = await callGoogle(
          apiKey,
          endpoint,
          model.model_id,
          prompt,
          systemPrompt,
          maxTokens || model.max_tokens,
          temperature || model.temperature,
        );
        break;
      case "custom":
        response = await callCustomAPI(
          apiKey,
          endpoint,
          model.model_id,
          prompt,
          systemPrompt,
          maxTokens || model.max_tokens,
          temperature || model.temperature,
        );
        break;
      default:
        return new Response(JSON.stringify({ error: "Unsupported provider" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function getDefaultEndpoint(provider: string): string {
  switch (provider.toLowerCase()) {
    case "openai":
      return "https://api.openai.com/v1/chat/completions";
    case "anthropic":
      return "https://api.anthropic.com/v1/messages";
    case "google":
      return "https://generativelanguage.googleapis.com/v1beta/models";
    default:
      return "";
  }
}

async function callOpenAI(
  apiKey: string,
  endpoint: string,
  modelId: string,
  prompt: string,
  systemPrompt?: string,
  maxTokens?: number,
  temperature?: number,
) {
  const messages = [];

  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }

  messages.push({ role: "user", content: prompt });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      max_tokens: maxTokens || 1000,
      temperature: temperature || 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Error calling OpenAI API");
  }

  return {
    text: data.choices[0].message.content,
    provider: "openai",
    model: modelId,
    usage: data.usage,
  };
}

async function callAnthropic(
  apiKey: string,
  endpoint: string,
  modelId: string,
  prompt: string,
  systemPrompt?: string,
  maxTokens?: number,
  temperature?: number,
) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: "user", content: prompt }],
      system: systemPrompt,
      max_tokens: maxTokens || 1000,
      temperature: temperature || 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Error calling Anthropic API");
  }

  return {
    text: data.content[0].text,
    provider: "anthropic",
    model: modelId,
    usage: {
      input_tokens: data.usage?.input_tokens,
      output_tokens: data.usage?.output_tokens,
    },
  };
}

async function callGoogle(
  apiKey: string,
  endpoint: string,
  modelId: string,
  prompt: string,
  systemPrompt?: string,
  maxTokens?: number,
  temperature?: number,
) {
  const fullEndpoint = `${endpoint}/${modelId}:generateContent?key=${apiKey}`;

  const content = [];
  if (systemPrompt) {
    content.push({
      role: "system",
      parts: [{ text: systemPrompt }],
    });
  }

  content.push({
    role: "user",
    parts: [{ text: prompt }],
  });

  const response = await fetch(fullEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: content,
      generationConfig: {
        maxOutputTokens: maxTokens || 1000,
        temperature: temperature || 0.7,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Error calling Google API");
  }

  return {
    text: data.candidates[0].content.parts[0].text,
    provider: "google",
    model: modelId,
    usage: data.usage,
  };
}

async function callCustomAPI(
  apiKey: string,
  endpoint: string,
  modelId: string,
  prompt: string,
  systemPrompt?: string,
  maxTokens?: number,
  temperature?: number,
) {
  // This is a generic implementation that can be customized based on the API
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      prompt,
      system_prompt: systemPrompt,
      max_tokens: maxTokens || 1000,
      temperature: temperature || 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Error calling custom API");
  }

  return {
    text: data.text || data.content || data.response || data.output || "",
    provider: "custom",
    model: modelId,
    usage: data.usage,
  };
}
