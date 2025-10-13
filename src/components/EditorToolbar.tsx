import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit3, FileVideo, Image as ImageIcon, ExternalLink, Download, History } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EditorToolbarProps {
  assetId: string;
  assetType: "video" | "image";
  assetUrl: string;
  metadata?: any;
}

export const EditorToolbar = ({ assetId, assetType, assetUrl, metadata }: EditorToolbarProps) => {
  const handleOpenInEditor = async (software: string) => {
    try {
      // Track the edit session
      const { error } = await supabase.from("asset_edit_sessions").insert([{
        asset_id: assetId,
        editor_id: "00000000-0000-0000-0000-000000000000", // Replace with actual user ID
        software: software,
        status: "in_progress",
        metadata: metadata || {},
      }]);

      if (error) throw error;

      // Generate edit URL (this would integrate with Adobe/other software APIs)
      // For now, we'll show a toast with instructions
      toast.success(`Opening in ${software}...`, {
        description: "Download the asset and open it in your editing software.",
      });

      // In production, this would use:
      // - Adobe Creative Cloud API for Premiere Pro/Photoshop
      // - Frame.io API integration
      // - Or a custom protocol handler
    } catch (error) {
      toast.error("Failed to open in editor");
      console.error(error);
    }
  };

  const handleDownloadOriginal = () => {
    window.open(assetUrl, "_blank");
    toast.success("Downloading original file");
  };

  const handleViewHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("asset_edit_sessions")
        .select("*")
        .eq("asset_id", assetId)
        .order("opened_at", { ascending: false });

      if (error) throw error;

      console.log("Edit history:", data);
      toast.info(`Found ${data?.length || 0} edit sessions`);
    } catch (error) {
      toast.error("Failed to load history");
    }
  };

  return (
    <Card className="p-4 bg-accent/30 border-primary/20">
      <div className="flex items-center gap-2 mb-3">
        <Edit3 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Editor Functions</h3>
        <Badge variant="default">Super Admin / Editor</Badge>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Open in Editing Software</p>
          <div className="flex flex-wrap gap-2">
            {assetType === "video" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenInEditor("premiere_pro")}
                  className="gap-2"
                >
                  <FileVideo className="h-4 w-4" />
                  Premiere Pro
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenInEditor("final_cut")}
                  className="gap-2"
                >
                  <FileVideo className="h-4 w-4" />
                  Final Cut
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenInEditor("davinci")}
                  className="gap-2"
                >
                  <FileVideo className="h-4 w-4" />
                  DaVinci
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenInEditor("photoshop")}
                  className="gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Photoshop
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenInEditor("lightroom")}
                  className="gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Lightroom
                </Button>
              </>
            )}
          </div>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadOriginal}
            className="flex-1 gap-2"
          >
            <Download className="h-4 w-4" />
            Download Original
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewHistory}
            className="flex-1 gap-2"
          >
            <History className="h-4 w-4" />
            Edit History
          </Button>
        </div>

        <Separator />

        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs font-medium mb-2">Detailed Metadata</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            {assetType === "video" ? (
              <>
                <div className="flex justify-between">
                  <span>Codec:</span>
                  <span className="font-mono">H.264</span>
                </div>
                <div className="flex justify-between">
                  <span>Bitrate:</span>
                  <span className="font-mono">8.5 Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span>Frame Rate:</span>
                  <span className="font-mono">29.97 fps</span>
                </div>
                <div className="flex justify-between">
                  <span>Color Space:</span>
                  <span className="font-mono">BT.709</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Color Profile:</span>
                  <span className="font-mono">sRGB IEC61966-2.1</span>
                </div>
                <div className="flex justify-between">
                  <span>Bit Depth:</span>
                  <span className="font-mono">8-bit</span>
                </div>
                <div className="flex justify-between">
                  <span>DPI:</span>
                  <span className="font-mono">300 x 300</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
