import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DMSTopNav } from "./DMSTopNav";

interface DMSLayoutProps {
  children: ReactNode;
}

export function DMSLayout({ children }: DMSLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
        <DMSTopNav />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
