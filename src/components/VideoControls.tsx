import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, Settings, Tag } from "lucide-react";
import { toast } from "sonner";

interface VideoControlsProps {
  videoData: {
    id: string;
    title: string;
    classification: string;
    created_by?: string;
    indexed_by?: string;
    tags?: string[];
    video_id?: string;
    embeddings?: any;
    bounding_box_settings?: {
      size: string;
      color: string;
      bgTransparency: number;
      audioEffects: string[];
      speakers: string[];
    };
  };
}

export const VideoControls = ({ videoData }: VideoControlsProps) => {
  const [resolution, setResolution] = useState("auto");
  const [boundingBoxSize, setBoundingBoxSize] = useState(videoData.bounding_box_settings?.size || "medium");
  const [boundingBoxColor, setBoundingBoxColor] = useState(videoData.bounding_box_settings?.color || "#FF0000");
  const [bgTransparency, setBgTransparency] = useState(videoData.bounding_box_settings?.bgTransparency || 0.5);

  const handleDownload = () => {
    toast.success("Download started");
    // Implementation for download
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      {/* Metadata Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Video Controls
          </h3>
          <Button onClick={handleDownload} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <Label className="text-xs text-muted-foreground">Name</Label>
            <p className="font-medium">{videoData.title}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Classification</Label>
            <Badge variant="secondary">{videoData.classification}</Badge>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Video ID</Label>
            <p className="font-mono text-xs">{videoData.video_id || videoData.id}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Created By</Label>
            <p className="text-xs">{videoData.created_by || "System"}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Indexed By</Label>
            <p className="text-xs">{videoData.indexed_by || "System"}</p>
          </div>
        </div>

        {/* Tags */}
        {videoData.tags && videoData.tags.length > 0 && (
          <div>
            <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-1">
              {videoData.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Resolution Options */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Resolution</Label>
        <Select value={resolution} onValueChange={setResolution}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="360p">360p</SelectItem>
            <SelectItem value="720p">720p (HD)</SelectItem>
            <SelectItem value="1080p">1080p (Full HD)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Bounding Box & Caption Settings */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Bounding Box & Caption Settings</Label>
        
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Size</Label>
          <Select value={boundingBoxSize} onValueChange={setBoundingBoxSize}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Color</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="color"
              value={boundingBoxColor}
              onChange={(e) => setBoundingBoxColor(e.target.value)}
              className="w-20 h-10"
            />
            <Input
              type="text"
              value={boundingBoxColor}
              onChange={(e) => setBoundingBoxColor(e.target.value)}
              className="flex-1 font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Background Transparency: {Math.round(bgTransparency * 100)}%
          </Label>
          <Slider
            value={[bgTransparency * 100]}
            onValueChange={([value]) => setBgTransparency(value / 100)}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Embeddings Info */}
      {videoData.embeddings && (
        <>
          <Separator />
          <div>
            <Label className="text-xs text-muted-foreground">Embeddings</Label>
            <p className="text-xs text-muted-foreground mt-1">
              {Object.keys(videoData.embeddings).length} embedding vectors available
            </p>
          </div>
        </>
      )}
    </div>
  );
};
