import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Grid, List, Edit3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MediaFilters } from "@/components/MediaFilters";

export default function Videos() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [videos, setVideos] = useState<any[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSize, setTotalSize] = useState(0);
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterAndSortVideos();
  }, [videos, dateRange, selectedPeople, sortBy]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .eq("asset_type", "video")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedVideos = data.map((video: any) => ({
          id: video.id,
          title: video.title,
          thumbnail:
            video.thumbnail_url ||
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop",
          duration: video.duration || 0,
          tags: video.tags || [],
          created_at: video.created_at,
          file_size: video.file_size || 0,
          ai_metadata: video.ai_metadata || {},
          file_url: video.file_url,
        }));
        setVideos(formattedVideos);
        setFilteredVideos(formattedVideos);

        const total = data.reduce((sum, video) => sum + (video.file_size || 0), 0);
        setTotalSize(total);
      }
    } catch (error) {
      console.error("Failed to load videos:", error);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const filterAndSortVideos = () => {
    let result = [...videos];

    // Date filter
    if (dateRange.from || dateRange.to) {
      result = result.filter((v) => {
        const date = new Date(v.created_at);
        if (dateRange.from && date < dateRange.from) return false;
        if (dateRange.to && date > dateRange.to) return false;
        return true;
      });
    }

    // People filter
    if (selectedPeople.length > 0) {
      result = result.filter((v) => {
        const detected = v.ai_metadata?.detected_people || [];
        return selectedPeople.some((p) => detected.includes(p));
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "size-desc":
          return b.file_size - a.file_size;
        case "size-asc":
          return a.file_size - b.file_size;
        default:
          return 0;
      }
    });

    setFilteredVideos(result);
  };

  // Get unique people from all videos
  const availablePeople = Array.from(
    new Set(videos.flatMap((v) => v.ai_metadata?.detected_people || []))
  ).sort();

  if (loading) {
    return (
      <div className="flex-1">
        <Header />
        <main className="pt-16 p-6 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header />
      <main className="pt-16 p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Video Library</h1>
            <p className="text-muted-foreground">
              {filteredVideos.length} of {videos.length} videos • {formatBytes(totalSize)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <MediaFilters
          onDateRangeChange={setDateRange}
          onSortChange={setSortBy}
          onPeopleFilter={setSelectedPeople}
          currentSort={sortBy}
          availablePeople={availablePeople}
        />

        {filteredVideos.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            {videos.length === 0
              ? "No videos uploaded yet."
              : "No videos match your filters."}
          </p>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                className="group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/videos/${video.id}`)}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border shadow-sm">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                    {formatDuration(video.duration)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-primary-foreground"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-12 w-12 rounded-full"
                    >
                      <Edit3 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 mt-2">{video.title}</h3>
                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {video.tags.slice(0, 2).map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}