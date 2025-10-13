import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List, Filter } from "lucide-react";
import { MediaCard } from "@/components/MediaCard";
import { useNavigate } from "react-router-dom";

const mockVideos = [
  {
    id: "1",
    title: "Toyota Camry 2024 Launch Event",
    thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop",
    duration: "5:42",
    tags: ["Camry", "Launch", "2024"],
  },
  {
    id: "2",
    title: "Executive Interview - Akio Toyoda",
    thumbnail: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&auto=format&fit=crop",
    duration: "12:18",
    tags: ["Executive", "Interview"],
  },
  {
    id: "3",
    title: "Toyota Manufacturing Plant Tour",
    thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
    duration: "8:30",
    tags: ["Manufacturing", "Plant Tour"],
  },
];

const Explorer = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Explorer</h1>
            <p className="text-muted-foreground">Search and discover your media library</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by people, vehicles, keywords, emotions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {mockVideos.map((video) => (
              <MediaCard
                key={video.id}
                title={video.title}
                thumbnail={video.thumbnail}
                duration={video.duration}
                tags={video.tags}
                onClick={() => navigate(`/videos/${video.id}`)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explorer;
