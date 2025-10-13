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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toyotaIcon from "@/assets/toyota-icon.png";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen glass border-r border-border transition-all duration-300",
        open ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header with Logo and Toggle */}
        <div className="flex h-16 items-center justify-between border-b border-border px-3">
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            <img src={toyotaIcon} alt="AI Platform" className="h-8 w-8 shrink-0" />
            {open && (
              <div className="min-w-0">
                <h1 className="text-lg font-bold gradient-text truncate">AI Indexer</h1>
                <p className="text-xs text-muted-foreground truncate">Enterprise Platform</p>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className="h-8 w-8 shrink-0"
          >
            {open ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            const linkContent = (
              <NavLink
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  !open && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {open && <span>{item.label}</span>}
              </NavLink>
            );

            if (!open) {
              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.path}>{linkContent}</div>;
          })}
        </nav>

        {/* Upload Button */}
        {open && (
          <div className="px-3 pb-3">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 gap-2"
              onClick={() => navigate('/upload')}
            >
              <CloudUpload className="h-5 w-5" />
              Upload Media
            </Button>
          </div>
        )}

        {/* User Section */}
        <div className="border-t border-border p-3">
          <div className={cn("flex items-center gap-3", !open && "justify-center")}>
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
        </div>
      </div>
    </aside>
  );
};
