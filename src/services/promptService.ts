import { supabase } from "@/lib/supabaseClient";
import { Prompt } from "@/types";

// Get all prompts
export const getPrompts = async () => {
  try {
    const { data, error } = await supabase
      .from("prompts")
      .select(
        `
        *,
        follow_up_questions(*)
      `,
      )
      .order("created_at", { ascending: false });

    return { data, error };
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return { data: null, error };
  }
};

// Get a single prompt by ID
export const getPrompt = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("prompts")
      .select(
        `
        *,
        follow_up_questions(*)
      `,
      )
      .eq("id", id)
      .single();

    return { data, error };
  } catch (error) {
    console.error(`Error fetching prompt with ID ${id}:`, error);
    return { data: null, error };
  }
};

// Create a new prompt
export const createPrompt = async (promptData: Partial<Prompt>) => {
  try {
    // First create the prompt
    const { data, error } = await supabase
      .from("prompts")
      .insert([{ ...promptData, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;

    // If there are follow-up questions, create them
    if (
      data &&
      promptData.follow_up_questions &&
      promptData.follow_up_questions.length > 0
    ) {
      const followUpQuestions = promptData.follow_up_questions.map(
        (q, index) => ({
          prompt_id: data.id,
          question: q.question,
          order: index + 1,
          created_at: new Date().toISOString(),
        }),
      );

      const { error: followUpError } = await supabase
        .from("follow_up_questions")
        .insert(followUpQuestions);

      if (followUpError) {
        console.error("Error creating follow-up questions:", followUpError);
      }
    }

    return { success: true, prompt: data, error: null };
  } catch (error) {
    console.error("Error creating prompt:", error);
    return { success: false, prompt: null, error };
  }
};

// Update an existing prompt
export const updatePrompt = async (id: string, promptData: Partial<Prompt>) => {
  try {
    // First update the prompt
    const { data, error } = await supabase
      .from("prompts")
      .update({
        ...promptData,
        updated_at: new Date().toISOString(),
        // Remove follow_up_questions from the update data
        follow_up_questions: undefined,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // If there are follow-up questions, handle them
    if (data && promptData.follow_up_questions) {
      // First delete existing follow-up questions
      const { error: deleteError } = await supabase
        .from("follow_up_questions")
        .delete()
        .eq("prompt_id", id);

      if (deleteError) {
        console.error(
          "Error deleting existing follow-up questions:",
          deleteError,
        );
      }

      // Then create new ones if there are any
      if (promptData.follow_up_questions.length > 0) {
        const followUpQuestions = promptData.follow_up_questions.map(
          (q, index) => ({
            prompt_id: id,
            question: q.question,
            order: index + 1,
            created_at: new Date().toISOString(),
          }),
        );

        const { error: insertError } = await supabase
          .from("follow_up_questions")
          .insert(followUpQuestions);

        if (insertError) {
          console.error("Error creating new follow-up questions:", insertError);
        }
      }
    }

    return { success: true, prompt: data, error: null };
  } catch (error) {
    console.error(`Error updating prompt with ID ${id}:`, error);
    return { success: false, prompt: null, error };
  }
};

// Update prompt status
export const updatePromptStatus = async (
  id: string,
  status: "active" | "inactive" | "static",
) => {
  try {
    const { data, error } = await supabase
      .from("prompts")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    return { success: !error, error };
  } catch (error) {
    console.error(`Error updating status for prompt with ID ${id}:`, error);
    return { success: false, error };
  }
};

// Delete a prompt
export const deletePrompt = async (id: string) => {
  try {
    // Delete the prompt (follow-up questions will be deleted via cascade)
    const { error } = await supabase.from("prompts").delete().eq("id", id);

    return { success: !error, error };
  } catch (error) {
    console.error(`Error deleting prompt with ID ${id}:`, error);
    return { success: false, error };
  }
};

// Test a prompt
export const testPrompt = async (
  id: string,
  userInput: string,
  variables?: Record<string, any>,
) => {
  try {
    // Call the edge function to test the prompt
    const { data, error } = await supabase.functions.invoke("test-prompt", {
      body: { promptId: id, userInput, variables },
    });

    return { data, error };
  } catch (error) {
    console.error(`Error testing prompt with ID ${id}:`, error);
    return { data: null, error };
  }
};

// Process a prompt with template variables
export const processPromptTemplate = async (
  promptId: string,
  variables: Record<string, any>,
) => {
  try {
    // Get the prompt
    const { data: prompt, error } = await getPrompt(promptId);

    if (error || !prompt) {
      throw error || new Error("Prompt not found");
    }

    // Use the template if available, otherwise fall back to content
    const templateText = prompt.template || prompt.content;

    // Call the edge function to process the template
    const { data, error: processError } = await supabase.functions.invoke(
      "process-prompt-template",
      {
        body: { template: templateText, variables },
      },
    );

    if (processError) throw processError;

    return { processedPrompt: data.processedPrompt, error: null };
  } catch (error) {
    console.error(
      `Error processing prompt template with ID ${promptId}:`,
      error,
    );
    return { processedPrompt: null, error };
  }
};
