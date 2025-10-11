import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Film,
  Image,
  Upload,
  Settings,
  BarChart3,
  Shield,
  Cpu,
} from "lucide-react";
import toyotaIcon from "@/assets/toyota-icon.png";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Film, label: "Video Library", path: "/videos" },
  { icon: Image, label: "Photo Library", path: "/photos" },
  { icon: Upload, label: "Upload", path: "/upload" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Cpu, label: "AI Governance", path: "/ai-governance" },
  { icon: Shield, label: "Security", path: "/security" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 glass border-r border-border transition-smooth">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <img src={toyotaIcon} alt="AI Platform" className="h-8 w-8" />
          <div>
            <h1 className="text-lg font-bold gradient-text">AI Indexer</h1>
            <p className="text-xs text-muted-foreground">Enterprise Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              SA
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Super Admin</p>
              <p className="text-xs text-muted-foreground">admin@enterprise.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
