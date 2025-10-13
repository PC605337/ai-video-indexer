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
  Image,
  Mic,
  Volume2,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Explorer", path: "/explorer" },
  { icon: Image, label: "Photos", path: "/photos" },
  { icon: FolderOpen, label: "Collections", path: "/collections" },
  { icon: Briefcase, label: "Jobs", path: "/jobs" },
  { icon: Cpu, label: "Models", path: "/models" },
  { icon: Activity, label: "Model Performance", path: "/model-performance" },
  { icon: BarChart3, label: "Model Analytics", path: "/analytics" },
  { icon: Mic, label: "Speech-to-Text", path: "/speech-to-text" },
  { icon: Volume2, label: "Text-to-Speech", path: "/text-to-speech" },
  { icon: Database, label: "Populate Libraries", path: "/populate-libraries" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass border-r border-border z-20">
      <div className="flex h-full flex-col">
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
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );

            return <div key={item.path}>{linkContent}</div>;
          })}
        </nav>

        {/* Upload Button */}
        <div className="px-3 pb-3">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 gap-2"
            onClick={() => navigate('/upload')}
          >
            <CloudUpload className="h-5 w-5" />
            Upload Media
          </Button>
        </div>

        {/* User Section */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Super Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@enterprise.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
