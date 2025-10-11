import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
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
  Eye,
  MessageSquare,
  Tag,
  Users,
  MapPin,
  Clock,
  BarChart3,
  Sparkles,
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
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate("/videos")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Videos
            </Button>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Video Player Section */}
              <div className="lg:col-span-2 space-y-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
                  <img
                    src={video.url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-4 mb-4">
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

                {/* Video Info */}
                <div className="glass rounded-lg p-6">
                  <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {video.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {video.uploadDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      1,234 views
                    </span>
                  </div>
                  <div className="flex gap-2">
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

              {/* AI Insights Panel - Azure Style */}
              <div className="glass rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">AI Insights</h2>
                </div>

                <Tabs defaultValue="transcript" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="transcript">
                      <FileText className="h-4 w-4 mr-1" />
                      Transcript
                    </TabsTrigger>
                    <TabsTrigger value="insights">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analysis
                    </TabsTrigger>
                    <TabsTrigger value="people">
                      <Users className="h-4 w-4 mr-1" />
                      People
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="transcript">
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        {insights.transcript.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-primary font-mono">{item.time}</span>
                              <Badge variant="outline" className="text-xs">
                                {item.speaker}
                              </Badge>
                            </div>
                            <p className="text-sm">{item.text}</p>
                            {idx < insights.transcript.length - 1 && (
                              <Separator className="mt-3" />
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="insights">
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-6">
                        {/* Keywords */}
                        <div>
                          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Keywords
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {insights.keywords.map((keyword) => (
                              <Badge key={keyword} variant="secondary">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Topics */}
                        <div>
                          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Topics
                          </h3>
                          <div className="space-y-2">
                            {insights.topics.map((topic) => (
                              <div key={topic} className="text-sm">
                                • {topic}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Sentiments */}
                        <div>
                          <h3 className="text-sm font-semibold mb-3">Sentiment Analysis</h3>
                          <div className="space-y-2">
                            {insights.sentiments.map((item) => (
                              <div key={item.sentiment} className="flex items-center gap-2">
                                <span className="text-sm w-20">{item.sentiment}</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: `${item.percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground w-12 text-right">
                                  {item.percentage}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Scenes */}
                        <div>
                          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Detected Scenes
                          </h3>
                          <div className="space-y-3">
                            {insights.scenes.map((scene, idx) => (
                              <div key={idx} className="text-sm space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-primary font-mono">{scene.time}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {scene.duration}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground">{scene.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* OCR Text */}
                        <div>
                          <h3 className="text-sm font-semibold mb-3">Detected Text (OCR)</h3>
                          <div className="space-y-2">
                            {insights.ocr.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <span className="text-primary font-mono">{item.time}</span>
                                <span className="text-muted-foreground">•</span>
                                <span>{item.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="people">
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        {insights.faces.map((face, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 glass rounded-lg">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{face.name}</h4>
                              <div className="text-sm text-muted-foreground">
                                {face.appearances} appearances
                              </div>
                            </div>
                            <Badge variant="secondary">
                              {Math.round(face.confidence * 100)}% confidence
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
