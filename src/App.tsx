import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Home from "./pages/Home";
import Explorer from "./pages/Explorer";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Jobs from "./pages/Jobs";
import Models from "./pages/Models";
import ModelPerformance from "./pages/ModelPerformance";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import VideoDetail from "./pages/VideoDetail";
import Videos from "./pages/Videos";
import Dashboard from "./pages/Dashboard";
import Photos from "./pages/Photos";
import Upload from "./pages/Upload";
import PopulateLibraries from "./pages/PopulateLibraries";
import TextToSpeech from "./pages/TextToSpeech";
import SpeechToText from "./pages/SpeechToText";
import NotFound from "./pages/NotFound";
import PhotoDetail from "./pages/PhotoDetail";
import Requests from "./pages/Requests";
import ActivityLog from "./pages/ActivityLog";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider defaultOpen={true}>
            <AppContent />
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const AppContent = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== '/';
  const { open, setOpen } = useSidebar();

  // Auto-collapse sidebar on library pages
  useEffect(() => {
    if (showSidebar) {
      setOpen(false);
    }
  }, [location.pathname, showSidebar, setOpen]);

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      {showSidebar && <Sidebar />}
      <main className={cn(
        "pt-16 transition-all duration-300",
        showSidebar && (open ? "ml-64" : "ml-16")
      )}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/models" element={<Models />} />
          <Route path="/model-performance" element={<ModelPerformance />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/videos/:id" element={<VideoDetail />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/photos/:id" element={<PhotoDetail />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/populate-libraries" element={<PopulateLibraries />} />
          <Route path="/text-to-speech" element={<TextToSpeech />} />
          <Route path="/speech-to-text" element={<SpeechToText />} />
          <Route path="/activity-log" element={<ActivityLog />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
