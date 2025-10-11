import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MediaCard } from "@/components/MediaCard";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const videos = [
  {
    id: 1,
    title: "Lexus ES 2025 - Launch Campaign",
    thumbnail: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop",
    duration: "4:32",
    tags: ["Lexus", "ES 2025", "Campaign", "Commercial"],
  },
  {
    id: 2,
    title: "Toyota GR Supra - Track Day",
    thumbnail: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&auto=format&fit=crop",
    duration: "8:15",
    tags: ["Toyota", "GR Supra", "Performance", "Track"],
  },
  {
    id: 3,
    title: "Manufacturing Excellence - Texas Plant",
    thumbnail: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&auto=format&fit=crop",
    duration: "12:40",
    tags: ["Manufacturing", "Texas", "Plant Tour"],
  },
  {
    id: 4,
    title: "CEO Interview - Q1 2025 Strategy",
    thumbnail: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&auto=format&fit=crop",
    duration: "15:22",
    tags: ["Executive", "Interview", "Strategy", "2025"],
  },
  {
    id: 5,
    title: "Prius Prime - Hybrid Technology",
    thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop",
    duration: "6:18",
    tags: ["Toyota", "Prius", "Hybrid", "Tech"],
  },
  {
    id: 6,
    title: "Lexus LX 600 - Desert Adventure",
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop",
    duration: "9:45",
    tags: ["Lexus", "LX 600", "Adventure", "Off-Road"],
  },
  {
    id: 7,
    title: "Toyota Tacoma - Capability Showcase",
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop",
    duration: "5:30",
    tags: ["Toyota", "Tacoma", "Truck", "Capability"],
  },
  {
    id: 8,
    title: "Innovation Lab - Future Mobility",
    thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
    duration: "11:12",
    tags: ["Innovation", "Future", "Mobility", "R&D"],
  },
];

export default function Videos() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
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
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-4"
              }
            >
              {videos.map((video, index) => (
                <MediaCard
                  key={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  duration={video.duration}
                  type="video"
                  tags={video.tags}
                  index={index}
                />
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
    </div>
  );
}
