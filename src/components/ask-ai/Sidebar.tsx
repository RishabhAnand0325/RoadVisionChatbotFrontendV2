import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatHistory } from "./ChatHistory";
import { ChatMetadata } from "@/lib/types/ask-ai";
import { cn } from "@/lib/utils";

interface SidebarProps {
  chats: ChatMetadata[];
  currentChatId: string | null;
  onCreateChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onSelectChat: (chatId: string) => void;
  onRenameChat: (chatId: string, title: string) => void;
}

export function Sidebar({
  chats,
  currentChatId,
  onCreateChat,
  onDeleteChat,
  onSelectChat,
  onRenameChat,
}: SidebarProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (chat: ChatMetadata) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleSaveEdit = (chatId: string) => {
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim());
      handleCancelEdit();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-card h-full transition-all duration-300 overflow-hidden",
        "w-80"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">Chats</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (isSearching) setSearchQuery("");
            setIsSearching(!isSearching);
          }}
          className="h-8 w-8"
        >
          {isSearching ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {isSearching && (
        <div className="px-4 py-2 border-b">
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
            autoFocus
          />
        </div>
      )}

      <div className="p-4 border-b">
        <Button onClick={onCreateChat} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <ChatHistory
        chats={filteredChats}
        activeChatId={currentChatId}
        editingChatId={editingChatId}
        editTitle={editTitle}
        onEditChange={setEditTitle}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
        onDelete={onDeleteChat}
      />
    </div>
  );
}
