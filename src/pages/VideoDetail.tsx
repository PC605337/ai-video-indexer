import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CaptionControls } from "@/components/CaptionControls";
import { EditorToolbar } from "@/components/EditorToolbar";
import { ApprovalWorkflow } from "@/components/ApprovalWorkflow";
import { FilePathTraceability } from "@/components/FilePathTraceability";
import { ReviewPanel } from "@/components/ReviewPanel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useUserRole } from "@/hooks/useUserRole";

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("insights");
  const [reviewComments, setReviewComments] = useState<any[]>([]);
  const { currentRole } = useUserRole();

  useEffect(() => {
    loadVideo();
    loadReviewComments();
  }, [id]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .eq("id", id)
        .eq("asset_type", "video")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setVideo(data);
      }
    } catch (error: any) {
      console.error("Error loading video:", error);
      toast.error("Failed to load video");
      navigate("/videos");
    } finally {
      setLoading(false);
    }
  };

  const loadReviewComments = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from("review_comments")
        .select("*")
        .eq("asset_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviewComments(data || []);
    } catch (error) {
      console.error("Error loading review comments:", error);
    }
  };

  const canAccessCodeRed = currentRole === "super_admin" || currentRole === "admin";

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
      <main className="pt-16">
        <div className="px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/videos")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Button>
        </div>

        <div className="min-h-screen flex bg-background">
          {/* Left Panel - Static Video Player + Summary + File Paths */}
          <div className="w-[60%] flex flex-col items-center bg-black flex-shrink-0 px-6 pb-6">
            {/* Video Player */}
            <div className="w-full max-w-[960px] h-[480px] relative mt-6">
              {video.video_id ? (
                <div className="relative w-full h-full">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                    src={`https://www.youtube.com/embed/${video.video_id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="absolute bottom-4 right-4 z-10">
                    <CaptionControls />
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={video.file_url}
                    controls
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg object-contain"
                    poster={video.thumbnail_url}
                    preload="metadata"
                  />
                  <div className="absolute bottom-4 right-4 z-10">
                    <CaptionControls />
                  </div>
                </div>
              )}
            </div>

            {/* AI Generated Video Summary */}
            {video.ai_summary && (
              <div className="mt-4 w-full max-w-[960px] p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">AI-Generated Summary</h4>
                <p className="text-sm text-foreground/80">{video.ai_summary}</p>
                {video.ai_metadata?.analyzedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Generated: {new Date(video.ai_metadata.analyzedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* File Source Paths */}
            <div className="mt-4 w-full max-w-[960px]">
              <FilePathTraceability
                nasPath={video.nas_path}
                s3Path={video.s3_path}
                proxyPath={video.proxy_path}
                finalPath={video.final_path}
                versionLineage={video.version_lineage}
              />
            </div>

            {/* Editor Toolbar */}
            {canAccessCodeRed && (
              <div className="mt-4 w-full max-w-[960px]">
                <EditorToolbar
                  assetId={video.id}
                  assetType="video"
                  assetUrl={video.file_url}
                  metadata={video.ai_metadata}
                />
              </div>
            )}
          </div>

          {/* Right Panel - Scrollable Insights / Review / Transcript */}
          <div className="w-[40%] h-screen overflow-y-auto bg-card flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="border-b px-4 bg-background flex-shrink-0">
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                {canAccessCodeRed && (
                  <TabsTrigger value="review">Review</TabsTrigger>
                )}
              </TabsList>

              {/* Insights Tab */}
              <TabsContent value="insights" className="flex-1 p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-4">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-muted-foreground mb-4">{video.description}</p>
                  )}
                </div>

                {video.ai_metadata?.detected_people && video.ai_metadata.detected_people.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Detected People</h4>
                    <div className="flex flex-wrap gap-2">
                      {video.ai_metadata.detected_people.map((person: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {video.ai_metadata?.detected_objects && video.ai_metadata.detected_objects.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Detected Objects</h4>
                    <div className="flex flex-wrap gap-2">
                      {video.ai_metadata.detected_objects.map((object: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                          {object}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {video.tags && video.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {video.ai_metadata?.sentiment && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sentiment</h4>
                    <span className="px-3 py-1 bg-muted rounded-md text-sm">
                      {video.ai_metadata.sentiment}
                    </span>
                  </div>
                )}
              </TabsContent>

              {/* Transcript Tab */}
              <TabsContent value="transcript" className="flex-1 p-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Transcript</h4>
                  <p className="text-sm text-muted-foreground">
                    Transcript feature coming soon. This will display time-coded transcript segments.
                  </p>
                </div>
              </TabsContent>

              {/* Review Tab */}
              {canAccessCodeRed && (
                <TabsContent value="review" className="flex-1 p-6 space-y-4">
                  <ApprovalWorkflow
                    assetId={video.id}
                    currentStatus="pending"
                    onStatusChange={loadReviewComments}
                  />
                  <ReviewPanel
                    assetId={video.id}
                    assetType="video"
                    comments={reviewComments}
                    onCommentAdded={loadReviewComments}
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
