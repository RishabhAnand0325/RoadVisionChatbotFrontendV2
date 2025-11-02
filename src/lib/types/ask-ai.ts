export interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
}

export interface ChatMetadata {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  has_pdf: boolean;
  pdf_count: number;
  pdf_list?: any[];
}

export interface Source {
  id: number;
  source: string;
  location: string;
  doc_type: string;
  content_type: string;
  content: string;
  full_content: string;
  page?: string | null;
}

export interface NewMessageResponse {
  reply: string;
  sources: Source[];
  message_count: number;
}

export interface DocumentMetadata {
  name: string;
  chunks: number;
  status: string;
}

export interface ProcessingJob {
  name: string;
  job_id: string;
  status: "queued" | "downloading" | "processing" | "finished" | "failed";
  stage: string;
  progress: number;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string | null;
}

export interface DriveFolder {
  id: string;
  files: DriveFile[];
  subfolders: DriveFolder[];
}

export interface ChatDocumentsResponse {
  pdfs: DocumentMetadata[];
  xlsx: DocumentMetadata[];
  processing: ProcessingJob[];
  drive_folders: DriveFolder[];
  total_docs: number;
  chat_id: string;
}
