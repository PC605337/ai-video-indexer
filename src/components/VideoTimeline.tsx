import { useRef, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

interface TimelineMarker {
  id: string;
  time: number;
  comment: string;
  status: string;
}

interface VideoTimelineProps {
  duration: number;
  markers: TimelineMarker[];
  currentTime: number;
  onSeek: (time: number) => void;
  onMarkerClick: (marker: TimelineMarker) => void;
}

export const VideoTimeline = ({ duration, markers, currentTime, onSeek, onMarkerClick }: VideoTimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;
    onSeek(time);
  };

  const handleMouseDown = () => setIsDragging(true);
  
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const time = percentage * duration;
      onSeek(time);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, duration, onSeek]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-2 py-4">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div
        ref={timelineRef}
        className="relative h-16 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={handleTimelineClick}
        onMouseDown={handleMouseDown}
      >
        {/* Progress Bar */}
        <div
          className="absolute top-0 left-0 h-full bg-primary/20 rounded-lg transition-all"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
        
        {/* Current Time Indicator */}
        <div
          className="absolute top-0 h-full w-1 bg-primary shadow-lg"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background" />
        </div>

        {/* Comment Markers */}
        {markers.map((marker) => (
          <div
            key={marker.id}
            className="absolute top-0 h-full group"
            style={{ left: `${(marker.time / duration) * 100}%` }}
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick(marker);
            }}
          >
            <div className="relative h-full flex items-center">
              <div className={`w-1 h-full ${marker.status === 'open' ? 'bg-destructive' : 'bg-muted-foreground'}`} />
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg border text-xs whitespace-nowrap">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-3 w-3" />
                    <span className="font-semibold">{formatTime(marker.time)}</span>
                  </div>
                  <p className="max-w-[200px] truncate">{marker.comment}</p>
                  <Badge variant={marker.status === 'open' ? 'destructive' : 'secondary'} className="text-xs mt-1">
                    {marker.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
