export interface TemplateField {
  label: string;
  type: "text" | "textarea" | "date" | "file";
  required: boolean;
}

export interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  version?: string;
  lastUpdated?: string;
  createdBy?: string;
  downloads?: number;
  fields: TemplateField[];
  structure?: string;
}

export interface DocumentDraftingData {
  templates: Template[];
}
