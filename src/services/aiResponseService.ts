import { supabase } from "@/lib/supabaseClient";
import { getPrompt } from "./promptService";
import { getAIModel } from "./aiModelService";
import { getKnowledgeBase } from "./knowledgeBaseService";
import { substituteTemplateVariables } from "@/lib/utils";

/**
 * Process a user message and generate an AI response
 * @param message The user's message
 * @param userId The user's ID
 * @param sessionId The chat session ID
 * @param contextData Additional context data for template variables
 * @returns The AI response
 */
export const generateAIResponse = async (
  message: string,
  userId: string,
  sessionId: string,
  contextData: Record<string, any> = {},
) => {
  try {
    // Get the active prompt
    const { data: prompts, error: promptsError } = await supabase
      .from("prompts")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);

    if (promptsError || !prompts || prompts.length === 0) {
      throw new Error("No active prompt found");
    }

    const activePrompt = prompts[0];

    // Get the AI model associated with the prompt
    const { data: model, error: modelError } = await getAIModel(
      activePrompt.model_id,
    );

    if (modelError || !model) {
      throw new Error(`AI model not found: ${modelError?.message}`);
    }

    // Check if the model is active
    if (model.status !== "active") {
      throw new Error("The AI model is not active");
    }

    // Prepare template variables
    const variables = {
      user_message: message,
      user_id: userId,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      ...contextData,
    };

    // Get knowledge base context if specified
    let knowledgeBaseContext = "";
    if (activePrompt.knowledge_base_id) {
      const { data: kb, error: kbError } = await getKnowledgeBase(
        activePrompt.knowledge_base_id,
      );

      if (!kbError && kb && kb.documents && kb.documents.length > 0) {
        knowledgeBaseContext = kb.documents
          .map((doc) => `${doc.title}:\n${doc.content}`)
          .join("\n\n");

        variables.knowledge_base = knowledgeBaseContext;
      }
    }

    // Process the template
    const templateText = activePrompt.template || activePrompt.content;
    const processedPrompt = substituteTemplateVariables(
      templateText,
      variables,
    );

    // Process system prompt if available
    let systemPrompt = "";
    if (activePrompt.system_prompt) {
      systemPrompt = substituteTemplateVariables(
        activePrompt.system_prompt,
        variables,
      );
    }

    // Call the AI model
    const { data, error } = await supabase.functions.invoke("test-ai-model", {
      body: {
        modelId: model.id,
        prompt: processedPrompt,
        systemPrompt: systemPrompt,
        knowledgeBaseContext: knowledgeBaseContext,
      },
    });

    if (error) throw error;

    // Check for follow-up questions
    const { data: followUpQuestions, error: followUpError } = await supabase
      .from("follow_up_questions")
      .select("*")
      .eq("prompt_id", activePrompt.id)
      .order("order", { ascending: true });

    return {
      response: data.response,
      followUpQuestions: !followUpError ? followUpQuestions : null,
      error: null,
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {
      response: null,
      followUpQuestions: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

/**
 * Process a follow-up question selection
 * @param questionId The selected follow-up question ID
 * @param userId The user's ID
 * @param sessionId The chat session ID
 * @returns The AI response to the follow-up
 */
export const processFollowUpQuestion = async (
  questionId: string,
  userId: string,
  sessionId: string,
) => {
  try {
    // Get the follow-up question
    const { data: question, error: questionError } = await supabase
      .from("follow_up_questions")
      .select("*, prompts(*)")
      .eq("id", questionId)
      .single();

    if (questionError || !question) {
      throw new Error(
        `Follow-up question not found: ${questionError?.message}`,
      );
    }

    // Get the prompt associated with the question
    const prompt = question.prompts;
    if (!prompt) {
      throw new Error("Prompt not found for follow-up question");
    }

    // Get the AI model associated with the prompt
    const { data: model, error: modelError } = await getAIModel(
      prompt.model_id,
    );

    if (modelError || !model) {
      throw new Error(`AI model not found: ${modelError?.message}`);
    }

    // Prepare variables
    const variables = {
      user_message: question.question,
      user_id: userId,
      session_id: sessionId,
      follow_up_id: questionId,
      timestamp: new Date().toISOString(),
    };

    // Process the template
    const templateText = prompt.template || prompt.content;
    const processedPrompt = substituteTemplateVariables(
      templateText,
      variables,
    );

    // Call the AI model
    const { data, error } = await supabase.functions.invoke("test-ai-model", {
      body: {
        modelId: model.id,
        prompt: processedPrompt,
        variables,
      },
    });

    if (error) throw error;

    return { response: data.response, error: null };
  } catch (error) {
    console.error("Error processing follow-up question:", error);
    return {
      response: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};
