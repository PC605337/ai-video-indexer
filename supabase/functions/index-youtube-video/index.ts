import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { youtubeUrl } = await req.json();

    if (!youtubeUrl) {
      return new Response(
        JSON.stringify({ error: "YouTube URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: "Invalid YouTube URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing YouTube video:", videoId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch video metadata from YouTube oEmbed API
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const metadataResponse = await fetch(oembedUrl);
    
    if (!metadataResponse.ok) {
      throw new Error("Failed to fetch video metadata from YouTube");
    }

    const metadata = await metadataResponse.json();
    console.log("YouTube metadata:", metadata);

    // Use Lovable AI to analyze and generate metadata
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const analysisPrompt = `Analyze this YouTube video and provide structured metadata:
    
Title: ${metadata.title}
Author: ${metadata.author_name}

Please provide:
1. A list of 5-8 relevant tags
2. Classification (one of: internal, external, marketing, confidential)
3. A brief summary (2-3 sentences)

Respond in JSON format with keys: tags (array), classification (string), summary (string)`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a video metadata analyzer. Always respond with valid JSON." },
          { role: "user", content: analysisPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const aiData = await aiResponse.json();
    const aiAnalysis = JSON.parse(aiData.choices[0].message.content);
    
    console.log("AI Analysis:", aiAnalysis);

    // Note: Actual video downloading from YouTube requires specialized tools
    // and may violate YouTube's ToS. For demo purposes, we'll store the embed URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    // Create asset data
    const assetData = {
      title: metadata.title,
      asset_type: "video",
      classification: aiAnalysis.classification || "internal",
      file_url: youtubeUrl,
      thumbnail_url: thumbnailUrl,
      proxy_url: embedUrl,
      width: metadata.width || 1920,
      height: metadata.height || 1080,
      video_id: `YT-${videoId}`,
      tags: aiAnalysis.tags || [],
      indexed_at: new Date().toISOString(),
      bounding_box_settings: {
        size: "medium",
        color: "#FF0000",
        bgTransparency: 0.5,
        speakers: [],
        audioEffects: []
      },
      nas_path: `NAS://MediaServer/YouTube/${videoId}/original.mp4`,
      s3_path: `S3://toyota-media/youtube/${videoId}/original.mp4`,
      proxy_path: `Proxy://Node01/YouTube/${videoId}/proxy.mp4`,
      final_path: `Final://YouTube/${videoId}/final.mp4`,
      version_lineage: []
    };

    // Insert into database
    const { data: insertedAsset, error: insertError } = await supabase
      .from("media_assets")
      .insert(assetData)
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw insertError;
    }

    console.log("Asset indexed successfully:", insertedAsset.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Video indexed successfully",
        asset: insertedAsset,
        note: "YouTube videos are embedded for playback. For full local storage, please upload video files directly."
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in index-youtube-video:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Failed to index YouTube video"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
