import { useState } from "react";
import { LegalAIUI } from "@/components/legaliq/LegalAIUI";
import { Message } from "@/lib/types/ask-ai";
import { useToast } from "@/hooks/use-toast";

export default function LegalAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response for now
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand your query. As a legal AI assistant, I'm here to help you with document analysis, legal research, and drafting. Please note that this is a demo response. In production, this would connect to the actual AI backend.",
        sender: "assistant",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleClearChat = () => {
    setMessages([]);
    setInput("");
    setUploadedFiles([]);
    toast({
      title: "Chat cleared",
      description: "All messages and files have been removed",
    });
  };

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
  };

  const handleFileUpload = (file: File) => {
    // Validate file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 50MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX",
        variant: "destructive",
      });
      return;
    }

    setUploadedFiles((prev) => [...prev, file]);
    toast({
      title: "File uploaded",
      description: `"${file.name}" has been added to the chat`,
    });

    // Add system message about file upload
    const systemMessage: Message = {
      id: Date.now().toString(),
      text: `📎 File uploaded: **${file.name}** (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
      sender: "system",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, systemMessage]);
  };

  return (
    <div className="h-full p-4 md:p-6">
      <LegalAIUI
        messages={messages}
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSend={handleSend}
        onClearChat={handleClearChat}
        onPromptSelect={handlePromptSelect}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
}