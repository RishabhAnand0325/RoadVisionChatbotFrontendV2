import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  Scale,
  Brain,
  FileText,
  Building2,
} from "lucide-react";

const moduleGroups = [
  {
    label: "Core Services",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Ask CeigallAI",
        url: "/ask-ai",
        icon: MessageSquare,
      },
      {
        title: "DMSIQ",
        url: "/dms",
        icon: FolderOpen,
      },
    ],
  },
  {
    label: "AI Intelligence",
    items: [
      // {
      //   title: "CeigallIQ",
      //   url: "/ceigalliq",
      //   icon: Scale,
      // },
      {
        title: "TenderIQ",
        url: "/tenderiq",
        icon: FileText,
      },
    ],
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    // Exact match for paths to avoid /dms matching /dmsiq
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Ceigall AI</span>
              <span className="text-xs text-muted-foreground">Platform</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {moduleGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        isActive={isActive(item.url)}
                        tooltip={item.title}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
