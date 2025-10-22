import { Users, Tag, FileText, Sparkles, Heart, ChevronDown, Volume2, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TimeInstance {
  start: string;
  end: string;
  adjustedStart?: string;
  adjustedEnd?: string;
  confidence?: number;
}

interface Person {
  id: string | number;
  name: string;
  role?: string;
  company?: string;
  appearances?: number;
  duration?: string;
  thumbnail?: string;
  timestamps?: string[];
  instances?: TimeInstance[];
}

interface Topic {
  name: string;
  confidence: number;
  duration?: string;
  count?: number;
  instances?: TimeInstance[];
}

interface Keyword {
  word: string;
  count: number;
  relevance: number;
  instances?: TimeInstance[];
}

interface Label {
  name: string;
  confidence: number;
  instances: number | TimeInstance[];
}

interface Brand {
  name: string;
  confidence: number;
  appearances: number;
  instances?: TimeInstance[];
}

interface Emotion {
  type: string;
  confidence?: number;
  instances: TimeInstance[];
}

interface AudioEffect {
  name: string;
  instances: TimeInstance[];
}

interface Entity {
  name: string;
  type: string;
  count: number;
  instances?: TimeInstance[];
}

interface AzureInsightsPanelProps {
  people?: Person[];
  topics?: Topic[];
  keywords?: Keyword[];
  labels?: Label[];
  brands?: Brand[];
  emotions?: Emotion[];
  audioEffects?: AudioEffect[];
  entities?: Entity[];
  onTimeClick?: (timeInSeconds: number) => void;
}

const parseTimeToSeconds = (time: string): number => {
  const parts = time.split(':');
  let seconds = 0;
  
  if (parts.length === 3) {
    // Format: "0:06:42.086"
    const hours = parseInt(parts[0]);
    const mins = parseInt(parts[1]);
    const secs = parseFloat(parts[2]);
    seconds = hours * 3600 + mins * 60 + secs;
  } else if (parts.length === 2) {
    // Format: "06:42"
    const mins = parseInt(parts[0]);
    const secs = parseFloat(parts[1]);
    seconds = mins * 60 + secs;
  }
  
  return Math.floor(seconds);
};

const formatTime = (time: string): string => {
  const parts = time.split(':');
  if (parts.length === 3) {
    // Format: "0:06:42.086" -> "06:42"
    return `${parts[1]}:${parts[2].split('.')[0]}`;
  }
  return time;
};

export const AzureInsightsPanel = ({
  people = [],
  topics = [],
  keywords = [],
  labels = [],
  brands = [],
  emotions = [],
  audioEffects = [],
  entities = [],
  onTimeClick,
}: AzureInsightsPanelProps) => {
  const handleInstanceClick = (time: string) => {
    if (onTimeClick) {
      const seconds = parseTimeToSeconds(time);
      onTimeClick(seconds);
    }
  };

  return (
    <div className="space-y-2">
      <Accordion type="multiple" defaultValue={["people", "topics", "audioEffects", "keywords", "labels", "brands", "entities", "emotions"]} className="space-y-2">
        {/* People / Observed Section */}
        {people.length > 0 && (
          <AccordionItem value="people" className="border rounded-lg bg-card">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-sm">People / Observed</span>
                <Badge variant="secondary" className="ml-auto mr-2">{people.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 mt-2">
                {people.map((person) => (
                  <Card key={person.id} className="p-3 hover:bg-accent/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 border border-primary/20">
                        <AvatarImage src={person.thumbnail} alt={person.name} />
                        <AvatarFallback className="bg-primary/10 text-xs">
                          {person.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{person.name}</p>
                        {person.role && <p className="text-xs text-muted-foreground">{person.role}</p>}
                        {person.company && <p className="text-xs text-muted-foreground">{person.company}</p>}
                        {person.appearances && person.duration && (
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>{person.appearances} appearances</span>
                            <span>•</span>
                            <span>{person.duration}</span>
                          </div>
                        )}
                        {/* Time Instances */}
                        {person.instances && person.instances.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {person.instances.map((instance, i) => (
                              <Badge 
                                key={i} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs font-mono px-2 py-0.5"
                                onClick={() => handleInstanceClick(instance.start)}
                              >
                                {formatTime(instance.start)}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {/* Legacy timestamps */}
                        {person.timestamps && person.timestamps.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {person.timestamps.map((ts, i) => (
                              <Badge 
                                key={i} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs font-mono px-2 py-0.5"
                                onClick={() => {
                                  const [mins, secs] = ts.split(':').map(Number);
                                  onTimeClick?.((mins * 60) + secs);
                                }}
                              >
                                {ts}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Topics Section */}
        {topics.length > 0 && (
          <AccordionItem value="topics" className="border rounded-lg bg-card">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
                  <Tag className="h-4 w-4 text-blue-500" />
                </div>
                <span className="font-semibold text-sm">Topics</span>
                <Badge variant="secondary" className="ml-auto mr-2">{topics.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 mt-2">
                {topics.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{topic.name}</p>
                        {topic.count && topic.duration && (
                          <p className="text-xs text-muted-foreground">{topic.count} mentions • {topic.duration}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="ml-2 text-xs">{topic.confidence}%</Badge>
                    </div>
                    <Progress value={topic.confidence} className="h-1" />
                    {/* Time Instances */}
                    {topic.instances && topic.instances.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {topic.instances.map((instance, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-blue-500 hover:text-white transition-colors text-xs font-mono px-2 py-0.5"
                            onClick={() => handleInstanceClick(instance.start)}
                          >
                            {formatTime(instance.start)} - {formatTime(instance.end)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Keywords Section */}
        {keywords.length > 0 && (
          <AccordionItem value="keywords" className="border rounded-lg bg-card">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/10">
                  <FileText className="h-4 w-4 text-green-500" />
                </div>
                <span className="font-semibold text-sm">Keywords</span>
                <Badge variant="secondary" className="ml-auto mr-2">{keywords.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 mt-2">
                {keywords.map((keyword, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{keyword.word}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{keyword.count} mentions</span>
                        <Badge variant="outline" className="text-xs">{keyword.relevance}%</Badge>
                      </div>
                    </div>
                    {/* Time Instances */}
                    {keyword.instances && keyword.instances.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {keyword.instances.map((instance, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-green-500 hover:text-white transition-colors text-xs font-mono px-2 py-0.5"
                            onClick={() => handleInstanceClick(instance.start)}
                          >
                            {formatTime(instance.start)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Labels Section */}
        {labels.length > 0 && (
          <AccordionItem value="labels" className="border rounded-lg bg-card">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/10">
                  <Tag className="h-4 w-4 text-purple-500" />
                </div>
                <span className="font-semibold text-sm">Labels</span>
                <Badge variant="secondary" className="ml-auto mr-2">{labels.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 mt-2">
                {labels.map((label, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{label.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {Array.isArray(label.instances) ? label.instances.length : label.instances} instances
                        </span>
                        <Badge variant="outline" className="text-xs">{label.confidence}%</Badge>
                      </div>
                    </div>
                    <Progress value={label.confidence} className="h-1" />
                    {/* Time Instances */}
                    {Array.isArray(label.instances) && label.instances.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {label.instances.map((instance, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-purple-500 hover:text-white transition-colors text-xs font-mono px-2 py-0.5"
                            onClick={() => handleInstanceClick(instance.start)}
                          >
                            {formatTime(instance.start)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Brands Section */}
        {brands.length > 0 && (
          <AccordionItem value="brands" className="border rounded-lg bg-card">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10">
                  <Sparkles className="h-4 w-4 text-orange-500" />
                </div>
                <span className="font-semibold text-sm">Brands</span>
                <Badge variant="secondary" className="ml-auto mr-2">{brands.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2 mt-2">
                {brands.map((brand, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30">
                      <span className="font-medium text-sm">{brand.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{brand.appearances} appearances</span>
                        <Badge variant="outline" className="text-xs">{brand.confidence}%</Badge>
                      </div>
                    </div>
                    {/* Time Instances */}
                    {brand.instances && brand.instances.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {brand.instances.map((instance, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-orange-500 hover:text-white transition-colors text-xs font-mono px-2 py-0.5"
                            onClick={() => handleInstanceClick(instance.start)}
                          >
                            {formatTime(instance.start)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Audio Effects Section */}
        {audioEffects.length > 0 && (
          <AccordionItem value="audioEffects" className="border rounded-lg bg-card">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10">
                  <Volume2 className="h-4 w-4 text-cyan-500" />
                </div>
                <span className="font-semibold text-sm">Audio Effects</span>
                <Badge variant="secondary" className="ml-auto mr-2">{audioEffects.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2 mt-2">
                {audioEffects.map((effect, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30">
                      <span className="font-medium text-sm">{effect.name}</span>
                      <span className="text-xs text-muted-foreground">{effect.instances.length} instances</span>
                    </div>
                    {/* Time Instances */}
                    {effect.instances && effect.instances.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {effect.instances.map((instance, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-cyan-500 hover:text-white transition-colors text-xs font-mono px-2 py-0.5"
                            onClick={() => handleInstanceClick(instance.start)}
                          >
                            {formatTime(instance.start)} - {formatTime(instance.end)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Emotions Section */}
        {emotions.length > 0 && (
          <AccordionItem value="emotions" className="border rounded-lg bg-card">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-500/10">
                  <Heart className="h-4 w-4 text-pink-500" />
                </div>
                <span className="font-semibold text-sm">Emotions</span>
                <Badge variant="secondary" className="ml-auto mr-2">{emotions.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 mt-2">
                {emotions.map((emotion, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{emotion.type}</span>
                      {emotion.confidence && (
                        <Badge variant="outline" className="text-xs">{Math.round(emotion.confidence * 100)}%</Badge>
                      )}
                    </div>
                    {/* Time Instances */}
                    {emotion.instances && emotion.instances.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {emotion.instances.map((instance, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-pink-500 hover:text-white transition-colors text-xs font-mono px-2 py-0.5"
                            onClick={() => handleInstanceClick(instance.start)}
                          >
                            {formatTime(instance.start)} - {formatTime(instance.end)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Named Entities Section */}
        {entities.length > 0 && (
          <AccordionItem value="entities" className="border rounded-lg bg-card">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10">
                  <Building2 className="h-4 w-4 text-teal-500" />
                </div>
                <span className="font-semibold text-sm">Named Entities</span>
                <Badge variant="secondary" className="ml-auto mr-2">{entities.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 mt-2">
                {entities.map((entity, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="font-medium text-sm">{entity.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">{entity.type}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{entity.count} mentions</span>
                    </div>
                    {/* Time Instances */}
                    {entity.instances && entity.instances.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {entity.instances.map((instance, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-teal-500 hover:text-white transition-colors text-xs font-mono px-2 py-0.5"
                            onClick={() => handleInstanceClick(instance.start)}
                          >
                            {formatTime(instance.start)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};
