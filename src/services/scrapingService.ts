import { supabase } from "@/lib/supabaseClient";

export interface ScrapingProject {
  id: string;
  name: string;
  description?: string;
  target_url: string;
  status: "static" | "active" | "inactive";
  created_at: string;
  updated_at: string;
  last_run?: string;
  config: ScrapingConfig;
}

export interface ScrapingConfig {
  selector_groups: SelectorGroup[];
  pagination?: PaginationConfig;
  authentication?: AuthenticationConfig;
  rate_limit?: number; // in milliseconds
  timeout?: number; // in milliseconds
  user_agent?: string;
  proxy?: string;
  cookies?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface SelectorGroup {
  id: string;
  name: string;
  selector: string;
  type: "text" | "attribute" | "html";
  attribute?: string;
  is_array: boolean;
  children?: SelectorGroup[];
}

export interface PaginationConfig {
  type: "url" | "button" | "infinite_scroll";
  selector?: string;
  max_pages?: number;
  url_pattern?: string;
}

export interface AuthenticationConfig {
  type: "basic" | "form" | "cookie";
  username?: string;
  password?: string;
  form_selector?: string;
  username_selector?: string;
  password_selector?: string;
  submit_selector?: string;
  cookies?: Record<string, string>;
}

export interface ScrapingResult {
  id: string;
  project_id: string;
  status: "success" | "partial" | "failed";
  created_at: string;
  completed_at?: string;
  data: any;
  error?: string;
  pages_scraped: number;
  items_scraped: number;
}

export interface ScrapingProjectCreateParams {
  name: string;
  description?: string;
  target_url: string;
  status?: "static" | "active" | "inactive";
  config: ScrapingConfig;
}

// Get all scraping projects
export const getScrapingProjects = async (): Promise<{
  data: ScrapingProject[] | null;
  error: any;
}> => {
  const { data, error } = await supabase
    .from("scraping_projects")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
};

// Get active scraping projects
export const getActiveScrapingProjects = async (): Promise<{
  data: ScrapingProject[] | null;
  error: any;
}> => {
  const { data, error } = await supabase
    .from("scraping_projects")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return { data, error };
};

// Get scraping project by ID
export const getScrapingProjectById = async (
  id: string,
): Promise<{ data: ScrapingProject | null; error: any }> => {
  const { data, error } = await supabase
    .from("scraping_projects")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
};

// Create a new scraping project
export const createScrapingProject = async (
  params: ScrapingProjectCreateParams,
): Promise<{ data: ScrapingProject | null; error: any }> => {
  const projectData = {
    name: params.name,
    description: params.description || null,
    target_url: params.target_url,
    status: params.status || "inactive",
    config: params.config,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("scraping_projects")
    .insert(projectData)
    .select()
    .single();

  return { data, error };
};

// Update a scraping project
export const updateScrapingProject = async (
  id: string,
  params: Partial<ScrapingProjectCreateParams>,
): Promise<{ data: ScrapingProject | null; error: any }> => {
  const updateData = {
    ...params,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("scraping_projects")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

// Update scraping project status
export const updateScrapingProjectStatus = async (
  id: string,
  status: "static" | "active" | "inactive",
): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from("scraping_projects")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  return { success: !error, error };
};

// Delete a scraping project
export const deleteScrapingProject = async (
  id: string,
): Promise<{ success: boolean; error: any }> => {
  // First delete all results for this project
  const { error: resultsError } = await supabase
    .from("scraping_results")
    .delete()
    .eq("project_id", id);

  if (resultsError) {
    return { success: false, error: resultsError };
  }

  const { error } = await supabase
    .from("scraping_projects")
    .delete()
    .eq("id", id);

  return { success: !error, error };
};

// Get scraping results for a project
export const getScrapingResults = async (
  projectId: string,
): Promise<{ data: ScrapingResult[] | null; error: any }> => {
  const { data, error } = await supabase
    .from("scraping_results")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  return { data, error };
};

// Get a specific scraping result
export const getScrapingResultById = async (
  id: string,
): Promise<{ data: ScrapingResult | null; error: any }> => {
  const { data, error } = await supabase
    .from("scraping_results")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
};

// Create a new scraping result (typically called by the scraping system)
export const createScrapingResult = async (
  projectId: string,
  status: "success" | "partial" | "failed",
  data: any,
  error?: string,
  pagesScraped: number = 0,
  itemsScraped: number = 0,
): Promise<{ data: ScrapingResult | null; error: any }> => {
  const resultData = {
    project_id: projectId,
    status,
    data,
    error: error || null,
    pages_scraped: pagesScraped,
    items_scraped: itemsScraped,
    completed_at: status !== "partial" ? new Date().toISOString() : null,
  };

  const { data: resultResponse, error: resultError } = await supabase
    .from("scraping_results")
    .insert(resultData)
    .select()
    .single();

  // Update the project's last_run timestamp
  if (!resultError) {
    await supabase
      .from("scraping_projects")
      .update({ last_run: new Date().toISOString() })
      .eq("id", projectId);
  }

  return { data: resultResponse, error: resultError };
};

// Update a scraping result (for partial results that complete later)
export const updateScrapingResult = async (
  id: string,
  status: "success" | "partial" | "failed",
  data: any,
  error?: string,
  pagesScraped?: number,
  itemsScraped?: number,
): Promise<{ success: boolean; error: any }> => {
  const updateData: any = {
    status,
    data,
    error: error || null,
  };

  if (pagesScraped !== undefined) {
    updateData.pages_scraped = pagesScraped;
  }

  if (itemsScraped !== undefined) {
    updateData.items_scraped = itemsScraped;
  }

  if (status !== "partial") {
    updateData.completed_at = new Date().toISOString();
  }

  const { error: resultError } = await supabase
    .from("scraping_results")
    .update(updateData)
    .eq("id", id);

  return { success: !resultError, error: resultError };
};

// Delete a scraping result
export const deleteScrapingResult = async (
  id: string,
): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from("scraping_results")
    .delete()
    .eq("id", id);

  return { success: !error, error };
};

// Export scraping result to different formats
export const exportScrapingResult = (
  data: any,
  format: "json" | "csv" | "html" | "text",
): string => {
  switch (format) {
    case "json":
      return JSON.stringify(data, null, 2);
    case "csv":
      return convertToCSV(data);
    case "html":
      return convertToHTML(data);
    case "text":
      return convertToText(data);
    default:
      return JSON.stringify(data, null, 2);
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data: any): string => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return "";
  }

  // Get headers from the first item
  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add the headers
  csvRows.push(headers.join(","));

  // Add the data
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      // Handle different types of values
      if (value === null || value === undefined) {
        return "";
      } else if (typeof value === "object") {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      } else {
        return `"${String(value).replace(/"/g, '""')}"`;
      }
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};

// Helper function to convert data to HTML
const convertToHTML = (data: any): string => {
  if (!data) {
    return "<p>No data</p>";
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return "<p>Empty array</p>";
    }

    // Create a table for array data
    const headers = Object.keys(data[0]);
    let html = '<table border="1"><thead><tr>';

    // Add headers
    for (const header of headers) {
      html += `<th>${header}</th>`;
    }
    html += "</tr></thead><tbody>";

    // Add rows
    for (const item of data) {
      html += "<tr>";
      for (const header of headers) {
        const value = item[header];
        if (value === null || value === undefined) {
          html += "<td></td>";
        } else if (typeof value === "object") {
          html += `<td>${convertToHTML(value)}</td>`;
        } else {
          html += `<td>${String(value)}</td>`;
        }
      }
      html += "</tr>";
    }
    html += "</tbody></table>";
    return html;
  } else if (typeof data === "object") {
    // Create a definition list for object data
    let html = "<dl>";
    for (const [key, value] of Object.entries(data)) {
      html += `<dt>${key}</dt>`;
      if (value === null || value === undefined) {
        html += "<dd></dd>";
      } else if (typeof value === "object") {
        html += `<dd>${convertToHTML(value)}</dd>`;
      } else {
        html += `<dd>${String(value)}</dd>`;
      }
    }
    html += "</dl>";
    return html;
  } else {
    // Simple value
    return String(data);
  }
};

// Helper function to convert data to plain text
const convertToText = (data: any, indent: number = 0): string => {
  if (!data) {
    return "No data";
  }

  const spaces = " ".repeat(indent);

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return "Empty array";
    }

    let text = "";
    for (let i = 0; i < data.length; i++) {
      text += `${spaces}Item ${i + 1}:\n`;
      text += convertToText(data[i], indent + 2) + "\n";
    }
    return text;
  } else if (typeof data === "object") {
    let text = "";
    for (const [key, value] of Object.entries(data)) {
      text += `${spaces}${key}: `;
      if (value === null || value === undefined) {
        text += "null\n";
      } else if (typeof value === "object") {
        text += "\n" + convertToText(value, indent + 2);
      } else {
        text += String(value) + "\n";
      }
    }
    return text;
  } else {
    return String(data);
  }
};
