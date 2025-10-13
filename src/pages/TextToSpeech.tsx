import { useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Mic, Upload, Video, Layers, Play, Pause, Download } from "lucide-react";

export default function TextToSpeech() {
  const [activeTab, setActiveTab] = useState("generate");
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [emotion, setEmotion] = useState("neutral");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      toast.error("Please enter text to generate speech");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          toast.success("Speech generated successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">TTS / STT Studio</h1>
              <p className="text-muted-foreground">
                Advanced speech synthesis, voice cloning, transcription, and lip sync capabilities
              </p>
            </div>

            {/* Integration Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <Mic className="h-3 w-3" />
                OpenVoice V2
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Mic className="h-3 w-3" />
                Whisper
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Upload className="h-3 w-3" />
                Hugging Face
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Video className="h-3 w-3" />
                Lip Sync
              </Badge>
            </div>

            {/* Main Content */}
            <Card className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="generate">Generate Speech</TabsTrigger>
                  <TabsTrigger value="clone">Voice Cloning</TabsTrigger>
                  <TabsTrigger value="lipsync">Lip Sync Video</TabsTrigger>
                  <TabsTrigger value="batch">Batch Processing</TabsTrigger>
                </TabsList>

                {/* Generate Speech Tab */}
                <TabsContent value="generate" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Input */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="text-input">Input Text</Label>
                        <Textarea
                          id="text-input"
                          placeholder="Enter the text you want to convert to speech..."
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          rows={10}
                          className="resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Voice</Label>
                          <Select value={voice} onValueChange={setVoice}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="alloy">Alloy</SelectItem>
                              <SelectItem value="echo">Echo</SelectItem>
                              <SelectItem value="fable">Fable</SelectItem>
                              <SelectItem value="onyx">Onyx</SelectItem>
                              <SelectItem value="nova">Nova</SelectItem>
                              <SelectItem value="shimmer">Shimmer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Emotion/Tone</Label>
                          <Select value={emotion} onValueChange={setEmotion}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="neutral">Neutral</SelectItem>
                              <SelectItem value="happy">Happy</SelectItem>
                              <SelectItem value="sad">Sad</SelectItem>
                              <SelectItem value="excited">Excited</SelectItem>
                              <SelectItem value="calm">Calm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Controls */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Speed: {speed.toFixed(1)}x</Label>
                          <Slider
                            value={[speed * 100]}
                            onValueChange={([value]) => setSpeed(value / 100)}
                            min={50}
                            max={200}
                            step={10}
                            className="mt-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>0.5x</span>
                            <span>2.0x</span>
                          </div>
                        </div>

                        <div>
                          <Label>Pitch: {pitch.toFixed(1)}</Label>
                          <Slider
                            value={[pitch * 100]}
                            onValueChange={([value]) => setPitch(value / 100)}
                            min={50}
                            max={150}
                            step={10}
                            className="mt-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Low</span>
                            <span>High</span>
                          </div>
                        </div>

                        <div>
                          <Label>Background Music</Label>
                          <Select defaultValue="none">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="ambient">Ambient</SelectItem>
                              <SelectItem value="corporate">Corporate</SelectItem>
                              <SelectItem value="upbeat">Upbeat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {isProcessing && (
                        <div className="space-y-2">
                          <Label>Processing...</Label>
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground text-center">
                            {progress}% complete
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={handleGenerateSpeech}
                          disabled={isProcessing || !text.trim()}
                          className="flex-1"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Generate Speech
                        </Button>
                        {!isProcessing && progress === 100 && (
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Voice Cloning Tab */}
                <TabsContent value="clone" className="space-y-6 mt-6">
                  <div className="text-center py-12 space-y-4">
                    <Mic className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h3 className="text-xl font-semibold">Voice Cloning</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Upload audio samples to create a custom voice clone. Requires at least 5 minutes
                      of clear audio for best results.
                    </p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Audio Samples
                    </Button>
                  </div>
                </TabsContent>

                {/* Lip Sync Tab */}
                <TabsContent value="lipsync" className="space-y-6 mt-6">
                  <div className="text-center py-12 space-y-4">
                    <Video className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h3 className="text-xl font-semibold">Lip Sync Video</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Synchronize audio with video to create realistic lip-synced content. Upload your
                      video and audio files to get started.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline">
                        <Video className="h-4 w-4 mr-2" />
                        Upload Video
                      </Button>
                      <Button variant="outline">
                        <Mic className="h-4 w-4 mr-2" />
                        Upload Audio
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Batch Processing Tab */}
                <TabsContent value="batch" className="space-y-6 mt-6">
                  <div className="text-center py-12 space-y-4">
                    <Layers className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h3 className="text-xl font-semibold">Batch Processing</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Process multiple files simultaneously. Upload a CSV or JSON file with your text
                      entries and voice configurations.
                    </p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Batch File
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Features Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Mic className="h-4 w-4 text-primary" />
                  Live Transcription
                </h4>
                <p className="text-sm text-muted-foreground">
                  Real-time speech-to-text with multi-language support and speaker diarization
                </p>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" />
                  Timeline Integration
                </h4>
                <p className="text-sm text-muted-foreground">
                  Transcripts automatically embedded with video timeline markers for easy navigation
                </p>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Auto Language Detection
                </h4>
                <p className="text-sm text-muted-foreground">
                  Automatically detects and adds new languages and dialects found in your media
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
