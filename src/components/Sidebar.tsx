import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  FolderOpen,
  Briefcase,
  Cpu,
  Activity,
  BarChart3,
  Users,
  Settings,
  CloudUpload,
} from "lucide-react";
import toyotaIcon from "@/assets/toyota-icon.png";
import { Button } from "@/components/ui/button";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Explorer", path: "/explorer" },
  { icon: FolderOpen, label: "Collections", path: "/collections" },
  { icon: Briefcase, label: "Jobs", path: "/jobs" },
  { icon: Cpu, label: "Models", path: "/models" },
  { icon: Activity, label: "Model Performance", path: "/model-performance" },
  { icon: BarChart3, label: "Model Analytics", path: "/analytics" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { open } = useSidebar();

  return (
    <SidebarRoot className="border-r border-border" collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={toyotaIcon} alt="AI Platform" className="h-8 w-8 shrink-0" />
            {open && (
              <div className="min-w-0">
                <h1 className="text-lg font-bold gradient-text truncate">AI Indexer</h1>
                <p className="text-xs text-muted-foreground truncate">Enterprise Platform</p>
              </div>
            )}
          </div>
          {open && (
            <Button 
              size="icon" 
              className="h-9 w-9 bg-primary hover:bg-primary/90 shrink-0"
              onClick={() => navigate('/upload')}
            >
              <CloudUpload className="h-5 w-5" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <NavLink to={item.path}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <div className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
            SA
          </div>
          {open && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Super Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@enterprise.com</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </SidebarRoot>
  );
};
