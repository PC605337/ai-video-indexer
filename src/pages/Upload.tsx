import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload as UploadIcon, X, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface UploadFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
}

export default function Upload() {
  const { toast } = useToast();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    toast({
      title: "Upload Started",
      description: `Processing ${e.dataTransfer.files.length} files...`,
    });

    // Simulate file upload
    const newFiles: UploadFile[] = Array.from(e.dataTransfer.files).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      progress: 0,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress: 100, status: "complete" } : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, progress } : f))
          );
        }
      }, 500);
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="flex-1">
      <Header />
      <main className="pt-16 p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold mb-2">Upload Assets</h1>
              <p className="text-muted-foreground">
                Bulk upload media files with intelligent AI classification
              </p>
            </div>

            {/* Upload Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 glass">
                <div className="space-y-6">
                  {/* Metadata Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Asset Type</Label>
                      <Select defaultValue="campaign">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="campaign">Campaign</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="plant">Plant Tour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Data Sensitivity</Label>
                      <Select defaultValue="internal">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="confidential">Confidential</SelectItem>
                          <SelectItem value="protected">Protected (Code Red)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input placeholder="e.g., Lexus ES 2025 Campaign" />
                  </div>

                  {/* Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                      border-2 border-dashed rounded-xl p-12 text-center transition-all
                      ${
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }
                    `}
                  >
                    <UploadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      Drop files here or click to browse
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports video, images, and audio files
                    </p>
                    <Button>Select Files</Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Upload Queue */}
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 glass">
                  <h3 className="text-lg font-semibold mb-4">Upload Queue</h3>
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{file.name}</p>
                            <span className="text-sm text-muted-foreground">
                              {file.size}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={file.progress} className="h-2" />
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {Math.round(file.progress)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.status === "complete" && (
                            <CheckCircle className="h-5 w-5 text-accent" />
                          )}
                          {file.status === "error" && (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* AI Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 glass">
                <h3 className="text-lg font-semibold mb-4">AI Processing Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Auto-caption generation (EN/JP/ES)",
                    "Vehicle model detection",
                    "Executive facial recognition",
                    "Scene classification",
                    "Object & logo detection",
                    "Sentiment analysis",
                    "Speaker diarization",
                    "Auto-tagging & metadata",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
  );
}
