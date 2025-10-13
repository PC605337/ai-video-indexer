import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, Users, Tag, FileText, Clock, AlertCircle, MessageSquare } from "lucide-react";
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EditorToolbar } from "@/components/EditorToolbar";
import { ReviewPanel } from "@/components/ReviewPanel";

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

  // Mock video data - replace with real data from Supabase
  const videoData = {
    id: id || "1",
    title: "Lexus ES 2025 Campaign - RAW Footage",
    duration: "12:34",
    uploadedAt: "2024-01-15",
    classification: "internal", // Change to "code_red" to test restricted access
    thumbnailUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch face library
      const { data: facesData } = await supabase.from("face_library").select("*").order("name");
      if (facesData) setFaceLibrary(facesData);

      // Check user role
      const { data: rolesData } = await supabase.from("user_roles").select("role").limit(1).single();
      if (rolesData) {
        setUserRole(rolesData.role);
      }

      // Load review comments
      loadReviewComments();
    };
    fetchData();
  }, []);

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

  const insights = {
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

  const handleTimeframeClick = (time: string) => {
    toast.info(`Jump to ${time}`);
    // In production, actually seek the video to this timestamp
  };

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
        {/* Left: Video Player */}
        <div className="w-[58%] bg-black flex items-center justify-center border-r border-border">
          <video 
            className="w-full h-full object-contain" 
            controls 
            poster={videoData.thumbnailUrl}
            src={videoData.videoUrl}
          >
            Your browser does not support the video tag.
          </video>
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

                  {/* People Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">People</h3>
                      <Badge variant="secondary">{peopleData.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {peopleData.map((person) => (
                        <Card key={person.id} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-14 w-14 border-2 border-primary/20">
                              <AvatarImage src={person.thumbnail} alt={person.name} />
                              <AvatarFallback className="bg-primary/10">
                                {person.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold">{person.name}</p>
                              <p className="text-sm text-muted-foreground">{person.role}</p>
                              <p className="text-xs text-muted-foreground">{person.company}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {person.duration}
                                </span>
                                <span>{person.appearances} appearances</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {person.timestamps.map((ts, i) => (
                                  <Badge 
                                    key={i} 
                                    variant="outline" 
                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs font-mono"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTimeframeClick(ts);
                                    }}
                                  >
                                    {ts}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Topics Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Topics</h3>
                      <Badge variant="secondary">{insights.topics.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {insights.topics.map((topic, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">{topic.name}</p>
                              <p className="text-xs text-muted-foreground">{topic.count} mentions • {topic.duration}</p>
                            </div>
                            <Badge variant="outline" className="ml-2">{topic.confidence}%</Badge>
                          </div>
                          <Progress value={topic.confidence} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Keywords Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Keywords</h3>
                      <Badge variant="secondary">{insights.keywords.length}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {insights.keywords.map((keyword, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {keyword.word} <span className="ml-1 text-xs opacity-70">({keyword.count})</span>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Labels Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Labels</h3>
                      <Badge variant="secondary">{insights.labels.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {insights.labels.map((label, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{label.name}</span>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="text-xs">{label.instances} instances</span>
                              <Badge variant="outline">{label.confidence}%</Badge>
                            </div>
                          </div>
                          <Progress value={label.confidence} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Brands Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Brands</h3>
                      <Badge variant="secondary">{insights.brands.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {insights.brands.map((brand, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                          <span className="font-medium">{brand.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{brand.appearances} appearances</span>
                            <Badge variant="outline">{brand.confidence}%</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Review Tab - Only for admins/editors */}
            {(userRole === "super_admin" || userRole === "editor") && (
              <TabsContent value="review" className="flex-1 overflow-hidden m-0">
                <div className="p-6">
                  <ReviewPanel
                    assetId={videoData.id}
                    assetType="video"
                    comments={reviewComments}
                    onCommentAdded={loadReviewComments}
                    onTimeframeClick={(time) => handleTimeframeClick(`${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`)}
                  />
                </div>
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
                  {transcript.map((entry, index) => (
                    <div 
                      key={index} 
                      className="flex gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                      onClick={() => handleTimeframeClick(entry.time)}
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
                  ))}
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
