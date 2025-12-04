import { DocumentDraftingData } from "@/lib/types/document-drafting";
import { templateSchemas } from "@/data/templateSchemas";

const API_BASE_URL = "/api/v1";

export async function getDocumentTemplates(): Promise<DocumentDraftingData> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/document-drafting/templates`);
  // return response.json();

  // Hardcoded data for now
  return {
    templates: templateSchemas,
  };
}

export async function generateDocumentDraft(templateId: string, formValues: Record<string, string>): Promise<string> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/document-drafting/generate`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ templateId, formValues }),
  // });
  // const data = await response.json();
  // return data.content;

  // Hardcoded generation logic for now
  const template = templateSchemas.find(t => t.id === templateId);
  if (!template || !template.structure) {
    return "";
  }

  let generatedContent = template.structure;

  // Replace placeholders with form values
  Object.entries(formValues).forEach(([key, value]) => {
    const placeholder = `[${key}]`;
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    generatedContent = generatedContent.replace(regex, value);
  });

  // Add current date
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  generatedContent = generatedContent.replace(/\[Current Date\]/g, currentDate);

  return generatedContent;
}
