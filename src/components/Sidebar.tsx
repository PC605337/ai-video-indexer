import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  FolderOpen,
  Briefcase,
  Cpu,
  BarChart3,
  Users,
  Settings,
  CloudUpload,
  Image,
  Mic,
  Volume2,
  Database,
  FileText,
  ChevronRight,
  TrendingUp,
  Activity,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Video", path: "/explorer" },
  { icon: Image, label: "Photos", path: "/photos" },
  { icon: FolderOpen, label: "Collections", path: "/collections" },
  { icon: Mic, label: "Speech-to-Text", path: "/speech-to-text" },
  { icon: Volume2, label: "Text-to-Speech", path: "/text-to-speech" },
];

const uploadItems = [
  { icon: CloudUpload, label: "Upload Media", path: "/upload" },
  { icon: Briefcase, label: "Jobs", path: "/jobs" },
];

const analyticsItems = [
  { icon: TrendingUp, label: "Library Analytics", path: "/dashboard" },
  { icon: BarChart3, label: "Overall Model Analytics", path: "/analytics" },
  { icon: Activity, label: "Model Performance", path: "/model-performance" },
  { icon: GraduationCap, label: "Model Training", path: "/models" },
];

const adminItems = [
  { icon: Users, label: "Users", path: "/users" },
  { icon: FileText, label: "Requests", path: "/requests" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();
  const [isHovering, setIsHovering] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const shouldExpand = open || isHovering;
  const isAnalyticsActive = analyticsItems.some(item => location.pathname === item.path);
  const isUploadActive = uploadItems.some(item => location.pathname === item.path);
  const isAdminActive = adminItems.some(item => location.pathname === item.path);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] glass border-r border-border z-20 transition-all duration-300",
        shouldExpand ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
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
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  !open && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {shouldExpand && <span>{item.label}</span>}
              </NavLink>
            );

            if (!shouldExpand) {
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

          {/* Upload Collapsible */}
          {shouldExpand ? (
            <Collapsible open={uploadOpen} onOpenChange={setUploadOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex items-center justify-between w-full gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isUploadActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <CloudUpload className="h-5 w-5 shrink-0" />
                    <span>Upload</span>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-transform",
                    uploadOpen && "rotate-90"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                {uploadItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg pl-11 pr-3 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setOpen(true)}
                  className={cn(
                    "flex items-center justify-center w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isUploadActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <CloudUpload className="h-5 w-5 shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Upload
              </TooltipContent>
            </Tooltip>
          )}

          {/* Platform Analytics Collapsible */}
          {shouldExpand ? (
            <Collapsible open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex items-center justify-between w-full gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isAnalyticsActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 shrink-0" />
                    <span>Platform Analytics</span>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-transform",
                    analyticsOpen && "rotate-90"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                {analyticsItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg pl-11 pr-3 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setOpen(true)}
                  className={cn(
                    "flex items-center justify-center w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isAnalyticsActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <BarChart3 className="h-5 w-5 shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Platform Analytics
              </TooltipContent>
            </Tooltip>
          )}

          {/* Platform Administration Collapsible */}
          {shouldExpand ? (
            <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex items-center justify-between w-full gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isAdminActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 shrink-0" />
                    <span>Platform Administration</span>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-transform",
                    adminOpen && "rotate-90"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                {adminItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg pl-11 pr-3 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setOpen(true)}
                  className={cn(
                    "flex items-center justify-center w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isAdminActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Settings className="h-5 w-5 shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Platform Administration
              </TooltipContent>
            </Tooltip>
          )}
        </nav>


        {/* User Section */}
        <div className="border-t border-border p-3">
          <div className={cn("flex items-center gap-3", !shouldExpand && "justify-center")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
              SA
            </div>
            {shouldExpand && (
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
