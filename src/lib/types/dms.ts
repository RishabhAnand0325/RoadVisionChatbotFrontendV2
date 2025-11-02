export interface DocumentSummary {
  totalDocuments: number;
  recentUploads: number;
  storageUsed: string;
  sharedDocuments: number;
}

export interface Folder {
  id: string;
  name: string;
  parentFolderId: string | null;
  path: string;
  documentCount: number;
  subfolders: Folder[];
  createdAt: string;
  modifiedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Document {
  id: string;
  name: string;
  fileType: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  modifiedAt: string;
  department: string;
  folderId: string | null;
  folderPath: string;
  categoryIds: string[];
  tags: string[];
  status: 'active' | 'archived' | 'pending';
  confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  description?: string;
  version?: string;
}

export interface AISummary {
  documentType: string;
  keyTopic: string;
  language: string;
  generatedAt: string;
  executiveSummary: string;
  keyInformation: Record<string, string>;
  importantDates: Array<{ date: string; description: string }>;
  keyEntities: {
    organizations: string[];
    people: string[];
    locations: string[];
  };
  riskFlags: string[];
  tags: string[];
  confidenceScore: number;
}
