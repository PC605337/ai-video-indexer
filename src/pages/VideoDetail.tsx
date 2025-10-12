import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Maximize,
  Download,
  Share2,
  FileText,
  Tag,
  Users,
  MapPin,
  BarChart3,
  Sparkles,
  MessageSquare,
} from "lucide-react";

// Mock video data
const mockVideos = [
  {
    id: 1,
    title: "GR Corolla - Performance Review",
    url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&auto=format&fit=crop",
    duration: "12:45",
    uploadDate: "2024-03-15",
    tags: ["Performance", "GR Corolla", "Review", "Sports"],
  },
  {
    id: 2,
    title: "GR Supra - Track Day",
    url: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=1200&auto=format&fit=crop",
    duration: "8:15",
    uploadDate: "2024-03-14",
    tags: ["Sports Car", "GR Supra", "Performance", "Track"],
  },
];

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const video = mockVideos.find((v) => v.id === Number(id)) || mockVideos[0];

  // Mock AI-generated insights (Azure AI Video Indexer style)
  const insights = {
    transcript: [
      { time: "00:00:05", speaker: "Narrator", text: "Welcome to our comprehensive review of the GR Corolla." },
      { time: "00:00:12", speaker: "Narrator", text: "This high-performance vehicle combines rally-bred technology with everyday usability." },
      { time: "00:00:25", speaker: "Narrator", text: "Let's dive into the key features that make this car exceptional." },
    ],
    keywords: ["Performance", "GR Corolla", "Rally", "AWD", "Turbocharged", "Sports Car", "Handling", "Power"],
    topics: ["Vehicle Performance", "Automotive Technology", "Sports Cars", "Rally Heritage"],
    faces: [
      { name: "John Smith", appearances: 8, confidence: 0.95 },
      { name: "Sarah Johnson", appearances: 3, confidence: 0.89 },
    ],
    scenes: [
      { time: "00:00:00", description: "Exterior shots of vehicle", duration: "0:15" },
      { time: "00:00:15", description: "Interior walkthrough", duration: "0:30" },
      { time: "00:00:45", description: "On-road performance demonstration", duration: "1:20" },
      { time: "00:02:05", description: "Track testing sequences", duration: "2:15" },
    ],
    objects: ["Vehicle", "Road", "Track", "Steering Wheel", "Dashboard", "Engine"],
    sentiments: [
      { sentiment: "Positive", percentage: 78 },
      { sentiment: "Neutral", percentage: 18 },
      { sentiment: "Negative", percentage: 4 },
    ],
    ocr: [
      { time: "00:01:23", text: "301 HP" },
      { time: "00:02:45", text: "GR-Four AWD System" },
      { time: "00:05:12", text: "0-60 MPH: 4.9s" },
    ],
    brands: ["GR", "Motorsport", "Rally"],
    celebrities: [],
    emotions: [
      { emotion: "Excitement", percentage: 65 },
      { emotion: "Neutral", percentage: 25 },
      { emotion: "Focused", percentage: 10 },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border backdrop-blur-lg">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/videos")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Video + Metadata Panel */}
      <div className="pt-16 h-screen flex">
        {/* Video Player Section */}
        <div className="flex-1 flex flex-col bg-black">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative w-full max-w-7xl aspect-video rounded-lg overflow-hidden group">
              <img
                src={video.url}
                alt={video.title}
                className="w-full h-full object-contain"
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <div className="flex-1 h-1 bg-white/30 rounded-full">
                      <div className="h-full w-1/3 bg-primary rounded-full" />
                    </div>
                    <span className="text-white text-sm">04:15 / {video.duration}</span>
                    <Volume2 className="h-5 w-5 text-white" />
                    <Maximize className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Title Bar */}
          <div className="px-6 py-4 bg-background border-t border-border">
            <h1 className="text-xl font-bold mb-2">{video.title}</h1>
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights Panel - Azure AI Video Indexer Style */}
        <div className="w-[420px] flex flex-col glass border-l border-border overflow-hidden">
          <div className="bg-secondary/30 p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Insights</h2>
            </div>
          </div>

          <Tabs defaultValue="transcript" className="flex-1 flex flex-col">
            <TabsList className="w-full grid grid-cols-3 rounded-none border-b bg-transparent h-auto p-0">
              <TabsTrigger 
                value="transcript" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <FileText className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Transcript</span>
              </TabsTrigger>
              <TabsTrigger 
                value="insights"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
              <TabsTrigger 
                value="people"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">People</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transcript" className="flex-1 p-4 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-3 pr-4">
                  {insights.transcript.map((item, idx) => (
                    <div key={idx} className="group hover:bg-secondary/20 p-3 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <span className="text-xs text-primary font-mono mt-1 min-w-[60px]">{item.time}</span>
                        <div className="flex-1 space-y-1">
                          <Badge variant="outline" className="text-xs mb-1">
                            {item.speaker}
                          </Badge>
                          <p className="text-sm leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="insights" className="flex-1 p-4 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  {/* Keywords */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
                      <Tag className="h-4 w-4" />
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {insights.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="cursor-pointer hover:bg-primary/20">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Topics */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
                      <MessageSquare className="h-4 w-4" />
                      Topics
                    </h3>
                    <div className="space-y-2">
                      {insights.topics.map((topic) => (
                        <div key={topic} className="flex items-start gap-2 text-sm hover:bg-secondary/20 p-2 rounded transition-colors cursor-pointer">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Sentiments */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Sentiment Analysis</h3>
                    <div className="space-y-3">
                      {insights.sentiments.map((item) => (
                        <div key={item.sentiment}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{item.sentiment}</span>
                            <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Scenes */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
                      <MapPin className="h-4 w-4" />
                      Scenes
                    </h3>
                    <div className="space-y-3">
                      {insights.scenes.map((scene, idx) => (
                        <div key={idx} className="hover:bg-secondary/20 p-3 rounded-lg transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-primary font-mono">{scene.time}</span>
                            <Badge variant="outline" className="text-xs">
                              {scene.duration}
                            </Badge>
                          </div>
                          <p className="text-sm">{scene.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* OCR Text */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Detected Text (OCR)</h3>
                    <div className="space-y-2">
                      {insights.ocr.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm hover:bg-secondary/20 p-2 rounded transition-colors cursor-pointer">
                          <span className="text-primary font-mono text-xs min-w-[60px]">{item.time}</span>
                          <span className="font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="people" className="flex-1 p-4 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-3 pr-4">
                  {insights.faces.map((face, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 hover:bg-secondary/20 rounded-lg transition-colors cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{face.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{face.appearances} appearances</span>
                          <span>•</span>
                          <span>{Math.round(face.confidence * 100)}% confidence</span>
                        </div>
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
}
