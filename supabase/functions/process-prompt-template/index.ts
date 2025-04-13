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
    // Parse request body
    const { template, variables } = await req.json();

    if (!template) {
      return new Response(JSON.stringify({ error: "Template is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Process the template by replacing variables
    const processedPrompt = substituteTemplateVariables(
      template,
      variables || {},
    );

    return new Response(JSON.stringify({ processedPrompt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing prompt template:", error);
    return new Response(
      JSON.stringify({
        error:
          error.message || "An error occurred while processing the template",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

/**
 * Substitutes variables in a template string with values from a data object
 * @param template The template string with variables in the format {{variableName}}
 * @param data An object containing the values to substitute
 * @returns The template with variables replaced by their values
 */
function substituteTemplateVariables(
  template: string,
  data: Record<string, any>,
): string {
  if (!template) return "";

  // Replace variables in the format {{variableName}} with their values
  return template.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
    const trimmedVar = variable.trim();
    // Return the value if it exists, otherwise keep the original variable placeholder
    return data[trimmedVar] !== undefined ? String(data[trimmedVar]) : match;
  });
}
