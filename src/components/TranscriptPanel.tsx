import { useState, useEffect, useRef } from "react";
import { Search, Download, Languages } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TranscriptSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
  confidence?: number;
}

interface TranscriptPanelProps {
  videoId: string;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const TranscriptPanel = ({ videoId, videoRef }: TranscriptPanelProps) => {
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);

  useEffect(() => {
    loadTranscript();
  }, [videoId, language]);

  const loadTranscript = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transcripts")
        .select("*")
        .eq("asset_id", videoId)
        .eq("language", language)
        .maybeSingle();

      if (error) throw error;

      if (data && data.segments) {
        setSegments(data.segments as TranscriptSegment[]);
      }
    } catch (error) {
      console.error("Error loading transcript:", error);
      toast.error("Failed to load transcript");
    } finally {
      setLoading(false);
    }
  };

  const handleSegmentClick = (segment: TranscriptSegment) => {
    if (videoRef.current) {
      videoRef.current.currentTime = segment.start;
      videoRef.current.play();
      setActiveSegmentId(segment.id);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredSegments = segments.filter(seg =>
    seg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seg.speaker?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadTranscript = () => {
    const text = segments.map(seg => 
      `[${formatTime(seg.start)} - ${formatTime(seg.end)}] ${seg.speaker ? `${seg.speaker}: ` : ''}${seg.text}`
    ).join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${videoId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">Loading transcript...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-32">
            <Languages className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={downloadTranscript} variant="outline" size="sm">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {filteredSegments.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          {searchQuery ? "No matching segments found" : "No transcript available"}
        </div>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="space-y-3">
            {filteredSegments.map((segment) => (
              <div
                key={segment.id}
                onClick={() => handleSegmentClick(segment)}
                className={`p-3 rounded-md border cursor-pointer transition-colors ${
                  activeSegmentId === segment.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-card hover:bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {formatTime(segment.start)}
                    </Badge>
                    {segment.speaker && (
                      <Badge variant="outline" className="text-xs">
                        {segment.speaker}
                      </Badge>
                    )}
                  </div>
                  {segment.confidence && (
                    <span className="text-xs text-muted-foreground">
                      {Math.round(segment.confidence * 100)}% confidence
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed">{segment.text}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
