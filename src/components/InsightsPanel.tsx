import { Users, Tag, Package, Type, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FaceThumbnail } from "./FaceThumbnail";
import { useState } from "react";

interface InsightsPanelProps {
  video: any;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const InsightsPanel = ({ video, videoRef }: InsightsPanelProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    people: true,
    topics: true,
    keywords: true,
    labels: true,
    entities: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const detectedPeople = video.ai_metadata?.detected_people || [];
  const topics = video.ai_metadata?.topics || [];
  const keywords = video.tags || video.ai_metadata?.keywords || [];
  const labels = video.ai_metadata?.detected_objects || video.ai_metadata?.labels || [];
  const entities = video.ai_metadata?.entities || [];

  const handleTimelineClick = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const renderTimeline = (appearances: any[]) => {
    if (!appearances || appearances.length === 0) return null;
    const duration = video.duration || 100;
    
    return (
      <div className="flex gap-1 mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
        {appearances.map((appearance: any, i: number) => {
          const start = ((appearance.start || 0) / duration) * 100;
          const width = (((appearance.end || appearance.start || 0) - (appearance.start || 0)) / duration) * 100;
          return (
            <div
              key={i}
              className="h-full bg-primary cursor-pointer hover:bg-primary/80"
              style={{
                marginLeft: `${start}%`,
                width: `${Math.max(width, 0.5)}%`,
              }}
              onClick={() => handleTimelineClick(appearance.start || 0)}
            />
          );
        })}
      </div>
    );
  };

  const CollapsibleSection = ({ 
    title, 
    count, 
    icon: Icon, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    count: number; 
    icon: any; 
    sectionKey: string; 
    children: React.ReactNode 
  }) => (
    <div className="border-b border-border">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">
            {count} {title}
          </span>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="divide-y divide-border">
      {/* People Section */}
      {detectedPeople.length > 0 && (
        <CollapsibleSection
          title="people"
          count={detectedPeople.length}
          icon={Users}
          sectionKey="people"
        >
          <div className="space-y-4">
            {/* People avatars row */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {detectedPeople.slice(0, 10).map((person: any, i: number) => (
                <FaceThumbnail 
                  key={i} 
                  name={typeof person === 'string' ? person : person.name}
                  photoUrl={typeof person === 'object' ? person.thumbnail : undefined}
                  size="sm" 
                />
              ))}
            </div>
            
            {/* Detailed people list */}
            {detectedPeople.map((person: any, i: number) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2">
                  <FaceThumbnail 
                    name={typeof person === 'string' ? person : person.name}
                    photoUrl={typeof person === 'object' ? person.thumbnail : undefined}
                    size="sm" 
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {typeof person === 'string' ? person : person.name || `Person ${i + 1}`}
                    </p>
                    {typeof person === 'object' && person.appearances && (
                      <p className="text-xs text-muted-foreground">
                        Appears in {Array.isArray(person.appearances) ? person.appearances.length : person.appearances} segment{person.appearances !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                {typeof person === 'object' && person.appearances && Array.isArray(person.appearances) && renderTimeline(person.appearances)}
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Topics Section */}
      {topics.length > 0 && (
        <CollapsibleSection
          title="topics"
          count={topics.length}
          icon={Tag}
          sectionKey="topics"
        >
          <div className="space-y-3">
            {topics.map((topic: any, i: number) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {topic.name || topic.label || topic}
                  </Badge>
                  {topic.confidence && (
                    <span className="text-xs text-muted-foreground">
                      {Math.round(topic.confidence * 100)}%
                    </span>
                  )}
                </div>
                {topic.appearances && renderTimeline(topic.appearances)}
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Keywords Section */}
      {keywords.length > 0 && (
        <CollapsibleSection
          title="keywords"
          count={keywords.length}
          icon={Tag}
          sectionKey="keywords"
        >
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword: string | any, i: number) => (
              <Badge key={i} variant="outline" className="text-xs">
                {typeof keyword === 'string' ? keyword : keyword.name || keyword.label || keyword.text}
              </Badge>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Labels Section */}
      {labels.length > 0 && (
        <CollapsibleSection
          title="labels"
          count={labels.length}
          icon={Package}
          sectionKey="labels"
        >
          <div className="flex flex-wrap gap-2">
            {labels.map((label: any, i: number) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {typeof label === 'string' ? label : label.name || label.label}
              </Badge>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Named Entities Section */}
      {entities.length > 0 && (
        <CollapsibleSection
          title="named entities"
          count={entities.length}
          icon={Type}
          sectionKey="entities"
        >
          <div className="space-y-2">
            {entities.map((entity: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <Badge variant="outline">{entity.name || entity.text}</Badge>
                {entity.type && (
                  <span className="text-muted-foreground">{entity.type}</span>
                )}
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
};
