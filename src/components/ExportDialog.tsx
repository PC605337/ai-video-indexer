import { useState } from "react";
import { Download, FileText, FileJson, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ExportDialogProps {
  video: any;
}

export const ExportDialog = ({ video }: ExportDialogProps) => {
  const [format, setFormat] = useState("json");
  const [includeTranscript, setIncludeTranscript] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeInsights, setIncludeInsights] = useState(true);

  const handleExport = () => {
    try {
      const exportData: any = {
        title: video.title,
        id: video.id,
        created_at: video.created_at,
      };

      if (includeMetadata) {
        exportData.metadata = {
          duration: video.duration,
          file_size: video.file_size,
          width: video.width,
          height: video.height,
        };
      }

      if (includeInsights && video.ai_metadata) {
        exportData.ai_insights = video.ai_metadata;
      }

      if (includeTranscript) {
        exportData.transcript = "Transcript data would be included here";
      }

      let content: string;
      let mimeType: string;
      let extension: string;

      switch (format) {
        case "json":
          content = JSON.stringify(exportData, null, 2);
          mimeType = "application/json";
          extension = "json";
          break;
        case "txt":
          content = Object.entries(exportData)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join("\n\n");
          mimeType = "text/plain";
          extension = "txt";
          break;
        case "csv":
          content = "Video Export\n\n" + Object.entries(exportData)
            .map(([key, value]) => `"${key}","${JSON.stringify(value)}"`)
            .join("\n");
          mimeType = "text/csv";
          extension = "csv";
          break;
        default:
          throw new Error("Unsupported format");
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${video.title || 'video'}-export.${extension}`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Export completed successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Video Data</DialogTitle>
          <DialogDescription>
            Choose what data to include and the export format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="format" className="mb-2 block">Export Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    JSON
                  </div>
                </SelectItem>
                <SelectItem value="txt">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Text
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Include Data</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="metadata"
                checked={includeMetadata}
                onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
              />
              <Label htmlFor="metadata" className="font-normal cursor-pointer">
                Video Metadata
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="insights"
                checked={includeInsights}
                onCheckedChange={(checked) => setIncludeInsights(checked as boolean)}
              />
              <Label htmlFor="insights" className="font-normal cursor-pointer">
                AI Insights
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="transcript"
                checked={includeTranscript}
                onCheckedChange={(checked) => setIncludeTranscript(checked as boolean)}
              />
              <Label htmlFor="transcript" className="font-normal cursor-pointer">
                Transcript
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => {}}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
