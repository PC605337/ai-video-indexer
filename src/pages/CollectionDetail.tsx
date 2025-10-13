import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List } from "lucide-react";
import { MediaCard } from "@/components/MediaCard";
import { useState } from "react";

const mockItems = {
  people: [
    { id: "1", title: "Akio Toyoda - Chairman Profile", thumbnail: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800", type: "video" as const, tags: ["Executive", "Chairman"] },
    { id: "2", title: "Koji Sato - President Interview", thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800", type: "video" as const, tags: ["Executive", "President"] },
  ],
  events: [
    { id: "1", title: "2024 Camry Launch Event", thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800", type: "video" as const, tags: ["Launch", "2024"] },
  ],
  vehicles: [
    { id: "1", title: "2024 Toyota Camry", thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800", type: "photo" as const, tags: ["Camry", "2024"] },
  ],
  "toyota-plants": [
    { id: "1", title: "Georgetown Plant Tour", thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800", type: "video" as const, tags: ["Manufacturing", "Kentucky"] },
  ],
  "executive-biographies": [
    { id: "1", title: "Akio Toyoda Biography", thumbnail: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800", type: "video" as const, tags: ["Biography", "Chairman"] },
  ],
  "languages-regions": [
    { id: "1", title: "Global Operations Overview", thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800", type: "video" as const, tags: ["Global", "Overview"] },
  ],
};

const CollectionDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const collectionName = slug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || "";
  const items = mockItems[slug as keyof typeof mockItems] || [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">{collectionName}</h1>
            <p className="text-muted-foreground">{items.length} items in this collection</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search in collection..."
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
            {items.map((item, index) => (
              <MediaCard
                key={item.id}
                title={item.title}
                thumbnail={item.thumbnail}
                type={item.type}
                tags={item.tags}
                index={index}
                onClick={() => navigate(`/videos/${item.id}`)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollectionDetail;
