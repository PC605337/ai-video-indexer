import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Download, MoreVertical, Edit3, FileVideo, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MediaCardProps {
  title: string;
  thumbnail: string;
  duration?: string;
  type?: "video" | "photo";
  tags?: string[];
  index?: number;
  onClick?: () => void;
  assetId?: string;
  assetUrl?: string;
}

export const MediaCard = ({
  title,
  thumbnail,
  duration,
  type = "video",
  tags = [],
  index = 0,
  onClick,
  assetId,
  assetUrl,
}: MediaCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isEditSessionActive, setIsEditSessionActive] = useState(false);

  const handleOpenInEditor = async (software: string) => {
    try {
      // Track the edit session
      const { error } = await supabase.from("asset_edit_sessions").insert([{
        asset_id: assetId,
        editor_id: "00000000-0000-0000-0000-000000000000",
        software: software,
        status: "in_progress",
        metadata: { opened_from: "media_card" },
      }]);

      if (error) throw error;

      setIsEditSessionActive(true);
      toast.success(`Opening in ${software}...`, {
        description: "Download the asset and open it in your editing software.",
      });
      
      // Open the asset URL for download
      if (assetUrl) {
        window.open(assetUrl, "_blank");
      }

      setShowEditDialog(false);
    } catch (error) {
      toast.error("Failed to open in editor");
      console.error(error);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditDialog(true);
  };

  return (
    <>
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
            {assetId && (
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-12 w-12 rounded-full"
                onClick={handleEditClick}
              >
                <Edit3 className="h-5 w-5" />
              </Button>
            )}
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

      {/* Edit Badge */}
      {isEditSessionActive && (
        <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
          Editing
        </Badge>
      )}

      {/* Menu */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 opacity-0 transition-smooth group-hover:opacity-100"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    </motion.div>

    {/* Edit Dialog */}
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Open in Editing Software
          </DialogTitle>
          <DialogDescription>
            Select your preferred editing software to open and edit this {type}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {type === "video" ? (
            <>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={() => handleOpenInEditor("Adobe Premiere Pro")}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10">
                  <FileVideo className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold">Adobe Premiere Pro</p>
                  <p className="text-xs text-muted-foreground">Professional video editing</p>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={() => handleOpenInEditor("Final Cut Pro")}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
                  <FileVideo className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold">Final Cut Pro</p>
                  <p className="text-xs text-muted-foreground">Mac video editing suite</p>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={() => handleOpenInEditor("DaVinci Resolve")}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10">
                  <FileVideo className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold">DaVinci Resolve</p>
                  <p className="text-xs text-muted-foreground">Color grading & editing</p>
                </div>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={() => handleOpenInEditor("Adobe Photoshop")}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold">Adobe Photoshop</p>
                  <p className="text-xs text-muted-foreground">Professional photo editing</p>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={() => handleOpenInEditor("Adobe Lightroom")}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10">
                  <ImageIcon className="h-5 w-5 text-cyan-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold">Adobe Lightroom</p>
                  <p className="text-xs text-muted-foreground">Photo management & editing</p>
                </div>
              </Button>
            </>
          )}
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 After editing, return to the detail page to submit for approval review.
          </p>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
