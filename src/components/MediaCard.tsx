import { motion } from "framer-motion";
import { Play, Download, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  title: string;
  thumbnail: string;
  duration?: string;
  type?: "video" | "photo";
  tags?: string[];
  index?: number;
  onClick?: () => void;
}

export const MediaCard = ({
  title,
  thumbnail,
  duration,
  type = "video",
  tags = [],
  index = 0,
  onClick,
}: MediaCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl glass cursor-pointer transition-smooth hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-secondary">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-smooth group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-smooth group-hover:opacity-100">
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full">
              <Play className="h-6 w-6 fill-current" />
            </Button>
            <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Duration Badge */}
        {duration && (
          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-medium">
            {duration}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 truncate">{title}</h3>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 rounded text-xs bg-secondary text-muted-foreground">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Menu */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 opacity-0 transition-smooth group-hover:opacity-100"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};
