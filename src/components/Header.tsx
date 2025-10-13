import { Search, Bell, User, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import toyotaIcon from "@/assets/toyota-icon.png";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 glass border-b border-border">
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo and App Name */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <img src={toyotaIcon} alt="AI Platform" className="h-8 w-8 shrink-0" />
          <div>
            <h1 className="text-lg font-bold gradient-text">AI Indexer</h1>
            <p className="text-xs text-muted-foreground">Enterprise Platform</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search faces, vehicles, locations, objects, scenes..."
              className="pl-10 bg-secondary border-border"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/upload')}
            title="Upload"
          >
            <Upload className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative" title="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <Button variant="ghost" size="icon" title="User Profile">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
