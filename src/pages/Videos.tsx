import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { MediaCard } from "@/components/MediaCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const videos = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    title: "Lexus ES 2025 - Launch Campaign",
    thumbnail: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop",
    duration: "4:32",
    tags: ["Lexus", "ES 2025", "Campaign", "Commercial"],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "GR Supra - Track Day",
    thumbnail: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&auto=format&fit=crop",
    duration: "8:15",
    tags: ["Sports Car", "GR Supra", "Performance", "Track"],
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    title: "Manufacturing Excellence - Texas Plant",
    thumbnail: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&auto=format&fit=crop",
    duration: "12:40",
    tags: ["Manufacturing", "Texas", "Plant Tour"],
  },
  {
    id: "6ba7b811-9dad-11d1-80b4-00c04fd430c9",
    title: "CEO Interview - Q1 2025 Strategy",
    thumbnail: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&auto=format&fit=crop",
    duration: "15:22",
    tags: ["Executive", "Interview", "Strategy", "2025"],
  },
  {
    id: "6ba7b812-9dad-11d1-80b4-00c04fd430d0",
    title: "Prius Prime - Hybrid Technology",
    thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop",
    duration: "6:18",
    tags: ["Hybrid", "Prius", "Electric", "Tech"],
  },
  {
    id: "6ba7b813-9dad-11d1-80b4-00c04fd430d1",
    title: "Lexus LX 600 - Desert Adventure",
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop",
    duration: "9:45",
    tags: ["Lexus", "LX 600", "Adventure", "Off-Road"],
  },
  {
    id: "6ba7b814-9dad-11d1-80b4-00c04fd430d2",
    title: "Tacoma - Capability Showcase",
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop",
    duration: "5:30",
    tags: ["Pickup", "Tacoma", "Truck", "Capability"],
  },
  {
    id: "6ba7b815-9dad-11d1-80b4-00c04fd430d3",
    title: "Innovation Lab - Future Mobility",
    thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
    duration: "11:12",
    tags: ["Innovation", "Future", "Mobility", "R&D"],
  },
];

export default function Videos() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex-1">
      <Header />
      <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between animate-fade-in-up">
              <div>
                <h1 className="text-3xl font-bold mb-2">Video Library</h1>
                <p className="text-muted-foreground">
                  842,453 videos • 2.1 PB total
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
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

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-2"
            >
              {["All", "Vehicles", "People", "Locations", "Events", "Protected"].map(
                (filter) => (
                  <Button
                    key={filter}
                    variant={filter === "All" ? "default" : "outline"}
                    size="sm"
                  >
                    {filter}
                  </Button>
                )
              )}
            </motion.div>

            {/* Video Grid */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {videos.map((video, index) => (
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-mono">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-scale-in">
                        <svg className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {video.tags.slice(0, 2).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center pt-6"
            >
              <Button variant="outline" size="lg">
                Load More Videos
              </Button>
            </motion.div>
          </div>
        </main>
      </div>
  );
}
