import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
          <footer className="border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
            Ceigall AI Platform © RoadVision AI – 2025
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
