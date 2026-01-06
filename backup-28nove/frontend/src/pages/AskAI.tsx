import { useState, useEffect, useRef } from "react";
import {
  getChats,
  createChat,
  getChat,
  deleteChat,
  sendMessage,
  getChatDocuments,
  deletePdf,
  renameChat,
  uploadFileWithProgress,
  subscribeToChatDocuments,
} from "@/lib/api/ask-ai";
import { Message, ChatMetadata, ChatDocumentsResponse } from "@/lib/types/ask-ai";
import { Sidebar } from "@/components/ask-ai/Sidebar";
import { MessageBubble } from "@/components/ask-ai/MessageBubble";
import { ChatInput } from "@/components/ask-ai/ChatInput";
import { DocumentPanel } from "@/components/ask-ai/DocumentPanel";
import { UploadProgressOverlay, UploadItem } from "@/components/ask-ai/UploadProgressOverlay";
import { WelcomeScreen } from "@/components/ask-ai/WelcomeScreen";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UploadTask extends UploadItem {
  xhr: XMLHttpRequest;
}

export default function AskAI() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const uploadIdCounter = useRef(0);

  // Chat state
  const [chats, setChats] = useState<ChatMetadata[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<ChatMetadata | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [documents, setDocuments] = useState<ChatDocumentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // UI state
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [showDocPanel, setShowDocPanel] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [chatToRename, setChatToRename] = useState<{ id: string; title: string } | null>(null);
  const [newChatTitle, setNewChatTitle] = useState("");
  const sseRef = useRef<EventSource | null>(null);

  // Load chats on mount
  // Load chats on mount
  useEffect(() => {
    initializeChats();
  }, []);

  // Setup SSE and load data when chat changes
  useEffect(() => {
    if (currentChatId) {
      loadChatData(currentChatId);
      setupSSE(currentChatId);
    }

    return () => {
      if (sseRef.current) {
        sseRef.current.close();
      }
    };
  }, [currentChatId]);

  const fetchChats = async () => {
    try {
      const chatList = await getChats();
      setChats(chatList);
      return chatList;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chats",
        variant: "destructive",
      });
      return [];
    }
  };

  const initializeChats = async () => {
    const chatList = await fetchChats();

    // Auto-select logic
    if (chatList.length > 0) {
      const mostRecentChat = chatList[0];
      // If we don't have a current chat selected, select the most recent one
      if (!currentChatId) {
        setCurrentChatId(mostRecentChat.id);
      }
    } else {
      // No chats exist, create a new one
      handleCreateChat();
    }
  };

  const loadChatData = async (chatId: string) => {
    try {
      const [chatMessages, docs] = await Promise.all([
        getChat(chatId),
        getChatDocuments(chatId),
      ]);
      setMessages(chatMessages);
      setDocuments(docs);

      const chat = chats.find((c) => c.id === chatId);
      setCurrentChat(chat || null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chat data",
        variant: "destructive",
      });
    }
  };

  const setupSSE = (chatId: string) => {
    if (sseRef.current) {
      sseRef.current.close();
    }

    sseRef.current = subscribeToChatDocuments(
      chatId,
      (data) => {
        setDocuments(data);
      },
      (error) => {
        console.error("SSE error:", error);
      }
    );
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
    setChatToDelete(chatId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    try {
      await deleteChat(chatToDelete);
      setChats((prev) => prev.filter((c) => c.id !== chatToDelete));
      if (currentChatId === chatToDelete) {
        const remaining = chats.filter((c) => c.id !== chatToDelete);
        setCurrentChatId(remaining[0]?.id || null);
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
    } finally {
      setDeleteDialogOpen(false);
      setChatToDelete(null);
    }
  };

  const handleRenameChat = (chatId: string, currentTitle: string) => {
    setChatToRename({ id: chatId, title: currentTitle });
    setNewChatTitle(currentTitle);
    setRenameDialogOpen(true);
  };

  const confirmRenameChat = async () => {
    if (!chatToRename || !newChatTitle.trim()) return;

    try {
      await renameChat(chatToRename.id, newChatTitle);
      setChats((prev) =>
        prev.map((c) => (c.id === chatToRename.id ? { ...c, title: newChatTitle } : c))
      );
      toast({
        title: "Success",
        description: "Chat renamed",
      });
      setRenameDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename chat",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !currentChatId || isLoading) return;

    setIsLoading(true);

    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      const response = await sendMessage(currentChatId, message);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        sender: "assistant",
        timestamp: new Date().toISOString(),
        sourceReferences:
          response.sources && response.sources.length > 0
            ? response.sources.map((s) => ({
              content: s.content,
              page: s.page,
              source: s.source,
            }))
            : undefined,
        hasContext:
          response.sources && response.sources.length > 0 ? true : false,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Refresh chat list to update message counts
      await fetchChats();
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, an error occurred while processing your message.",
        sender: "assistant",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    let currentChatIdToUse = currentChatId;

    // Create new chat if needed
    if (!currentChatIdToUse) {
      try {
        const newChat = await createChat(null);
        setChats((prev) => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
        currentChatIdToUse = newChat.id;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create chat for upload",
          variant: "destructive",
        });
        return;
      }
    }

    const uploadSingleFile = async (file: File) => {
      const uploadId = `upload_${uploadIdCounter.current++}`;

      const { promise, xhr } = uploadFileWithProgress(
        currentChatIdToUse!,
        file,
        (progress) => {
          setUploadTasks((prev) =>
            prev.map((task) =>
              task.id === uploadId ? { ...task, progress } : task
            )
          );
        }
      );

      setUploadTasks((prev) => [...prev, { id: uploadId, file, progress: 0, xhr }]);

      try {
        await promise;
        toast({
          title: "Success",
          description: `"${file.name}" uploaded, now processing...`,
        });
      } catch (error: any) {
        if (error.message === "Upload canceled.") {
          toast({
            title: "Cancelled",
            description: `Upload of ${file.name} canceled.`,
          });
        } else {
          toast({
            title: "Error",
            description: `Upload of ${file.name} failed`,
            variant: "destructive",
          });
        }
      } finally {
        setUploadTasks((prev) => prev.filter((task) => task.id !== uploadId));
      }
    };

    const uploadPromises = files.map((file) => uploadSingleFile(file));
    await Promise.allSettled(uploadPromises);

    // Reload documents after upload
    if (currentChatIdToUse) {
      await loadChatData(currentChatIdToUse);
    }
  };

  const handleCancelUpload = (id: string) => {
    setUploadTasks((prevTasks) => {
      const taskToCancel = prevTasks.find((task) => task.id === id);
      if (taskToCancel) {
        taskToCancel.xhr.abort();
      }
      return prevTasks.filter((task) => task.id !== id);
    });
  };

  const handleDeleteDocument = async (docName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${docName}"?`))
      return;
    if (!currentChatId) return;

    try {
      await deletePdf(currentChatId, docName);
      toast({
        title: "Success",
        description: "Document removed",
      });
      await loadChatData(currentChatId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove document",
        variant: "destructive",
      });
    }
  };

  const isDisabled = isLoading || uploadTasks.length > 0;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar with Chats - Only on desktop */}
      <div className="w-72 border-r bg-card flex flex-col hidden lg:flex overflow-hidden">
        {/* New Chat Button */}
        <div className="p-4 border-b flex-shrink-0">
          <Button
            onClick={handleCreateChat}
            className="w-full gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <p className="mb-2">No chats yet</p>
              <p className="text-xs">Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex items-center gap-1 rounded-lg transition-colors",
                    currentChatId === chat.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <button
                    onClick={() => setCurrentChatId(chat.id)}
                    className="flex-1 text-left p-3 rounded-lg transition-colors text-sm line-clamp-2"
                    title={chat.title}
                  >
                    {chat.title}
                  </button>
                  <button
                    onClick={() => handleRenameChat(chat.id, chat.title)}
                    className={cn(
                      "p-2 rounded transition-opacity hover:bg-white/20 text-current",
                      currentChatId === chat.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                    title="Rename chat"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteChat(chat.id)}
                    className={cn(
                      "p-2 rounded transition-opacity hover:bg-white/20 text-current",
                      currentChatId === chat.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                    title="Delete chat"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Messages */}
        {!currentChatId ? (
          <WelcomeScreen onPromptClick={handleSendMessage} />
        ) : (
          <>
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-6 bg-muted/50">
                <div className="max-w-4xl mx-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex w-full ${message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`w-full max-w-2xl ${message.sender === "user" ? "flex justify-end" : ""
                          }`}
                      >
                        <MessageBubble message={message} />
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start w-full">
                      <div className="bg-card border rounded-lg px-4 py-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div className="h-4" />
                </div>
              </div>
            </ScrollArea>

            {/* Input Area */}
            <ChatInput
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
              disabled={isDisabled}
              isUploading={uploadTasks.length > 0}
            />
          </>
        )}

        {/* Upload Progress */}
        {currentChatId && (
          <UploadProgressOverlay
            uploads={uploadTasks}
            onCancel={handleCancelUpload}
          />
        )}
      </div>

      {/* Delete Chat Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteChat} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Chat Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
              Enter a new title for this chat.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input
                id="name"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                className="col-span-3"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    confirmRenameChat();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRenameChat}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
