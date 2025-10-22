import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function VideoDetail() {
  const navigate = useNavigate();

  // Mock video data
  const video = {
    id: "1",
    title: "Demo Video",
    description: "This is a demo description for the video.",
    thumbnail: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop",
    duration: 125,
    file_size: 104857600, // 100 MB
    tags: ["Demo", "Prototype", "UX"],
    transcription: "This is a sample transcription of the video. It demonstrates how transcription appears in the UI.",
    translations: {
      Hindi: "यह वीडियो का नमूना ट्रांसक्रिप्शन है।",
      Spanish: "Esta es una transcripción de ejemplo del video.",
    },
    ai_metadata: {
      detected_people: ["Alice", "Bob"],
      scenes: ["Office", "Meeting Room"],
      objects: ["Laptop", "Chair", "Table"],
    },
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="flex-1">
      <Header />
      <main className="pt-16 p-6 max-w-5xl mx-auto space-y-6">
        <Button variant="outline" onClick={() => navigate("/videos")}>
          Back to Library
        </Button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Video Thumbnail */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full md:w-1/2 rounded-lg object-cover shadow"
          />

          {/* Video Details */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold">{video.title}</h1>
            <p className="text-muted-foreground">{video.description}</p>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              {video.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Duration and File Size */}
            <p>
              <strong>Duration:</strong> {formatDuration(video.duration)} |{" "}
              <strong>Size:</strong> {formatBytes(video.file_size)}
            </p>

            {/* AI Metadata */}
            <div className="mt-4">
              <h2 className="font-semibold">Detected People</h2>
              <p>{video.ai_metadata.detected_people.join(", ")}</p>

              <h2 className="font-semibold mt-2">Scenes</h2>
              <p>{video.ai_metadata.scenes.join(", ")}</p>

              <h2 className="font-semibold mt-2">Objects</h2>
              <p>{video.ai_metadata.objects.join(", ")}</p>
            </div>

            {/* Transcription */}
            <div className="mt-4">
              <h2 className="font-semibold">Transcription</h2>
              <p className="p-2 bg-gray-100 rounded">{video.transcription}</p>
            </div>

            {/* Translations */}
            <div className="mt-4">
              <h2 className="font-semibold">Translations</h2>
              {Object.entries(video.translations).map(([lang, text]) => (
                <div key={lang} className="mt-1">
                  <strong>{lang}:</strong> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
