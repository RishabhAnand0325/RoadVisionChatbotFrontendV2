import {
  ChatMetadata,
  Message,
  NewMessageResponse,
  ChatDocumentsResponse,
} from "@/lib/types/ask-ai";
import { API_BASE_URL } from "@/lib/config/api";
import { getAuthHeaders, getTokenFromRedux } from "@/lib/api/authHelper";
import { apiRequest, apiRequestWithoutBody } from "@/lib/api/apiClient";

export async function getChats(): Promise<ChatMetadata[]> {
  return apiRequest<ChatMetadata[]>(`${API_BASE_URL}/askai/chats`, {
    headers: getAuthHeaders(),
  });
}

export async function createChat(driveUrl?: string | null, tenderId?: string | null): Promise<ChatMetadata> {
  return apiRequest<ChatMetadata>(`${API_BASE_URL}/askai/chats`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ driveUrl, tenderId }),
  });
}

export async function getChat(chatId: string): Promise<Message[]> {
  return apiRequest<Message[]>(`${API_BASE_URL}/askai/chats/${chatId}`, {
    headers: getAuthHeaders(),
  });
}

export async function deleteChat(chatId: string): Promise<void> {
  await apiRequestWithoutBody(`${API_BASE_URL}/askai/chats/${chatId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

export async function renameChat(chatId: string, title: string): Promise<void> {
  await apiRequestWithoutBody(`${API_BASE_URL}/askai/chats/${chatId}/rename`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });
}

export async function sendMessage(
  chatId: string,
  message: string
): Promise<NewMessageResponse> {
  return apiRequest<NewMessageResponse>(`${API_BASE_URL}/askai/chats/${chatId}/messages`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ message }),
  });
}

export async function uploadPdf(chatId: string, file: File): Promise<{ job_id: string }> {
  const formData = new FormData();
  formData.append("pdf", file);
  
  return apiRequest<{ job_id: string }>(`${API_BASE_URL}/askai/chats/${chatId}/upload-pdf`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getTokenFromRedux() || ''}` },
    body: formData,
  });
}

export async function addDriveFolder(chatId: string, driveUrl: string): Promise<any> {
  return apiRequest<any>(`${API_BASE_URL}/askai/chats/${chatId}/add-drive`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ driveUrl }),
  });
}

export async function getChatDocuments(chatId: string): Promise<ChatDocumentsResponse> {
  return apiRequest<ChatDocumentsResponse>(`${API_BASE_URL}/askai/chats/${chatId}/docs`, {
    headers: getAuthHeaders(),
  });
}

export async function deletePdf(chatId: string, pdfName: string): Promise<void> {
  await apiRequestWithoutBody(`${API_BASE_URL}/askai/chats/${chatId}/pdfs/${pdfName}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

export function uploadFileWithProgress(
  chatId: string,
  file: File,
  onProgress: (progress: number) => void
): { promise: Promise<void>; xhr: XMLHttpRequest } {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  formData.append("pdf", file);

  const promise = new Promise<void>((resolve, reject) => {
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload canceled."));
    });

    xhr.open("POST", `${API_BASE_URL}/askai/chats/${chatId}/upload-pdf`);
    xhr.setRequestHeader("Authorization", `Bearer ${getTokenFromRedux() || ''}`);
    xhr.send(formData);
  });

  return { promise, xhr };
}

export function subscribeToChatDocuments(
  chatId: string,
  onUpdate: (data: ChatDocumentsResponse) => void,
  onError?: (error: Error) => void
): EventSource {
  const token = getTokenFromRedux();
  const eventSource = new EventSource(`${API_BASE_URL}/askai/chats/${chatId}/docs-sse?token=${token}`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as ChatDocumentsResponse;
      onUpdate(data);
    } catch (error) {
      if (onError) onError(new Error("Failed to parse SSE data"));
    }
  };

  eventSource.onerror = (error) => {
    if (onError) onError(new Error("SSE connection error"));
    eventSource.close();
  };

  return eventSource;
}
