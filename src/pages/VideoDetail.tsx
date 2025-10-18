import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Download, Edit3, FileVideo, Loader2, Clock, Calendar, HardDrive, Tag } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    loadVideo();
  }, [id]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .eq("id", id)
        .eq("asset_type", "video")
        .single();

      if (error) throw error;

      if (data) {
        const videoData = data as any;
        setVideo({
          id: videoData.id,
          title: videoData.title,
          thumbnail: videoData.thumbnail_url || "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop",
          duration: videoData.duration || 0,
          tags: videoData.tags || [],
          created_at: videoData.created_at,
          file_size: videoData.file_size || 0,
          ai_metadata: videoData.ai_metadata || {},
          file_url: videoData.file_url,
          description: videoData.description || "",
        });
      }
    } catch (error: any) {
      console.error("Error loading video:", error);
      toast.error("Failed to load video");
      navigate("/videos");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleOpenInEditor = async (software: string) => {
    try {
      const { error } = await supabase.from("asset_edit_sessions").insert([{
        asset_id: video.id,
        editor_id: "00000000-0000-0000-0000-000000000000",
        software: software,
        status: "in_progress",
        metadata: { opened_from: "video_detail_page" },
      }]);

      if (error) throw error;

      toast.success(`Opening in ${software}...`, {
        description: "Download the video and open it in your editing software.",
      });

      if (video.file_url) {
        window.open(video.file_url, "_blank");
      }

      setShowEditDialog(false);
    } catch (error) {
      toast.error("Failed to open in editor");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1">
        <Header />
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex-1">
        <Header />
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto text-center py-12">
            <p className="text-muted-foreground">Video not found</p>
            <Button onClick={() => navigate("/videos")} className="mt-4">
              Back to Videos
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header />
      <main className="pt-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/videos")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Videos
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player Section */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="lg"
                          className="h-16 w-16 rounded-full"
                          onClick={() => video.file_url && window.open(video.file_url, "_blank")}
                        >
                          <Play className="h-8 w-8" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{video.title}</CardTitle>
                    {video.description && (
                      <CardDescription>{video.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {video.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {formatDuration(video.duration)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(video.created_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4" />
                        {formatBytes(video.file_size)}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={() => setShowEditDialog(true)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Video
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => video.file_url && window.open(video.file_url, "_blank")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Metadata Section */}
              <div className="space-y-4">
                {video.ai_metadata?.detected_people && video.ai_metadata.detected_people.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Detected People</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {video.ai_metadata.detected_people.map((person: string, i: number) => (
                          <Badge key={i} variant="outline">
                            {person}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {video.ai_metadata?.detected_objects && video.ai_metadata.detected_objects.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Detected Objects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {video.ai_metadata.detected_objects.map((object: string, i: number) => (
                          <Badge key={i} variant="secondary">
                            {object}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {video.ai_metadata?.sentiment && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Sentiment Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline">{video.ai_metadata.sentiment}</Badge>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md z-[100] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" />
              Open in Editing Software
            </DialogTitle>
            <DialogDescription>
              Select your preferred editing software to open and edit this video.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
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
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 After editing, the changes will be tracked for approval review.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
