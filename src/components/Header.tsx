import { Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar } = useSidebar();
  const showSidebarToggle = location.pathname !== '/';

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 glass border-b border-border">
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo and App Name */}
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              title="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.9"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">AI Indexer</h1>
              <p className="text-xs text-muted-foreground">Enterprise Platform</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative" 
            onClick={() => navigate('/notifications')}
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/users')}
            title="User Profile"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
