import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, Users, Tag, FileText, ZoomIn, ZoomOut, RotateCw, AlertCircle } from "lucide-react";
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

const PhotoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("insights");
  const [faceLibrary, setFaceLibrary] = useState<any[]>([]);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestPurpose, setRequestPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Mock photo data
  const photoData = {
    id: id || "1",
    title: "Lexus ES 2025 - Product Shoot",
    uploadedAt: "2024-01-15",
    resolution: "6000 x 4000",
    fileSize: "12.4 MB",
    classification: "internal",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1600",
    thumbnailUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
  };

  useEffect(() => {
    const fetchFaceLibrary = async () => {
      const { data } = await supabase.from("face_library").select("*").order("name");
      if (data) setFaceLibrary(data);
    };
    fetchFaceLibrary();
  }, []);

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

  const peopleData = faceLibrary.slice(0, 4).map((person) => ({
    id: person.id,
    name: person.name,
    role: person.role_title || "Team Member",
    company: person.company || "Toyota",
    confidence: 92 + Math.floor(Math.random() * 7),
    thumbnail: person.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`,
    boundingBox: { x: Math.random() * 50, y: Math.random() * 50, width: 15, height: 20 },
  }));

  const insights = {
    objects: [
      { name: "Car", confidence: 99, count: 1 },
      { name: "Wheel", confidence: 97, count: 4 },
      { name: "Headlight", confidence: 96, count: 2 },
      { name: "Grille", confidence: 95, count: 1 },
    ],
    colors: [
      { name: "Silver", hex: "#C0C0C0", percentage: 45 },
      { name: "Black", hex: "#000000", percentage: 25 },
      { name: "Gray", hex: "#808080", percentage: 20 },
      { name: "White", hex: "#FFFFFF", percentage: 10 },
    ],
    labels: [
      { name: "Luxury Car", confidence: 98 },
      { name: "Sedan", confidence: 97 },
      { name: "Vehicle", confidence: 99 },
      { name: "Automobile", confidence: 98 },
      { name: "Product Photography", confidence: 95 },
    ],
    brands: [
      { name: "Lexus", confidence: 99 },
      { name: "Toyota", confidence: 97 },
    ],
    text: [
      { content: "LEXUS", confidence: 99, language: "en" },
      { content: "ES 2025", confidence: 97, language: "en" },
    ],
  };

  const metadata = {
    camera: "Canon EOS R5",
    lens: "RF 24-70mm F2.8",
    settings: "f/8, 1/125s, ISO 100",
    location: "Studio A, Toyota Media Center",
    photographer: "John Doe",
  };

  if (photoData.classification === "code_red") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="max-w-2xl w-full p-8 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Restricted Content</h1>
          <p className="text-muted-foreground mb-6">
            This photo is classified as Code Red and requires administrator approval to view.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <p className="text-sm font-medium mb-2">{photoData.title}</p>
            <p className="text-xs text-muted-foreground">{photoData.resolution} • {photoData.fileSize}</p>
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{photoData.title}</h1>
            <p className="text-xs text-muted-foreground">
              {photoData.resolution} • {photoData.fileSize} • Uploaded {photoData.uploadedAt}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[4rem] text-center">{zoomLevel}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Image Viewer */}
        <div className="w-[58%] bg-muted flex items-center justify-center border-r border-border overflow-auto p-4">
          <img 
            src={photoData.imageUrl} 
            alt={photoData.title}
            style={{ transform: `scale(${zoomLevel / 100})`, transition: 'transform 0.3s ease-out' }}
            className="max-w-full h-auto rounded-lg shadow-2xl"
          />
        </div>

        {/* Right: Insights Panel */}
        <div className="w-[42%] bg-card flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b h-12 px-4 bg-background">
              <TabsTrigger value="insights" className="gap-2">
                <Tag className="h-4 w-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="metadata" className="gap-2">
                <FileText className="h-4 w-4" />
                Metadata
              </TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  {/* People */}
                  {peopleData.length > 0 && (
                    <>
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Users className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">People Detected</h3>
                          <Badge variant="secondary">{peopleData.length}</Badge>
                        </div>
                        <div className="space-y-3">
                          {peopleData.map((person) => (
                            <Card key={person.id} className="p-4 hover:bg-accent/50 transition-colors">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-12 w-12 border-2 border-primary/20">
                                  <AvatarImage src={person.thumbnail} alt={person.name} />
                                  <AvatarFallback className="bg-primary/10">
                                    {person.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="font-semibold">{person.name}</p>
                                  <p className="text-sm text-muted-foreground">{person.role}</p>
                                  <p className="text-xs text-muted-foreground">{person.company}</p>
                                  <Badge variant="outline" className="mt-2">
                                    {person.confidence}% confidence
                                  </Badge>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Objects */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Objects</h3>
                      <Badge variant="secondary">{insights.objects.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {insights.objects.map((obj, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{obj.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{obj.count}x</span>
                              <Badge variant="outline">{obj.confidence}%</Badge>
                            </div>
                          </div>
                          <Progress value={obj.confidence} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Colors */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Dominant Colors</h3>
                    </div>
                    <div className="space-y-2">
                      {insights.colors.map((color, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-md border-2 border-border flex-shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{color.name}</span>
                              <span className="text-sm text-muted-foreground">{color.percentage}%</span>
                            </div>
                            <Progress value={color.percentage} className="h-1.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Labels */}
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
                            <Badge variant="outline">{label.confidence}%</Badge>
                          </div>
                          <Progress value={label.confidence} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Text Detection */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Text Detected</h3>
                      <Badge variant="secondary">{insights.text.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {insights.text.map((text, index) => (
                        <div key={index} className="p-3 rounded-lg bg-secondary/30">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{text.content}</span>
                            <Badge variant="outline">{text.confidence}%</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Language: {text.language.toUpperCase()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Brands */}
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
                          <Badge variant="outline">{brand.confidence}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="metadata" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Camera</span>
                      <span className="text-sm font-semibold">{metadata.camera}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Lens</span>
                      <span className="text-sm font-semibold">{metadata.lens}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Settings</span>
                      <span className="text-sm font-semibold font-mono">{metadata.settings}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Location</span>
                      <span className="text-sm font-semibold">{metadata.location}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Photographer</span>
                      <span className="text-sm font-semibold">{metadata.photographer}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Resolution</span>
                      <span className="text-sm font-semibold">{photoData.resolution}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">File Size</span>
                      <span className="text-sm font-semibold">{photoData.fileSize}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-muted-foreground">Uploaded</span>
                      <span className="text-sm font-semibold">{photoData.uploadedAt}</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
