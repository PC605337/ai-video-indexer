import { Film, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScenesPanelProps {
  video: any;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const ScenesPanel = ({ video, videoRef }: ScenesPanelProps) => {
  const scenes = video.ai_metadata?.scenes || video.ai_metadata?.keyframes || [];

  const handleSceneClick = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (scenes.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <Film className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No scene detection data available</p>
        <p className="text-sm mt-2">Scene analysis will appear here once processed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Film className="h-4 w-4" />
            Scene Detection ({scenes.length} scenes)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-2 gap-3">
              {scenes.map((scene: any, i: number) => (
                <div
                  key={i}
                  onClick={() => handleSceneClick(scene.time || scene.start || i * 10)}
                  className="group cursor-pointer rounded-md border overflow-hidden hover:border-primary transition-colors"
                >
                  {(scene.thumbnailUrl || scene.thumbnail) && (
                    <div className="relative aspect-video bg-muted">
                      <img
                        src={scene.thumbnailUrl || scene.thumbnail}
                        alt={`Scene ${i + 1}`}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(scene.time || scene.start || i * 10)}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs font-medium mb-1">Scene {i + 1}</p>
                    {scene.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {scene.description}
                      </p>
                    )}
                    {scene.labels && scene.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {scene.labels.slice(0, 3).map((label: string, li: number) => (
                          <Badge key={li} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {scene.confidence && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {Math.round(scene.confidence * 100)}% confidence
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Scene Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Scene Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Scenes:</span>
              <span className="ml-2 font-medium">{scenes.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Avg Duration:</span>
              <span className="ml-2 font-medium">
                {video.duration && scenes.length > 0
                  ? `${Math.round(video.duration / scenes.length)}s`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
