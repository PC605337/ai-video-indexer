import { Users, Tag, Sparkles, Eye, Package, Type } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FaceThumbnail } from "@/components/FaceThumbnail";

interface InsightsPanelProps {
  video: any;
  hoverTime: number | null;
}

export const InsightsPanel = ({ video, hoverTime }: InsightsPanelProps) => {
  return (
    <div className="space-y-4">
      {/* Video Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{video.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {video.description && (
            <p className="text-sm text-muted-foreground mb-4">{video.description}</p>
          )}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <span className="ml-2 font-medium">
                {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Size:</span>
              <span className="ml-2 font-medium">
                {video.file_size ? `${(video.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights at Hover Time */}
      {hoverTime !== null && video.ai_metadata?.frames && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Insights at {Math.floor(hoverTime / 60)}:{Math.floor(hoverTime % 60).toString().padStart(2, '0')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-x-auto text-muted-foreground whitespace-pre-wrap">
              {JSON.stringify(video.ai_metadata.frames[Math.floor(hoverTime)] || {}, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Detected People */}
      {video.ai_metadata?.detected_people && video.ai_metadata.detected_people.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Detected People ({video.ai_metadata.detected_people.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {video.ai_metadata.detected_people.map((person: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-md border bg-card">
                  <FaceThumbnail 
                    name={typeof person === 'string' ? person : person.name}
                    photoUrl={typeof person === 'object' ? person.thumbnail : undefined}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {typeof person === 'string' ? person : person.name}
                    </p>
                    {typeof person === 'object' && person.appearances && (
                      <p className="text-xs text-muted-foreground">
                        {person.appearances} appearances
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords & Topics */}
      {video.ai_metadata?.keywords && video.ai_metadata.keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Keywords & Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {video.ai_metadata.keywords.map((keyword: any, i: number) => (
                <Badge key={i} variant="secondary">
                  {typeof keyword === 'string' ? keyword : keyword.text}
                  {typeof keyword === 'object' && keyword.confidence && (
                    <span className="ml-1 text-xs opacity-70">
                      {Math.round(keyword.confidence * 100)}%
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detected Objects */}
      {video.ai_metadata?.detected_objects && video.ai_metadata.detected_objects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Detected Objects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {video.ai_metadata.detected_objects.map((object: string, i: number) => (
                <Badge key={i} variant="outline">
                  {object}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brands & Logos */}
      {video.ai_metadata?.brands && video.ai_metadata.brands.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="h-4 w-4" />
              Brands & Logos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {video.ai_metadata.brands.map((brand: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-md bg-muted">
                  <span className="text-sm font-medium">{brand.name}</span>
                  {brand.confidence && (
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(brand.confidence * 100)}%
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* OCR Text */}
      {video.ai_metadata?.ocr_text && video.ai_metadata.ocr_text.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Type className="h-4 w-4" />
              Extracted Text (OCR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {video.ai_metadata.ocr_text.map((text: any, i: number) => (
                <div key={i} className="p-2 rounded-md border bg-card text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      {text.timestamp ? `${Math.floor(text.timestamp)}s` : `Entry ${i + 1}`}
                    </span>
                    {text.confidence && (
                      <span className="text-xs text-muted-foreground">
                        {Math.round(text.confidence * 100)}%
                      </span>
                    )}
                  </div>
                  <p>{typeof text === 'string' ? text : text.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {video.tags && video.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag: string, i: number) => (
                <Badge key={i} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
