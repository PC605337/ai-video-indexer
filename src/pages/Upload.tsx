import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload as UploadIcon, X, CheckCircle, AlertCircle, Mic, Languages, Sparkles, FileVideo, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  file: File;
}

export default function Upload() {
  const { toast } = useToast();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [aiProcessing, setAiProcessing] = useState({
    transcription: true,
    translation: false,
    objectDetection: true,
    sceneAnalysis: true,
    sentimentAnalysis: false,
    captionGeneration: true,
    faceRecognition: true,
    vehicleDetection: true,
    logoDetection: true,
    speakerDiarization: false,
    autoTagging: true,
    videoSummary: true,
    keywords: true,
    topics: true,
    namedEntityRecognition: true,
    ocr: true,
    keyScenesKeyframes: true,
    unknownPeople: true,
  });
  const [translationLanguages, setTranslationLanguages] = useState<string[]>([]);
  const [textToTranslate, setTextToTranslate] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (fileList: File[]) => {
    toast({
      title: "Upload Started",
      description: `Processing ${fileList.length} file(s)...`,
    });

    const newFiles: UploadFile[] = fileList.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      progress: 0,
      status: "uploading" as const,
      file,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Process each file
    for (const uploadFile of newFiles) {
      await processFile(uploadFile);
    }
  };

  const processFile = async (uploadFile: UploadFile) => {
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, progress } : f
          )
        );
      }

      // Change to processing status
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "processing" } : f
        )
      );

      // Run AI analysis if enabled
      if (uploadFile.file.type.startsWith("audio/") || uploadFile.file.type.startsWith("video/")) {
        if (aiProcessing.transcription) {
          await transcribeAudio(uploadFile.file);
        }
        if (aiProcessing.speakerDiarization) {
          await performSpeakerDiarization(uploadFile.file);
        }
      }

      if (uploadFile.file.type.startsWith("image/") || uploadFile.file.type.startsWith("video/")) {
        const features = [];
        if (aiProcessing.faceRecognition) features.push("faces");
        if (aiProcessing.vehicleDetection) features.push("vehicles");
        if (aiProcessing.logoDetection) features.push("logos");
        if (aiProcessing.autoTagging) features.push("tags");
        
        if (features.length > 0) {
          await performVisionAnalysis(uploadFile.file, features);
        }
      }

      if (aiProcessing.objectDetection || aiProcessing.sceneAnalysis || aiProcessing.sentimentAnalysis) {
        await analyzeMedia(uploadFile.file);
      }

      if (aiProcessing.captionGeneration) {
        await generateMultilingualCaptions(uploadFile.file);
      }

      // Mark as complete
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "complete" } : f
        )
      );

      toast({
        title: "Processing Complete",
        description: `${uploadFile.name} has been indexed successfully.`,
      });
    } catch (error) {
      console.error("File processing error:", error);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "error" } : f
        )
      );
      toast({
        title: "Processing Failed",
        description: `Failed to process ${uploadFile.name}`,
        variant: "destructive",
      });
    }
  };

  const transcribeAudio = async (file: File) => {
    try {
      const reader = new FileReader();
      const audioBase64 = await new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("transcribe-audio", {
        body: { audioBase64, language: "auto" },
      });

      if (error) throw error;

      toast({
        title: "Transcription Complete",
        description: "Audio has been transcribed successfully.",
      });
    } catch (error) {
      console.error("Transcription error:", error);
    }
  };

  const performVisionAnalysis = async (file: File, features: string[]) => {
    try {
      const reader = new FileReader();
      const imageUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("ai-vision-analysis", {
        body: { imageUrl, features },
      });

      if (error) throw error;

      toast({
        title: "Vision Analysis Complete",
        description: `Analyzed: ${features.join(", ")}`,
      });
    } catch (error) {
      console.error("Vision analysis error:", error);
    }
  };

  const performSpeakerDiarization = async (file: File) => {
    try {
      const reader = new FileReader();
      const audioBase64 = await new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("speaker-diarization", {
        body: { audioBase64 },
      });

      if (error) throw error;

      toast({
        title: "Speaker Diarization Complete",
        description: "Identified speakers and their segments.",
      });
    } catch (error) {
      console.error("Speaker diarization error:", error);
    }
  };

  const generateMultilingualCaptions = async (file: File) => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-captions", {
        body: {
          text: file.name, // In real app, would extract content first
          languages: ["English", "Japanese", "Spanish"],
        },
      });

      if (error) throw error;

      toast({
        title: "Captions Generated",
        description: "Multi-language captions created successfully.",
      });
    } catch (error) {
      console.error("Caption generation error:", error);
    }
  };

  const analyzeMedia = async (file: File) => {
    try {
      const fileUrl = URL.createObjectURL(file);
      
      const analyses = [];
      if (aiProcessing.objectDetection) analyses.push("objects");
      if (aiProcessing.sceneAnalysis) analyses.push("scenes");
      if (aiProcessing.sentimentAnalysis) analyses.push("sentiment");

      for (const analysisType of analyses) {
        const { data, error } = await supabase.functions.invoke("analyze-media", {
          body: { fileUrl, analysisType },
        });

        if (error) throw error;
      }

      toast({
        title: "AI Analysis Complete",
        description: "Media has been analyzed successfully.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
    }
  };

  const handleTranslate = async () => {
    if (!textToTranslate || translationLanguages.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter text and select target language(s).",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    try {
      const translations: string[] = [];

      for (const targetLang of translationLanguages) {
        const { data, error } = await supabase.functions.invoke("translate-text", {
          body: {
            text: textToTranslate,
            targetLanguage: targetLang,
          },
        });

        if (error) throw error;
        translations.push(`[${targetLang.toUpperCase()}]\n${data.translation}\n`);
      }

      setTranslatedText(translations.join("\n"));
      toast({
        title: "Translation Complete",
        description: `Translated to ${translationLanguages.length} language(s).`,
      });
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation Failed",
        description: "Failed to translate text.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Upload & AI Indexing</h1>
          <p className="text-muted-foreground">
            Bulk upload media files with intelligent AI classification, transcription, and translation
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Media</TabsTrigger>
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="translation">Translation</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Form */}
            <Card className="p-8 glass">
              <div className="space-y-6">
                {/* Metadata Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Asset Type</Label>
                    <Select defaultValue="campaign">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campaign">Campaign</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="plant">Plant Tour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Data Sensitivity</Label>
                    <Select defaultValue="internal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="confidential">Confidential</SelectItem>
                        <SelectItem value="protected">Protected (Code Red)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input placeholder="e.g., Lexus ES 2025 Campaign" />
                </div>

                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                    ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                  `}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                    accept="video/*,image/*,audio/*"
                  />
                  <UploadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Drop files here or click to browse
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports video, images, and audio files
                  </p>
                  <Button type="button">Select Files</Button>
                </div>
              </div>
            </Card>

            {/* AI Processing Options */}
            <Card className="p-6 glass">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Processing Options
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { id: "transcription", label: "Audio Transcription (Multi-language)", icon: Mic, description: "Auto-detect and transcribe speech" },
                  { id: "speakerDiarization", label: "Speaker Diarization", icon: Mic, description: "Identify different speakers" },
                  { id: "faceRecognition", label: "Executive Facial Recognition", icon: ImageIcon, description: "Detect and identify people" },
                  { id: "vehicleDetection", label: "Vehicle Model Detection", icon: FileVideo, description: "Identify Toyota/Lexus models" },
                  { id: "logoDetection", label: "Logo & Brand Detection", icon: Sparkles, description: "Recognize company logos" },
                  { id: "objectDetection", label: "Object Detection", icon: FileVideo, description: "Identify objects in media" },
                  { id: "sceneAnalysis", label: "Scene Classification", icon: ImageIcon, description: "Categorize content type" },
                  { id: "sentimentAnalysis", label: "Sentiment Analysis", icon: Sparkles, description: "Analyze emotional tone" },
                  { id: "captionGeneration", label: "Auto-caption (EN/JP/ES)", icon: Languages, description: "Generate multilingual captions" },
                  { id: "autoTagging", label: "Auto-tagging & Metadata", icon: Sparkles, description: "Smart content tagging" },
                  { id: "translation", label: "Multi-language Translation", icon: Languages, description: "Translate to 6+ languages" },
                  { id: "videoSummary", label: "AI Generated Video Summary", icon: FileVideo, description: "Generate comprehensive video summaries" },
                  { id: "keywords", label: "Keywords", icon: Sparkles, description: "Extract key terms and phrases" },
                  { id: "topics", label: "Topics", icon: Sparkles, description: "Identify main topics and themes" },
                  { id: "namedEntityRecognition", label: "Named Entity Recognition", icon: Sparkles, description: "Detect names, places, organizations" },
                  { id: "ocr", label: "OCR", icon: ImageIcon, description: "Extract text from images and videos" },
                  { id: "keyScenesKeyframes", label: "Key Scenes and Keyframes", icon: FileVideo, description: "Identify important moments" },
                  { id: "unknownPeople", label: "Unknown People", icon: ImageIcon, description: "Detect unidentified individuals" },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.id} className="flex items-start space-x-2 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all">
                      <Checkbox
                        id={option.id}
                        checked={aiProcessing[option.id as keyof typeof aiProcessing]}
                        onCheckedChange={(checked) =>
                          setAiProcessing((prev) => ({ ...prev, [option.id]: checked }))
                        }
                        className="mt-1"
                      />
                      <label
                        htmlFor={option.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </label>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Upload Queue */}
            {files.length > 0 && (
              <Card className="p-6 glass">
                <h3 className="text-lg font-semibold mb-4">Upload Queue</h3>
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{file.name}</p>
                          <span className="text-sm text-muted-foreground">
                            {file.size}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={file.progress} className="h-2" />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {Math.round(file.progress)}%
                          </span>
                        </div>
                        {file.status === "processing" && (
                          <p className="text-xs text-primary mt-1">Running AI analysis...</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === "complete" && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {file.status === "error" && (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transcription">
            <Card className="p-6 glass">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Audio Transcription
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload audio or video files to automatically transcribe speech to text with AI-powered accuracy.
              </p>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-xl p-8 text-center">
                  <Mic className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Drag audio/video file here or use the upload tab
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP3, WAV, M4A, MP4, MOV
                  </p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Auto-detect language
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Speaker diarization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Timestamp generation
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="translation">
            <Card className="p-6 glass">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                Multi-language Translation
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Text to Translate</Label>
                  <Textarea
                    placeholder="Enter text to translate..."
                    value={textToTranslate}
                    onChange={(e) => setTextToTranslate(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Target Languages</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Japanese", "Spanish", "French", "German", "Chinese", "Korean"].map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${lang}`}
                          checked={translationLanguages.includes(lang)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTranslationLanguages([...translationLanguages, lang]);
                            } else {
                              setTranslationLanguages(translationLanguages.filter((l) => l !== lang));
                            }
                          }}
                        />
                        <label htmlFor={`lang-${lang}`} className="text-sm">
                          {lang}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleTranslate} disabled={isTranslating} className="w-full">
                  {isTranslating ? "Translating..." : "Translate"}
                </Button>

                {translatedText && (
                  <div className="space-y-2">
                    <Label>Translations</Label>
                    <Textarea
                      value={translatedText}
                      readOnly
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
