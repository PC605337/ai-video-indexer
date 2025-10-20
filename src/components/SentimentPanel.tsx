import { Smile, Meh, Frown, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface SentimentPanelProps {
  video: any;
}

export const SentimentPanel = ({ video }: SentimentPanelProps) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <Smile className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <Frown className="h-4 w-4 text-red-500" />;
      default:
        return <Meh className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const sentimentData = video.ai_metadata?.sentiment_analysis || {
    overall: video.ai_metadata?.sentiment || 'neutral',
    positive: 45,
    neutral: 35,
    negative: 20,
    segments: []
  };

  return (
    <div className="space-y-4">
      {/* Overall Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {getSentimentIcon(sentimentData.overall)}
            Overall Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${getSentimentColor(sentimentData.overall)}`}>
                {sentimentData.overall.charAt(0).toUpperCase() + sentimentData.overall.slice(1)}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm flex items-center gap-2">
                    <Smile className="h-3 w-3 text-green-500" />
                    Positive
                  </span>
                  <span className="text-sm font-medium">{sentimentData.positive}%</span>
                </div>
                <Progress value={sentimentData.positive} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm flex items-center gap-2">
                    <Meh className="h-3 w-3 text-yellow-500" />
                    Neutral
                  </span>
                  <span className="text-sm font-medium">{sentimentData.neutral}%</span>
                </div>
                <Progress value={sentimentData.neutral} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm flex items-center gap-2">
                    <Frown className="h-3 w-3 text-red-500" />
                    Negative
                  </span>
                  <span className="text-sm font-medium">{sentimentData.negative}%</span>
                </div>
                <Progress value={sentimentData.negative} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Timeline */}
      {sentimentData.segments && sentimentData.segments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sentiment Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sentimentData.segments.map((segment: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-md border bg-card">
                  <Badge variant="secondary" className="text-xs">
                    {Math.floor(segment.start)}s
                  </Badge>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getSentimentIcon(segment.sentiment)}
                      <span className={`text-sm font-medium ${getSentimentColor(segment.sentiment)}`}>
                        {segment.sentiment}
                      </span>
                      {segment.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                      {segment.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                    </div>
                    {segment.text && (
                      <p className="text-xs text-muted-foreground">{segment.text}</p>
                    )}
                  </div>
                  {segment.confidence && (
                    <span className="text-xs text-muted-foreground">
                      {Math.round(segment.confidence * 100)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emotion Detection */}
      {video.ai_metadata?.emotions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Detected Emotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(video.ai_metadata.emotions).map(([emotion, value]: [string, any]) => (
                <Badge key={emotion} variant="outline" className="flex items-center gap-1">
                  {emotion}
                  <span className="text-xs opacity-70">{Math.round(value * 100)}%</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
