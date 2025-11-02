import { useState, useEffect } from "react";
import {
  getChats,
  createChat,
  getChat,
  deleteChat,
  sendMessage,
  uploadPdf,
  getChatDocuments,
  deletePdf,
} from "@/lib/api/ask-ai";
import { Message, ChatMetadata, ChatDocumentsResponse } from "@/lib/types/ask-ai";
import { AskAIUI } from "@/components/ask-ai/AskAIUI";
import { useToast } from "@/hooks/use-toast";

export default function AskAI() {
  const [chats, setChats] = useState<ChatMetadata[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [documents, setDocuments] = useState<ChatDocumentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (currentChatId) {
      loadChatMessages(currentChatId);
      loadChatDocuments(currentChatId);
    }
  }, [currentChatId]);

  const loadChats = async () => {
    try {
      const chatList = await getChats();
      setChats(chatList);
      if (chatList.length > 0 && !currentChatId) {
        setCurrentChatId(chatList[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chats",
        variant: "destructive",
      });
    }
  };

  const loadChatMessages = async (chatId: string) => {
    try {
      const chatMessages = await getChat(chatId);
      setMessages(chatMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const loadChatDocuments = async (chatId: string) => {
    try {
      const docs = await getChatDocuments(chatId);
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  };

  const handleCreateChat = async () => {
    try {
      const newChat = await createChat(null);
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      toast({
        title: "Success",
        description: "New chat created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create chat",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(chats[0]?.id || null);
      }
      toast({
        title: "Success",
        description: "Chat deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !currentChatId) return;

    const userMessageText = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage(currentChatId, userMessageText);
      await loadChatMessages(currentChatId);
      await loadChats();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadPdf = async (file: File) => {
    if (!currentChatId) return;

    try {
      await uploadPdf(currentChatId, file);
      toast({
        title: "Success",
        description: "PDF uploaded and processing started",
      });
      setTimeout(() => loadChatDocuments(currentChatId), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload PDF",
        variant: "destructive",
      });
    }
  };

  const handleDeletePdf = async (pdfName: string) => {
    if (!currentChatId) return;

    try {
      await deletePdf(currentChatId, pdfName);
      toast({
        title: "Success",
        description: "PDF deleted",
      });
      loadChatDocuments(currentChatId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden">
      <AskAIUI
        chats={chats}
        currentChatId={currentChatId}
        messages={messages}
        input={input}
        documents={documents}
        isLoading={isLoading}
        onChatSelect={setCurrentChatId}
        onCreateChat={handleCreateChat}
        onDeleteChat={handleDeleteChat}
        onInputChange={setInput}
        onSend={handleSend}
        onUploadPdf={handleUploadPdf}
        onDeletePdf={handleDeletePdf}
      />
    </div>
  );
}
