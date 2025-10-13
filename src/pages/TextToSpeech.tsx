import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Loader2, Play, Download, Volume2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const voices = [
  { id: "alloy", name: "Alloy", description: "Neutral, balanced" },
  { id: "echo", name: "Echo", description: "Warm, friendly" },
  { id: "fable", name: "Fable", description: "Expressive, storytelling" },
  { id: "onyx", name: "Onyx", description: "Deep, authoritative" },
  { id: "nova", name: "Nova", description: "Bright, energetic" },
  { id: "shimmer", name: "Shimmer", description: "Soft, gentle" },
];

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [speed, setSpeed] = useState([1.0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateSpeech = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert to speech",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: {
          text: text.trim(),
          voice,
          speed: speed[0],
        },
      });

      if (error) throw error;

      if (data?.audioContent) {
        // Convert base64 to blob
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0))],
          { type: "audio/mpeg" }
        );
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        toast({
          title: "Success",
          description: "Speech generated successfully!",
        });
      }
    } catch (error: any) {
      console.error("Error generating speech:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate speech",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `speech-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Text-to-Speech Studio</h1>
              <p className="text-muted-foreground">
                Convert text to natural-sounding speech using AI
              </p>
            </div>

            <Card className="p-6 space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <Label htmlFor="text">Text to Convert</Label>
                <Textarea
                  id="text"
                  placeholder="Enter the text you want to convert to speech..."
                  className="min-h-[200px] font-mono"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="text-sm text-muted-foreground">
                  {text.length} characters
                </div>
              </div>

              {/* Voice Selection */}
              <div className="space-y-2">
                <Label htmlFor="voice">Voice</Label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger id="voice">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{v.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {v.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Speed Control */}
              <div className="space-y-2">
                <Label htmlFor="speed">
                  Speech Speed: {speed[0].toFixed(1)}x
                </Label>
                <Slider
                  id="speed"
                  min={0.25}
                  max={4.0}
                  step={0.25}
                  value={speed}
                  onValueChange={setSpeed}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateSpeech}
                disabled={isGenerating || !text.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Volume2 className="mr-2 h-5 w-5" />
                    Generate Speech
                  </>
                )}
              </Button>
            </Card>

            {/* Audio Player */}
            {audioUrl && (
              <Card className="p-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Generated Audio</h3>
                  <Button onClick={downloadAudio} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                <audio
                  controls
                  src={audioUrl}
                  className="w-full"
                  autoPlay
                />
              </Card>
            )}

            {/* Recent Jobs */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
              <div className="text-sm text-muted-foreground text-center py-8">
                No recent jobs yet. Generate your first speech above.
              </div>
            </Card>
          </div>
        </main>
      </div>
  );
}
