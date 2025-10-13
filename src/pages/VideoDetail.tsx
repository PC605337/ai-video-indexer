import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Share2, User, MessageSquare, Tag, Volume2, Clock, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FaceThumbnail } from "@/components/FaceThumbnail";

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("insights");
  const [faceLibrary, setFaceLibrary] = useState<any[]>([]);

  useEffect(() => {
    const loadFaceLibrary = async () => {
      const { data } = await supabase
        .from("face_library")
        .select("*")
        .order("name");
      
      if (data) {
        setFaceLibrary(data);
      }
    };

    loadFaceLibrary();
  }, []);

  const videoData = {
    title: "Toyota Camry 2024 Launch Event",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "5:42",
  };

  // Map face library data to insights
  const peopleData = faceLibrary.slice(0, 5).map((exec, idx) => ({
    name: exec.name,
    role: exec.role_title,
    photoUrl: exec.photo_url,
    appearances: Math.floor(Math.random() * 15) + 5,
    timeframes: [
      `${idx}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}-${idx + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      `${idx + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}-${idx + 3}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
    ]
  }));

  const insights = {
    people: peopleData,
    observedPeople: [
      { id: 1, face: "Unknown Person #1", confidence: 0.95, timeframe: "2:10" },
      { id: 2, face: "Unknown Person #2", confidence: 0.88, timeframe: "3:45" },
    ],
    topics: [
      { name: "Product Launch", relevance: 0.92 },
      { name: "Hybrid Technology", relevance: 0.85 },
      { name: "Safety Features", relevance: 0.78 },
    ],
    keywords: ["Camry", "2024", "Hybrid", "Safety", "Innovation", "Toyota", "Launch"],
    labels: [
      { name: "Vehicle", confidence: 0.98 },
      { name: "Presentation", confidence: 0.95 },
      { name: "Automotive", confidence: 0.92 },
    ],
    emotions: [
      { type: "Confident", percentage: 75 },
      { type: "Enthusiastic", percentage: 62 },
      { type: "Professional", percentage: 88 },
    ],
    audioEffects: ["Applause (0:45)", "Music (2:30-3:00)", "Background Chatter (4:10)"],
  };

  const transcript = [
    { time: "00:00", speaker: "Akio Toyoda", text: "Welcome everyone to the launch of the all-new 2024 Toyota Camry." },
    { time: "00:30", speaker: "Akio Toyoda", text: "This vehicle represents the future of hybrid technology and sustainable mobility." },
    { time: "01:50", speaker: "Koji Sato", text: "The new Camry features advanced safety systems that set industry standards." },
    { time: "02:30", speaker: "Koji Sato", text: "We've integrated cutting-edge AI technology for driver assistance." },
  ];

  const handleTimeframeClick = (timeframe: string) => {
    console.log("Jumping to:", timeframe);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 h-16 glass border-b border-border z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold">{videoData.title}</h1>
            <p className="text-xs text-muted-foreground">{videoData.duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </header>

      <div className="pt-16 h-screen flex">
        <div className="flex-1 bg-black flex items-center justify-center">
          <video src={videoData.url} controls className="w-full h-full" style={{ maxHeight: "100%" }}>
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="w-[420px] glass border-l border-border flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="flex-1 m-0">
              <ScrollArea className="h-[calc(100vh-112px)]">
                <div className="p-4 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">People ({insights.people.length})</h3>
                    </div>
                    <div className="space-y-3">
                      {insights.people.map((person) => (
                        <div key={person.name} className="p-3 rounded-lg bg-secondary/50 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <FaceThumbnail 
                              name={person.name}
                              photoUrl={person.photoUrl}
                              role={person.role}
                              size="md"
                            />
                            <Badge variant="outline" className="text-xs shrink-0">{person.appearances} appearances</Badge>
                          </div>
                          <div className="space-y-1">
                            {person.timeframes.map((tf, idx) => (
                              <button key={idx} onClick={() => handleTimeframeClick(tf)} className="flex items-center gap-2 text-xs text-accent hover:underline w-full text-left">
                                <Clock className="h-3 w-3" />
                                {tf}
                                <ChevronRight className="h-3 w-3 ml-auto" />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Observed People</h3>
                    <div className="space-y-2">
                      {insights.observedPeople.map((person) => (
                        <button key={person.id} onClick={() => handleTimeframeClick(person.timeframe)} className="w-full p-2 rounded bg-secondary/30 hover:bg-secondary/50 transition-smooth flex items-center justify-between text-left">
                          <span className="text-sm">{person.face}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{(person.confidence * 100).toFixed(0)}%</span>
                            <span className="text-xs text-accent">{person.timeframe}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">Topics</h3>
                    </div>
                    <div className="space-y-2">
                      {insights.topics.map((topic) => (
                        <div key={topic.name} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{topic.name}</span>
                            <span className="text-xs text-muted-foreground">{(topic.relevance * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={topic.relevance * 100} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Volume2 className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">Audio Effects</h3>
                    </div>
                    <div className="space-y-1">
                      {insights.audioEffects.map((effect, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground">{effect}</div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">Keywords</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {insights.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Labels</h3>
                    <div className="space-y-2">
                      {insights.labels.map((label) => (
                        <div key={label.name} className="flex items-center justify-between text-sm">
                          <span>{label.name}</span>
                          <span className="text-xs text-muted-foreground">{(label.confidence * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Emotions</h3>
                    <div className="space-y-2">
                      {insights.emotions.map((emotion) => (
                        <div key={emotion.type} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{emotion.type}</span>
                            <span className="text-xs text-muted-foreground">{emotion.percentage}%</span>
                          </div>
                          <Progress value={emotion.percentage} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="timeline" className="flex-1 m-0">
              <ScrollArea className="h-[calc(100vh-112px)]">
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Transcription</h3>
                    <div className="space-y-3">
                      {transcript.map((entry, idx) => (
                        <button key={idx} onClick={() => handleTimeframeClick(entry.time)} className="w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth text-left space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-accent">{entry.time}</span>
                            <span className="text-xs text-muted-foreground">{entry.speaker}</span>
                          </div>
                          <p className="text-sm">{entry.text}</p>
                        </button>
                      ))}
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

export default VideoDetail;
