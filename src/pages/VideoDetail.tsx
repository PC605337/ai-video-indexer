import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, Users, Tag, FileText, Clock, AlertCircle, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EditorToolbar } from "@/components/EditorToolbar";
import { ReviewPanel } from "@/components/ReviewPanel";
import { FilePathTraceability } from "@/components/FilePathTraceability";
import { CaptionControls } from "@/components/CaptionControls";
import { VideoTimeline } from "@/components/VideoTimeline";
import { ApprovalWorkflow } from "@/components/ApprovalWorkflow";
import { AzureInsightsPanel } from "@/components/AzureInsightsPanel";

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("insights");
  const [faceLibrary, setFaceLibrary] = useState<any[]>([]);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestPurpose, setRequestPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [reviewComments, setReviewComments] = useState<any[]>([]);
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch video data from database
      const { data: video, error: videoError } = await supabase
        .from("media_assets")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (video) {
        // Convert YouTube URL to embed URL
        let embedUrl = video.file_url;
        if (video.file_url?.includes('youtube.com') || video.file_url?.includes('youtu.be')) {
          const videoId = video.video_id?.replace('YT-', '');
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        
        // Format duration
        const formatDuration = (seconds: number) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        
        setVideoData({
          ...video,
          embedUrl,
          duration: formatDuration(video.duration || 0),
          uploadedAt: new Date(video.created_at).toISOString().split('T')[0],
          thumbnailUrl: video.thumbnail_url,
          created_by: video.created_by || "Unknown",
          indexed_by: video.indexed_by || "System"
        });

        // Generate AI metadata if not already present
        if (!(video as any).ai_summary || !(video as any).ai_metadata) {
          toast.info("Generating AI metadata...");
          try {
            const { data: metadataResult, error: metadataError } = await supabase.functions.invoke('generate-video-metadata', {
              body: { assetId: id }
            });

            if (!metadataError && metadataResult?.success) {
              // Refetch the data to get updated AI metadata
              const { data: updatedVideo } = await supabase
                .from('media_assets')
                .select('*')
                .eq('id', id)
                .maybeSingle();

              if (updatedVideo) {
                setVideoData({
                  ...updatedVideo,
                  embedUrl,
                  duration: formatDuration(updatedVideo.duration || 0),
                  uploadedAt: new Date(updatedVideo.created_at).toISOString().split('T')[0],
                  thumbnailUrl: updatedVideo.thumbnail_url,
                  created_by: updatedVideo.created_by || "Unknown",
                  indexed_by: updatedVideo.indexed_by || "System"
                });
                
                toast.success("AI analysis complete!");
              }
            } else {
              console.error('Error generating AI metadata:', metadataError);
            }
          } catch (error) {
            console.error('Error generating AI metadata:', error);
          }
        }
      }
      
      // Fetch face library
      const { data: facesData } = await supabase.from("face_library").select("*").order("name");
      if (facesData) setFaceLibrary(facesData);

      // Check user role
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .limit(1)
        .maybeSingle();
      
      if (rolesData) {
        setUserRole(rolesData.role);
      } else {
        setUserRole("viewer");
      }

      // Load review comments
      loadReviewComments();
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const loadReviewComments = useCallback(async () => {
    const { data } = await supabase
      .from("review_comments")
      .select("*")
      .eq("asset_id", id)
      .order("created_at", { ascending: false });
    if (data) setReviewComments(data);
  }, [id]);

  const handleRequestAccess = async () => {
    if (!requestPurpose.trim()) {
      toast.error("Please provide a purpose for your request");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("viewer_requests").insert({
        asset_id: id,
        purpose: requestPurpose,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Access request submitted. Admin will review shortly.");
      setShowRequestDialog(false);
      setRequestPurpose("");
    } catch (error) {
      toast.error("Failed to submit request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const peopleData = faceLibrary.slice(0, 6).map((person) => ({
    id: person.id,
    name: person.name,
    role: person.role_title || "Team Member",
    company: person.company || "Toyota",
    appearances: Math.floor(Math.random() * 25) + 3,
    duration: `${Math.floor(Math.random() * 6)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    thumbnail: person.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`,
    timestamps: ["00:12", "02:45", "05:23", "08:10"].slice(0, Math.floor(Math.random() * 3) + 2),
  }));

  const insights = videoData?.ai_metadata ? {
    topics: Array.isArray(videoData.ai_metadata.topics) 
      ? videoData.ai_metadata.topics.map((t: any) => typeof t === 'string' ? { name: t, confidence: 85, duration: "0:00", count: 1 } : t)
      : [
          { name: "Vehicle Features", confidence: 95, duration: "3:45", count: 12 },
          { name: "Manufacturing Process", confidence: 92, duration: "2:30", count: 8 },
        ],
    keywords: Array.isArray(videoData.ai_metadata.keywords)
      ? videoData.ai_metadata.keywords.map((k: any) => typeof k === 'string' ? { word: k, count: 1, relevance: 80 } : k)
      : [
          { word: "Lexus", count: 45, relevance: 98 },
          { word: "Innovation", count: 32, relevance: 92 },
        ],
    labels: Array.isArray(videoData.ai_metadata.labels)
      ? videoData.ai_metadata.labels.map((l: any) => ({ ...l, instances: 1 }))
      : [
          { name: "Car", confidence: 99, instances: 156 },
          { name: "Person", confidence: 95, instances: 45 },
        ],
    brands: Array.isArray(videoData.ai_metadata.brands)
      ? videoData.ai_metadata.brands.map((b: any) => ({ ...b, appearances: 1 }))
      : [
          { name: "Lexus", confidence: 99, appearances: 67 },
        ],
    audioEffects: [
      { name: "Music", instances: [{ start: "0:00:12", end: "0:02:45" }] },
      { name: "Speech", instances: [{ start: "0:00:00", end: "0:05:30" }] },
    ],
    entities: [
      { name: "Lexus ES 2025", type: "Product", count: 23 },
      { name: "Toyota Motor Corporation", type: "Organization", count: 12 },
      { name: "North America", type: "Location", count: 8 },
      { name: "Hybrid Technology", type: "Technology", count: 15 },
    ],
  } : {
    topics: [
      { name: "Vehicle Features", confidence: 95, duration: "3:45", count: 12 },
      { name: "Manufacturing Process", confidence: 92, duration: "2:30", count: 8 },
      { name: "Safety Systems", confidence: 88, duration: "1:45", count: 6 },
      { name: "Design Philosophy", confidence: 85, duration: "2:15", count: 5 },
      { name: "Technology Innovation", confidence: 82, duration: "1:30", count: 4 },
    ],
    keywords: [
      { word: "Lexus", count: 45, relevance: 98 },
      { word: "Innovation", count: 32, relevance: 92 },
      { word: "Quality", count: 28, relevance: 89 },
      { word: "Technology", count: 25, relevance: 86 },
      { word: "Performance", count: 22, relevance: 83 },
      { word: "Safety", count: 19, relevance: 80 },
      { word: "Design", count: 16, relevance: 77 },
      { word: "Luxury", count: 14, relevance: 74 },
    ],
    labels: [
      { name: "Car", confidence: 99, instances: 156 },
      { name: "Person", confidence: 95, instances: 45 },
      { name: "Road", confidence: 92, instances: 89 },
      { name: "Building", confidence: 88, instances: 34 },
      { name: "Presentation", confidence: 85, instances: 23 },
    ],
    brands: [
      { name: "Lexus", confidence: 99, appearances: 67 },
      { name: "Toyota", confidence: 97, appearances: 45 },
    ],
    audioEffects: [
      { name: "Music", instances: [{ start: "0:00:12", end: "0:02:45" }] },
      { name: "Speech", instances: [{ start: "0:00:00", end: "0:05:30" }] },
    ],
    entities: [
      { name: "Lexus ES 2025", type: "Product", count: 23 },
      { name: "Toyota Motor Corporation", type: "Organization", count: 12 },
      { name: "North America", type: "Location", count: 8 },
      { name: "Hybrid Technology", type: "Technology", count: 15 },
      { name: "John Smith", type: "Person", count: 6 },
      { name: "Sarah Johnson", type: "Person", count: 4 },
    ],
  };

  const transcript = [
    { time: "00:00", speaker: "Narrator", text: "Welcome to the Lexus ES 2025 campaign showcase. This marks a new era in luxury automotive excellence." },
    { time: "00:15", speaker: "John Smith", text: "Today we're looking at the innovative design features that make this vehicle stand out in its class." },
    { time: "00:42", speaker: "Narrator", text: "The ES 2025 represents a perfect blend of luxury, technology, and sustainable performance." },
    { time: "01:05", speaker: "Sarah Johnson", text: "Let's dive into the advanced safety systems that protect every journey, every passenger." },
    { time: "01:30", speaker: "Narrator", text: "From intelligent collision detection to adaptive cruise control and lane-keeping assistance." },
    { time: "02:00", speaker: "John Smith", text: "The hybrid powertrain delivers exceptional efficiency without compromising performance." },
    { time: "02:30", speaker: "Narrator", text: "Experience the seamless integration of electric and combustion power." },
  ];

  const handleTimeframeClick = (time: number) => {
    setCurrentVideoTime(time);
    toast.info(`Jumped to ${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, "0")}`);
  };

  const handleSeek = (time: number) => {
    setCurrentVideoTime(time);
  };

  const handleMarkerClick = (marker: any) => {
    setCurrentVideoTime(marker.time);
    toast.info(`Viewing comment at ${Math.floor(marker.time / 60)}:${(marker.time % 60).toString().padStart(2, "0")}`);
  };

  const timelineMarkers = reviewComments.map(comment => ({
    id: comment.id,
    time: comment.timeframe_start || 0,
    comment: comment.comment,
    status: comment.status,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading video...</p>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Video not found</p>
      </div>
    );
  }

  // Show restricted access UI for code_red content
  if (videoData.classification === "code_red") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="max-w-2xl w-full p-8 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Restricted Content</h1>
          <p className="text-muted-foreground mb-6">
            This video is classified as Code Red and requires administrator approval to view.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <p className="text-sm font-medium mb-2">{videoData.title}</p>
            <p className="text-xs text-muted-foreground">Duration: {videoData.duration}</p>
          </div>
          <Button onClick={() => setShowRequestDialog(true)} size="lg">
            Request Access
          </Button>
        </Card>

        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Access to Restricted Content</DialogTitle>
              <DialogDescription>
                Please provide a detailed business justification for accessing this Code Red classified content.
                Your request will be reviewed by an administrator.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Describe your purpose for accessing this content..."
              value={requestPurpose}
              onChange={(e) => setRequestPurpose(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRequestAccess} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Azure-style video player layout
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Bar */}
      <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{videoData.title}</h1>
            <p className="text-xs text-muted-foreground">
              {videoData.duration} • Uploaded {videoData.uploadedAt}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Main Content Area - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video Player with Controls Overlay - HD Playback 640×360 to 1280×720 */}
        <div className="w-[58%] bg-black flex flex-col border-r border-border">
          {/* Video Controls Toolbar */}
          <div className="bg-card/95 backdrop-blur-sm border-b border-border px-4 py-2.5 flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {videoData.classification}
              </Badge>
              <span className="text-xs text-muted-foreground">ID: {videoData.video_id || videoData.id}</span>
              {videoData.tags && videoData.tags.length > 0 && (
                <div className="flex gap-1">
                  {videoData.tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Resolution Selector */}
              <Select defaultValue="auto">
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="360p">360p</SelectItem>
                  <SelectItem value="720p">720p HD</SelectItem>
                  <SelectItem value="1080p">1080p FHD</SelectItem>
                </SelectContent>
              </Select>

              {/* Settings Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    Settings
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Bounding Box & Captions</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">Box Size</Label>
                          <Select defaultValue="medium">
                            <SelectTrigger className="h-8 text-xs mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs">Box Color</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              type="color"
                              defaultValue="#FF0000"
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              type="text"
                              defaultValue="#FF0000"
                              className="h-8 text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs">Background Opacity</Label>
                          <Slider
                            defaultValue={[50]}
                            max={100}
                            step={1}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">Audio Effects</Label>
                          <Select defaultValue="none">
                            <SelectTrigger className="h-8 text-xs mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="echo">Echo</SelectItem>
                              <SelectItem value="reverb">Reverb</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Caption Controls */}
              <CaptionControls 
                onCaptionChange={(enabled, language) => {
                  toast.info(`Captions ${enabled ? 'enabled' : 'disabled'}${enabled ? ` (${language})` : ''}`);
                }}
              />

              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center p-4 bg-black">
            <div className="w-full max-w-[1280px] max-h-[720px] aspect-video">
              {videoData.embedUrl?.includes('youtube.com/embed') ? (
                <iframe
                  className="w-full h-full rounded-lg shadow-2xl"
                  src={videoData.embedUrl}
                  title={videoData.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video 
                  className="w-full h-full rounded-lg shadow-2xl object-contain" 
                  controls 
                  poster={videoData.thumbnailUrl}
                  src={videoData.file_url}
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>

          {/* File Paths Section Below Video */}
          <div className="bg-card border-t border-border flex-shrink-0">
            <Tabs defaultValue="paths" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b h-10 px-4 bg-background/50">
                <TabsTrigger value="paths" className="gap-2 text-xs">
                  <FileText className="h-3.5 w-3.5" />
                  File Paths
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="paths" className="p-4 m-0">
                <div className="grid grid-cols-2 gap-4">
                  {/* NAS Path */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <Label className="text-xs font-semibold uppercase tracking-wide">NAS Source (Raw)</Label>
                    </div>
                    {videoData.nas_path ? (
                      <button
                        onClick={() => window.open(videoData.nas_path, '_blank')}
                        className="w-full text-left p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-all group border border-transparent hover:border-primary/20"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-xs font-mono text-foreground break-all">
                            {videoData.nas_path}
                          </code>
                          <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-muted/30 border border-dashed">
                        <code className="text-xs text-muted-foreground italic">
                          NAS://.../RAW/...
                        </code>
                      </div>
                    )}
                  </div>

                  {/* S3 Path */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <Label className="text-xs font-semibold uppercase tracking-wide">S3 Glacier</Label>
                    </div>
                    {videoData.s3_path ? (
                      <button
                        onClick={() => window.open(videoData.s3_path, '_blank')}
                        className="w-full text-left p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-all group border border-transparent hover:border-primary/20"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-xs font-mono text-foreground break-all">
                            {videoData.s3_path}
                          </code>
                          <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-muted/30 border border-dashed">
                        <code className="text-xs text-muted-foreground italic">
                          S3://.../...
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Proxy Path */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                      <Label className="text-xs font-semibold uppercase tracking-wide">Proxy</Label>
                    </div>
                    {videoData.proxy_path ? (
                      <button
                        onClick={() => window.open(videoData.proxy_path, '_blank')}
                        className="w-full text-left p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-all group border border-transparent hover:border-primary/20"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-xs font-mono text-foreground break-all">
                            {videoData.proxy_path}
                          </code>
                          <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-muted/30 border border-dashed">
                        <code className="text-xs text-muted-foreground italic">
                          Proxy://.../...
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Final Path */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <Label className="text-xs font-semibold uppercase tracking-wide">Final Output</Label>
                    </div>
                    {videoData.final_path ? (
                      <button
                        onClick={() => window.open(videoData.final_path, '_blank')}
                        className="w-full text-left p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-all group border border-transparent hover:border-primary/20"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-xs font-mono text-foreground break-all">
                            {videoData.final_path}
                          </code>
                          <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-muted/30 border border-dashed">
                        <code className="text-xs text-muted-foreground italic">
                          Final://.../...
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right: Insights Panel */}
        <div className="w-[42%] bg-card flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b h-12 px-4 bg-background">
              <TabsTrigger value="insights" className="gap-2">
                <Tag className="h-4 w-4" />
                Insights
              </TabsTrigger>
              {(userRole === "super_admin" || userRole === "editor") && (
                <TabsTrigger value="review" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Review
                </TabsTrigger>
              )}
              <TabsTrigger value="timeline" className="gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="transcript" className="gap-2">
                <FileText className="h-4 w-4" />
                Transcript
              </TabsTrigger>
            </TabsList>

            {/* Insights Tab */}
            <TabsContent value="insights" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  {/* File Path Traceability */}
                  <FilePathTraceability
                    nasPath={videoData.nas_path}
                    s3Path={videoData.s3_path}
                    proxyPath={videoData.proxy_path}
                    finalPath={videoData.final_path}
                    versionLineage={videoData.version_lineage}
                  />

                  {/* AI-Generated Summary */}
                  {(videoData as any).ai_summary && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-primary">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary/10">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </span>
                        AI-Generated Summary
                      </h4>
                      <p className="text-sm text-foreground/80">{(videoData as any).ai_summary}</p>
                      {(videoData as any).ai_metadata?.analyzedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Generated: {new Date((videoData as any).ai_metadata.analyzedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Editor Toolbar - Only for admins/editors */}
                  {(userRole === "super_admin" || userRole === "editor") && (
                    <>
                      <EditorToolbar
                        assetId={videoData.id}
                        assetType="video"
                        assetUrl={videoData.videoUrl}
                      />
                      <Separator />
                    </>
                  )}

                  {/* Azure-Style Collapsible Insights */}
                  <AzureInsightsPanel
                    people={peopleData}
                    topics={insights.topics}
                    keywords={insights.keywords}
                    labels={insights.labels}
                    brands={insights.brands}
                    audioEffects={insights.audioEffects}
                    entities={insights.entities}
                    onTimeClick={handleTimeframeClick}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Review Tab - Only for admins/editors */}
            {(userRole === "super_admin" || userRole === "editor") && (
              <TabsContent value="review" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-6">
                    {/* Video Timeline with Comments */}
                    <Card className="p-4">
                      <h3 className="font-semibold text-lg mb-4">Interactive Timeline</h3>
                      <VideoTimeline
                        duration={videoData.duration ? parseInt(videoData.duration.split(':')[0]) * 60 + parseInt(videoData.duration.split(':')[1]) : 300}
                        markers={timelineMarkers}
                        currentTime={currentVideoTime}
                        onSeek={handleSeek}
                        onMarkerClick={handleMarkerClick}
                      />
                    </Card>

                    {/* Approval Workflow */}
                    <ApprovalWorkflow
                      assetId={videoData.id}
                      onStatusChange={loadReviewComments}
                    />

                    {/* Review Comments */}
                    <ReviewPanel
                      assetId={videoData.id}
                      assetType="video"
                      comments={reviewComments}
                      onCommentAdded={loadReviewComments}
                      onTimeframeClick={handleTimeframeClick}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
            )}

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <p className="text-sm text-muted-foreground">
                    Visual timeline with keyframes will appear here. Click timestamps in the transcript tab to navigate the video.
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Transcript Tab */}
            <TabsContent value="transcript" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-3">
                  {transcript.map((entry, index) => {
                    const [mins, secs] = entry.time.split(':').map(Number);
                    const timeInSeconds = (mins * 60) + secs;
                    return (
                    <div 
                      key={index} 
                      className="flex gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                      onClick={() => handleTimeframeClick(timeInSeconds)}
                    >
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="font-mono text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {entry.time}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-1 text-primary">{entry.speaker}</p>
                        <p className="text-sm text-foreground leading-relaxed">{entry.text}</p>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
