import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid, List, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MediaFilters } from "@/components/MediaFilters";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Videos() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [videos, setVideos] = useState<any[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSize, setTotalSize] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const itemsPerPage = 12; // Adjusted for better pagination visibility

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterAndSortVideos();
  }, [videos, dateRange, selectedPeople, sortBy]);

  const loadVideos = async () => {
    try {
      setLoading(true);
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
          thumbnail: video.thumbnail_url || "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop",
          duration: formatDuration(video.duration || 0),
          tags: video.tags || [],
          created_at: video.created_at,
          file_size: video.file_size || 0,
          ai_metadata: video.ai_metadata || {},
        }));
        setVideos(formattedVideos);
        setFilteredVideos(formattedVideos);

        const total = data.reduce((sum, video) => sum + (video.file_size || 0), 0);
        setTotalSize(total);
      }
    } catch (error: any) {
      console.error("Error loading videos:", error);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const filterAndSortVideos = () => {
    let result = [...videos];

    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      result = result.filter(video => {
        const videoDate = new Date(video.created_at);
        if (dateRange.from && videoDate < dateRange.from) return false;
        if (dateRange.to && videoDate > dateRange.to) return false;
        return true;
      });
    }

    // Apply people filter
    if (selectedPeople.length > 0) {
      result = result.filter(video => {
        const detectedPeople = video.ai_metadata?.detected_people || [];
        return selectedPeople.some(person => detectedPeople.includes(person));
      });
    }

    // Apply sorting
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
        case "people-desc":
          const aPeople = a.ai_metadata?.detected_people?.length || 0;
          const bPeople = b.ai_metadata?.detected_people?.length || 0;
          return bPeople - aPeople;
        default:
          return 0;
      }
    });

    setFilteredVideos(result);
    setCurrentPage(1);
  };

  // Get unique people from all videos
  const availablePeople = Array.from(
    new Set(
      videos.flatMap(v => v.ai_metadata?.detected_people || [])
    )
  ).sort();

  // Pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVideos = filteredVideos.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= showPages; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - showPages + 1; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="flex-1">
        <Header />
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header />
      <main className="pt-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between animate-fade-in-up">
            <div>
              <h1 className="text-3xl font-bold mb-2">Video Library</h1>
              <p className="text-muted-foreground">
                {filteredVideos.length.toLocaleString()} of {videos.length.toLocaleString()} videos • {formatBytes(totalSize)}
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
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {videos.length === 0 
                  ? "No videos found. Upload your first video to get started." 
                  : "No videos match your filters. Try adjusting your search criteria."}
              </p>
            </div>
          ) : (
            <>
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {paginatedVideos.map((video, index) => (
                <motion.div 
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/videos/${video.id}`)} 
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      loading="lazy"
                      width="160"
                      height="90"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-scale-in">
                        <svg className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {video.tags.slice(0, 2).map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {getPageNumbers().map((pageNum, idx) => (
                      <PaginationItem key={idx}>
                        {pageNum === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum as number)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
