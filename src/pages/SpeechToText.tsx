import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Mic,
  Square,
  Upload,
  FileAudio,
  Copy,
  Download,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error: any) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      transcribeAudio(file);
    }
  };

  const transcribeAudio = async (audioData: Blob | File) => {
    setIsTranscribing(true);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioData);

      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(",")[1];

        if (!base64Audio) {
          throw new Error("Failed to convert audio to base64");
        }

        const { data, error } = await supabase.functions.invoke("speech-to-text", {
          body: { audio: base64Audio },
        });

        if (error) throw error;

        if (data?.text) {
          setTranscript(data.text);
          toast({
            title: "Transcription complete",
            description: "Your audio has been transcribed successfully",
          });
        }
      };

      reader.onerror = () => {
        throw new Error("Failed to read audio file");
      };
    } catch (error: any) {
      console.error("Error transcribing audio:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to transcribe audio",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    toast({
      title: "Copied",
      description: "Transcript copied to clipboard",
    });
  };

  const downloadTranscript = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Speech-to-Text Studio</h1>
              <p className="text-muted-foreground">
                Convert audio to text using AI-powered transcription (Whisper Large V3)
              </p>
            </div>

            {/* Recording Controls */}
            <Card className="p-6 space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      size="lg"
                      className="w-48"
                      disabled={isTranscribing}
                    >
                      <Mic className="mr-2 h-5 w-5" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      size="lg"
                      variant="destructive"
                      className="w-48"
                    >
                      <Square className="mr-2 h-5 w-5" />
                      Stop Recording
                    </Button>
                  )}
                </div>

                {isRecording && (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm text-muted-foreground">
                      Recording in progress...
                    </span>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="lg"
                    className="w-48"
                    disabled={isRecording || isTranscribing}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Audio File
                  </Button>
                </div>

                {audioFile && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <FileAudio className="h-4 w-4" />
                    {audioFile.name}
                  </div>
                )}
              </div>

              {isTranscribing && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Transcribing audio...
                  </span>
                </div>
              )}
            </Card>

            {/* Transcript */}
            {transcript && (
              <Card className="p-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Transcript</h3>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button onClick={downloadTranscript} variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="min-h-[300px] font-mono"
                />

                <div className="text-sm text-muted-foreground">
                  {transcript.split(" ").length} words • {transcript.length} characters
                </div>
              </Card>
            )}

            {/* Features */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>90+ language support with Whisper Large V3</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Speaker diarization (who spoke when)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Industry-specific vocabulary recognition</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Real-time and batch processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>High accuracy with punctuation and formatting</span>
                </li>
              </ul>
            </Card>

            {/* Recent Jobs */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
              <div className="text-sm text-muted-foreground text-center py-8">
                No recent transcription jobs yet. Record or upload audio above.
              </div>
            </Card>
          </div>
        </main>
      </div>
  );
}
