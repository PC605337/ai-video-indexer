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
import { CodeRedAccess } from "@/components/CodeRedAccess";
import { TranscriptPanel } from "@/components/TranscriptPanel";
import { InsightsPanel } from "@/components/InsightsPanel";
import { SentimentPanel } from "@/components/SentimentPanel";
import { ScenesPanel } from "@/components/ScenesPanel";
import { ExportDialog } from "@/components/ExportDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("insights");
  const [reviewComments, setReviewComments] = useState<any[]>([]);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
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

  const handleTimelineHover = (e: React.MouseEvent) => {
    if (!timelineRef.current || !videoRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const hoverRatio = Math.max(0, Math.min(1, hoverX / rect.width));
    const time = (videoRef.current.duration || 0) * hoverRatio;
    setHoverTime(time);
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!videoRef.current || hoverTime === null) return;
    videoRef.current.currentTime = hoverTime;
  };

  const getThumbnailForTime = (time: number) => {
    if (!video?.ai_metadata?.keyframes || video.ai_metadata.keyframes.length === 0) return null;
    let closest = video.ai_metadata.keyframes[0];
    for (let kf of video.ai_metadata.keyframes) {
      if (Math.abs(kf.time - time) < Math.abs(closest.time - time)) closest = kf;
    }
    return closest.thumbnailUrl;
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
          {/* Left Panel - Static Video Player + Timeline + Controls */}
          <div className="w-[60%] flex flex-col items-center bg-black flex-shrink-0 px-6 pb-6">
            <CodeRedAccess assetId={video.id} classification={video.classification} />

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
                </div>
              )}
            </div>

            {/* Timeline with hover preview */}
            {!video.video_id && (
              <div
                ref={timelineRef}
                className="relative w-full max-w-[960px] h-12 bg-gray-800 rounded-md cursor-pointer overflow-visible mt-4"
                onMouseMove={handleTimelineHover}
                onMouseLeave={() => setHoverTime(null)}
                onClick={handleTimelineClick}
              >
                {/* Hover Thumbnail */}
                {hoverTime !== null && getThumbnailForTime(hoverTime) && (
                  <div
                    className="absolute -top-24 transform -translate-x-1/2 z-10 pointer-events-none"
                    style={{
                      left: `${(hoverTime / (videoRef.current?.duration || 1)) * 100}%`,
                    }}
                  >
                    <img
                      src={getThumbnailForTime(hoverTime) || ""}
                      alt="hover preview"
                      className="w-32 h-18 rounded-md border border-border shadow-lg object-cover"
                    />
                    <p className="text-xs text-center text-white mt-1">
                      {Math.floor(hoverTime / 60)}:{Math.floor(hoverTime % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                )}

                {/* Timeline Bar */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 -translate-y-1/2 rounded" />
                {videoRef.current && (
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-primary rounded transition-all"
                    style={{
                      width: `${((videoRef.current.currentTime || 0) / (videoRef.current.duration || 1)) * 100}%`,
                      transform: "translateY(-50%)",
                    }}
                  />
                )}
              </div>
            )}

            {/* Caption Controls */}
            <div className="mt-4 w-full max-w-[960px]">
              <CaptionControls />
            </div>

            {/* AI Generated Video Summary */}
            {video.ai_summary && (
              <div className="mt-4 w-full max-w-[960px] p-4 bg-primary/5 rounded-lg border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-primary mb-2">AI-Generated Summary</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{video.ai_summary}</p>
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
            <div className="flex items-center justify-between border-b px-4 py-2 bg-background flex-shrink-0">
              <TabsList className="bg-background">
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                <TabsTrigger value="scenes">Scenes</TabsTrigger>
                {canAccessCodeRed && (
                  <TabsTrigger value="review">Review</TabsTrigger>
                )}
              </TabsList>
              <ExportDialog video={video} />
            </div>

          {/* Insights Tab */}
          <TabsContent value="insights" className="flex-1 p-6 space-y-4 overflow-y-auto">
            <InsightsPanel video={video} hoverTime={hoverTime} />
          </TabsContent>

          {/* Transcript Tab */}
          <TabsContent value="transcript" className="flex-1 p-6 overflow-y-auto">
            <TranscriptPanel videoId={video.id} videoRef={videoRef} />
          </TabsContent>

          {/* Sentiment Tab */}
          <TabsContent value="sentiment" className="flex-1 p-6 overflow-y-auto">
            <SentimentPanel video={video} />
          </TabsContent>

          {/* Scenes Tab */}
          <TabsContent value="scenes" className="flex-1 p-6 overflow-y-auto">
            <ScenesPanel video={video} videoRef={videoRef} />
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
