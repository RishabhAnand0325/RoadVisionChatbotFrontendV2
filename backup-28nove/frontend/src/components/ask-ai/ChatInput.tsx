import React, { useState, useRef, useEffect } from "react";
import { Send, Loader, Upload, X, FileText } from "lucide-react"; // 1. Imported X and FileText
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (files: File[]) => void;
  disabled: boolean;
  isUploading: boolean;
}

export function ChatInput({
  onSendMessage,
  onFileUpload,
  disabled,
  isUploading,
}: ChatInputProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null); // 2. New state for file name
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [inputMessage]);

  const handleSend = () => {
    if (disabled || !inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") {
      setInputMessage("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      return;
    }
    const fileList = e.target.files;
    const files: File[] = [];

    for (let i = 0; i < fileList.length; i++) {
      files.push(fileList[i]);
    }

    if (files.length > 0) {
      onFileUpload(files);
      
      // 3. Set the name for display
      if (files.length === 1) {
        setSelectedFileName(files[0].name);
      } else {
        setSelectedFileName(`${files.length} files uploaded`);
      }
    }

    if (e.target) e.target.value = "";
  };

  // 4. Function to clear the file label
  const clearSelectedFile = () => {
    setSelectedFileName(null);
  };

  return (
    <div className="bg-background/80 backdrop-blur-sm border-t p-4 pb-1">
      <div className="flex flex-col gap-4 border rounded-lg p-2 focus-within:border-primary transition-all focus-within:shadow">
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Ceigall AI anything..."
          className="w-full focus:outline-none resize-none overflow-hidden bg-transparent text-foreground placeholder:text-muted-foreground"
          disabled={disabled}
          rows={1}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"> {/* 5. Added flex container with gap */}
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              variant="default"
              className="gap-2"
            >
              {isUploading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">Upload File</span>
            </Button>

            {/* 6. The New File Name Section */}
            {selectedFileName && (
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md border border-border animate-in fade-in slide-in-from-left-2">
                <FileText className="w-4 h-4 text-primary" />
                <span 
                  className="text-xs font-medium max-w-[150px] truncate text-foreground" 
                  title={selectedFileName}
                >
                  {selectedFileName}
                </span>
                <button 
                  onClick={clearSelectedFile}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-1 p-0.5 rounded-full hover:bg-background"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={disabled || !inputMessage.trim()}
            size="icon"
          >
            {disabled && !isUploading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Shift+Enter for new line. Esc to clear.
      </p>
    </div>
  );
}
