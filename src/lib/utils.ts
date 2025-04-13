import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Substitutes variables in a template string with values from a data object
 * @param template The template string with variables in the format {{variableName}}
 * @param data An object containing the values to substitute
 * @returns The template with variables replaced by their values
 */
export function substituteTemplateVariables(
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
