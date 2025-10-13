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
  Menu,
  X,
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
import { cn } from "@/lib/utils";

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
  const { open, setOpen } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <SidebarRoot 
        className={cn(
          "border-r border-border transition-all duration-300 ease-in-out",
          "fixed lg:relative z-50"
        )} 
        collapsible="icon"
      >
        <SidebarHeader className="border-b border-border">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3 min-w-0">
              <img src={toyotaIcon} alt="AI Platform" className="h-8 w-8 shrink-0" />
              {open && (
                <div className="min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
                  <h1 className="text-lg font-bold gradient-text truncate">AI Indexer</h1>
                  <p className="text-xs text-muted-foreground truncate">Enterprise Platform</p>
                </div>
              )}
            </div>
            
            {/* Interactive collapse toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)}
              className={cn(
                "h-9 w-9 shrink-0 transition-transform duration-300",
                !open && "rotate-180"
              )}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            {open && (
              <SidebarGroupLabel className="animate-in fade-in slide-in-from-left-2 duration-200">
                Navigation
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={!open ? item.label : undefined}
                        className="transition-all duration-200"
                      >
                        <NavLink to={item.path}>
                          <item.icon className="h-5 w-5 shrink-0" />
                          {open && (
                            <span className="animate-in fade-in slide-in-from-left-2 duration-200">
                              {item.label}
                            </span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Upload button in sidebar when expanded */}
          {open && (
            <div className="px-4 mt-4 animate-in fade-in slide-in-from-left-2 duration-200">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 gap-2"
                onClick={() => navigate('/upload')}
              >
                <CloudUpload className="h-5 w-5" />
                Upload Media
              </Button>
            </div>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t border-border">
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
              SA
            </div>
            {open && (
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
                <p className="text-sm font-medium truncate">Super Admin</p>
                <p className="text-xs text-muted-foreground truncate">admin@enterprise.com</p>
              </div>
            )}
          </div>
        </SidebarFooter>
      </SidebarRoot>
    </>
  );
};
