import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Search, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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
  const [allPhotos, setAllPhotos] = useState(photos);
  const [filteredPhotos, setFilteredPhotos] = useState(photos);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const itemsPerPage = 12; // Adjusted for better pagination visibility

  // Mock created_at dates and file_size for photos
  const photosWithMetadata = photos.map((photo, idx) => ({
    ...photo,
    created_at: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
    file_size: Math.floor(Math.random() * 10000000) + 1000000,
    ai_metadata: {
      detected_people: idx % 3 === 0 ? ["John Doe", "Jane Smith"] : idx % 2 === 0 ? ["Jane Smith"] : [],
    },
  }));

  useEffect(() => {
    setAllPhotos(photosWithMetadata);
    setFilteredPhotos(photosWithMetadata);
  }, []);

  useEffect(() => {
    filterAndSortPhotos();
  }, [dateRange, selectedPeople, sortBy]);

  const filterAndSortPhotos = () => {
    let result = [...photosWithMetadata];

    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      result = result.filter(photo => {
        const photoDate = new Date(photo.created_at);
        if (dateRange.from && photoDate < dateRange.from) return false;
        if (dateRange.to && photoDate > dateRange.to) return false;
        return true;
      });
    }

    // Apply people filter
    if (selectedPeople.length > 0) {
      result = result.filter(photo => {
        const detectedPeople = photo.ai_metadata?.detected_people || [];
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

    setFilteredPhotos(result);
    setCurrentPage(1);
  };

  // Get unique people from all photos
  const availablePeople = Array.from(
    new Set(
      photosWithMetadata.flatMap(p => p.ai_metadata?.detected_people || [])
    )
  ).sort();

  // Pagination
  const totalPages = Math.ceil(filteredPhotos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPhotos = filteredPhotos.slice(startIndex, startIndex + itemsPerPage);

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

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">Photo Library</h1>
            <p className="text-muted-foreground">
              {filteredPhotos.length.toLocaleString()} of {photosWithMetadata.length.toLocaleString()} photos
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

        <MediaFilters
          onDateRangeChange={setDateRange}
          onSortChange={setSortBy}
          onPeopleFilter={setSelectedPeople}
          currentSort={sortBy}
          availablePeople={availablePeople}
        />

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedPhotos.map((photo, index) => (
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
                  loading="lazy"
                  width="160"
                  height="90"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded">
                  {photo.resolution}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-scale-in">
                    <Image className="w-5 h-5 text-primary-foreground" />
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
      </div>
    </main>
  );
};

export default Photos;
