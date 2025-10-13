import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Youtube, Database, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PopulateLibraries() {
  const [youtubeUrl, setYoutubeUrl] = useState("https://youtu.be/2Hmj-Gw1j3Y?si=NMA1voIVGGyxiDDn");
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexedVideo, setIndexedVideo] = useState<any>(null);

  const handleIndexYouTube = async () => {
    if (!youtubeUrl.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    setIsIndexing(true);
    setIndexedVideo(null);

    try {
      console.log("Calling index-youtube-video function...");
      
      const { data, error } = await supabase.functions.invoke('index-youtube-video', {
        body: { youtubeUrl }
      });

      if (error) throw error;

      console.log("Function response:", data);

      if (data.success) {
        // Insert into database
        const { data: insertedAsset, error: insertError } = await supabase
          .from('media_assets')
          .insert([data.asset])
          .select()
          .single();

        if (insertError) throw insertError;

        setIndexedVideo(insertedAsset);
        toast.success("Video indexed successfully!");
        setYoutubeUrl("");
      } else {
        throw new Error(data.error || 'Failed to index video');
      }

    } catch (error: any) {
      console.error("Error indexing YouTube video:", error);
      toast.error(error.message || "Failed to index video");
    } finally {
      setIsIndexing(false);
    }
  };

  return (
    <div className="flex-1">
      <Header />
      <main className="pt-16 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Index YouTube Video</h1>
            <p className="text-muted-foreground">
              Import and analyze videos from YouTube for your media library
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <div className="flex gap-2">
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  disabled={isIndexing}
                />
                <Button 
                  onClick={handleIndexYouTube}
                  disabled={isIndexing || !youtubeUrl.trim()}
                >
                  {isIndexing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Indexing...
                    </>
                  ) : (
                    <>
                      <Youtube className="h-4 w-4 mr-2" />
                      Index Video
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isIndexing && (
              <div className="bg-secondary/20 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <div>
                    <p className="font-medium">Processing video...</p>
                    <p className="text-sm text-muted-foreground">
                      Extracting metadata and analyzing content with AI
                    </p>
                  </div>
                </div>
              </div>
            )}

            {indexedVideo && (
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-700 dark:text-green-400">
                      Video Indexed Successfully!
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={indexedVideo.thumbnail_url} 
                          alt={indexedVideo.title}
                          className="w-32 h-18 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold text-sm">{indexedVideo.title}</p>
                          <div className="flex gap-1 mt-1">
                            {indexedVideo.tags?.map((tag: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>Video ID: {indexedVideo.video_id}</p>
                        <p>Classification: {indexedVideo.classification}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">How it works</h3>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Paste a YouTube video URL in the field above</li>
              <li>Click "Index Video" to start the analysis</li>
              <li>Our AI will extract metadata and analyze the content</li>
              <li>The video will be added to your media library with auto-generated tags</li>
              <li>Access the indexed video from the Videos page</li>
            </ol>
          </Card>
        </div>
      </main>
    </div>
  );
}
