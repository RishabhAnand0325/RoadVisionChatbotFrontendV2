import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatTopNav } from "./ChatTopNav";

interface ChatLayoutProps {
  children: ReactNode;
}

export function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
        <ChatTopNav />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
