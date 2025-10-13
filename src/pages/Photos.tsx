import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Mock photo data
const photos = [
  {
    id: "photo-1",
    title: "Lexus ES 2025 - Product Shoot",
    thumbnail: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=225&auto=format&fit=crop",
    resolution: "6000 x 4000",
    tags: ["Lexus", "ES 2025", "Product"],
  },
  {
    id: "photo-2",
    title: "GR Supra - Track Day Action",
    thumbnail: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&h=225&auto=format&fit=crop",
    resolution: "5472 x 3648",
    tags: ["GR Supra", "Sports", "Track"],
  },
  {
    id: "photo-3",
    title: "Manufacturing Excellence",
    thumbnail: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&h=225&auto=format&fit=crop",
    resolution: "4928 x 3264",
    tags: ["Manufacturing", "Plant"],
  },
  {
    id: "photo-4",
    title: "Executive Portrait",
    thumbnail: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=225&auto=format&fit=crop",
    resolution: "6000 x 4000",
    tags: ["Executive", "Portrait"],
  },
  {
    id: "photo-5",
    title: "Prius Prime - Hybrid Tech",
    thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=225&auto=format&fit=crop",
    resolution: "5184 x 3456",
    tags: ["Prius", "Hybrid", "Tech"],
  },
  {
    id: "photo-6",
    title: "Lexus LX 600 - Desert",
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=225&auto=format&fit=crop",
    resolution: "6720 x 4480",
    tags: ["Lexus", "LX 600", "Adventure"],
  },
];

const Photos = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">Photo Library</h1>
            <p className="text-muted-foreground">
              2,458,342 photos • 8.4 PB total
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

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search photos by keywords, people, locations..."
            className="pl-10"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2"
        >
          {["All", "Vehicles", "People", "Products", "Events", "Protected"].map(
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

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/photos/${photo.id}`)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img
                  src={photo.thumbnail}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                  {photo.resolution}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-scale-in">
                    <Image className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {photo.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {photo.tags.slice(0, 2).map((tag, i) => (
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
            Load More Photos
          </Button>
        </motion.div>
      </div>
    </main>
  );
};

export default Photos;
