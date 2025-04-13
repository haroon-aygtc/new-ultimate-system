import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { modelId, prompt } = await req.json();

    if (!modelId || !prompt) {
      return new Response(
        JSON.stringify({ error: "Model ID and prompt are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Get the model details
    const { data: model, error: modelError } = await supabase
      .from("ai_models")
      .select("*")
      .eq("id", modelId)
      .single();

    if (modelError || !model) {
      return new Response(
        JSON.stringify({ error: modelError?.message || "Model not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        },
      );
    }

    // Check if model is active
    if (model.status !== "active") {
      return new Response(JSON.stringify({ error: "Model is not active" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Call the appropriate AI provider based on the model
    let response;
    switch (model.provider) {
      case "openai":
        response = await callOpenAI(model, prompt);
        break;
      case "anthropic":
        response = await callAnthropic(model, prompt);
        break;
      case "google":
        response = await callGoogle(model, prompt);
        break;
      case "custom":
        response = await callCustomAPI(model, prompt);
        break;
      default:
        throw new Error(`Unsupported provider: ${model.provider}`);
    }

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error testing AI model:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while testing the model",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

async function callOpenAI(model, prompt) {
  const apiKey = model.api_key || Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OpenAI API key not found");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model.model_id,
      messages: [{ role: "user", content: prompt }],
      max_tokens: model.max_tokens || 1024,
      temperature: model.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `OpenAI API error: ${error.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

async function callAnthropic(model, prompt) {
  const apiKey = model.api_key || Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error("Anthropic API key not found");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: model.model_id,
      messages: [{ role: "user", content: prompt }],
      max_tokens: model.max_tokens || 1024,
      temperature: model.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Anthropic API error: ${error.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  return data.content[0]?.text || "";
}

async function callGoogle(model, prompt) {
  const apiKey = model.api_key || Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) {
    throw new Error("Google API key not found");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${model.model_id}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: model.temperature || 0.7,
          maxOutputTokens: model.max_tokens || 1024,
        },
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Google API error: ${error.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || "";
}

async function callCustomAPI(model, prompt) {
  if (!model.endpoint || !model.api_key) {
    throw new Error("Custom API endpoint and key are required");
  }

  const response = await fetch(model.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${model.api_key}`,
    },
    body: JSON.stringify({
      prompt,
      max_tokens: model.max_tokens || 1024,
      temperature: model.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Custom API error: ${error.message || response.statusText}`,
    );
  }

  const data = await response.json();
  return data.response || data.text || data.content || JSON.stringify(data);
}
