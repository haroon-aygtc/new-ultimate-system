import { supabase } from "@/lib/supabaseClient";
import { KnowledgeBase, KnowledgeBaseDocument } from "@/types";

// Get all knowledge bases
export const getKnowledgeBases = async () => {
  try {
    const { data, error } = await supabase
      .from("knowledge_bases")
      .select(
        `
        *,
        documents:knowledge_base_documents(count)
      `,
      )
      .order("created_at", { ascending: false });

    return { data, error };
  } catch (error) {
    console.error("Error fetching knowledge bases:", error);
    return { data: null, error };
  }
};

// Get a single knowledge base by ID
export const getKnowledgeBase = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("knowledge_bases")
      .select(
        `
        *,
        documents:knowledge_base_documents(*)
      `,
      )
      .eq("id", id)
      .single();

    return { data, error };
  } catch (error) {
    console.error(`Error fetching knowledge base with ID ${id}:`, error);
    return { data: null, error };
  }
};

// Create a new knowledge base
export const createKnowledgeBase = async (kbData: Partial<KnowledgeBase>) => {
  try {
    // First create the knowledge base
    const { data, error } = await supabase
      .from("knowledge_bases")
      .insert([
        {
          name: kbData.name,
          description: kbData.description,
          status: kbData.status || "inactive",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // If there are documents, create them
    if (data && kbData.documents && kbData.documents.length > 0) {
      const documents = kbData.documents.map((doc) => ({
        knowledge_base_id: data.id,
        title: doc.title,
        content: doc.content,
        source_url: doc.source_url,
        created_at: new Date().toISOString(),
      }));

      const { error: docError } = await supabase
        .from("knowledge_base_documents")
        .insert(documents);

      if (docError) {
        console.error("Error creating knowledge base documents:", docError);
      }
    }

    return { success: true, knowledgeBase: data, error: null };
  } catch (error) {
    console.error("Error creating knowledge base:", error);
    return { success: false, knowledgeBase: null, error };
  }
};

// Update an existing knowledge base
export const updateKnowledgeBase = async (
  id: string,
  kbData: Partial<KnowledgeBase>,
) => {
  try {
    // First update the knowledge base
    const { data, error } = await supabase
      .from("knowledge_bases")
      .update({
        name: kbData.name,
        description: kbData.description,
        status: kbData.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // If there are documents, handle them
    if (data && kbData.documents) {
      // First delete existing documents if we're replacing them
      const { error: deleteError } = await supabase
        .from("knowledge_base_documents")
        .delete()
        .eq("knowledge_base_id", id);

      if (deleteError) {
        console.error("Error deleting existing documents:", deleteError);
      }

      // Then create new ones if there are any
      if (kbData.documents.length > 0) {
        const documents = kbData.documents.map((doc) => ({
          knowledge_base_id: id,
          title: doc.title,
          content: doc.content,
          source_url: doc.source_url,
          created_at: new Date().toISOString(),
        }));

        const { error: insertError } = await supabase
          .from("knowledge_base_documents")
          .insert(documents);

        if (insertError) {
          console.error("Error creating new documents:", insertError);
        }
      }
    }

    return { success: true, knowledgeBase: data, error: null };
  } catch (error) {
    console.error(`Error updating knowledge base with ID ${id}:`, error);
    return { success: false, knowledgeBase: null, error };
  }
};

// Update knowledge base status
export const updateKnowledgeBaseStatus = async (
  id: string,
  status: "active" | "inactive" | "static",
) => {
  try {
    const { data, error } = await supabase
      .from("knowledge_bases")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    return { success: !error, error };
  } catch (error) {
    console.error(
      `Error updating status for knowledge base with ID ${id}:`,
      error,
    );
    return { success: false, error };
  }
};

// Delete a knowledge base
export const deleteKnowledgeBase = async (id: string) => {
  try {
    // Check if any prompts are using this knowledge base
    const { data: promptsData, error: promptsError } = await supabase
      .from("prompts")
      .select("id")
      .eq("knowledge_base_id", id);

    if (promptsError) throw promptsError;

    // If the knowledge base is in use, don't delete it
    if (promptsData && promptsData.length > 0) {
      return {
        success: false,
        error: new Error(
          `Cannot delete knowledge base as it is used by ${promptsData.length} prompts`,
        ),
      };
    }

    // Delete the knowledge base (documents will be deleted via cascade)
    const { error } = await supabase
      .from("knowledge_bases")
      .delete()
      .eq("id", id);

    return { success: !error, error };
  } catch (error) {
    console.error(`Error deleting knowledge base with ID ${id}:`, error);
    return { success: false, error };
  }
};

// Add a document to a knowledge base
export const addDocument = async (document: Partial<KnowledgeBaseDocument>) => {
  try {
    const { data, error } = await supabase
      .from("knowledge_base_documents")
      .insert([
        {
          ...document,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    return { success: !error, document: data, error };
  } catch (error) {
    console.error("Error adding document to knowledge base:", error);
    return { success: false, document: null, error };
  }
};

// Delete a document from a knowledge base
export const deleteDocument = async (id: string) => {
  try {
    const { error } = await supabase
      .from("knowledge_base_documents")
      .delete()
      .eq("id", id);

    return { success: !error, error };
  } catch (error) {
    console.error(`Error deleting document with ID ${id}:`, error);
    return { success: false, error };
  }
};
