import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { youtubeUrl } = await req.json();
    
    if (!youtubeUrl) {
      throw new Error('YouTube URL is required');
    }

    console.log('Indexing YouTube video:', youtubeUrl);

    // Extract video ID from YouTube URL
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Use YouTube oEmbed API to get video metadata
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oembedResponse = await fetch(oembedUrl);
    const oembedData = await oembedResponse.json();

    console.log('YouTube metadata:', oembedData);

    // Get video details using Lovable AI for analysis
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a video metadata analyzer. Extract and suggest tags, classification level, and key insights from video titles and descriptions.'
          },
          {
            role: 'user',
            content: `Analyze this video and provide tags (max 5), classification (internal/confidential/code_red), and a brief summary:
Title: ${oembedData.title}
Author: ${oembedData.author_name}

Return as JSON with keys: tags (array), classification (string), summary (string)`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const aiData = await aiResponse.json();
    let analysis = { 
      tags: ['Video'], 
      classification: 'internal', 
      summary: oembedData.title 
    };

    try {
      analysis = JSON.parse(aiData.choices[0].message.content);
    } catch (e) {
      console.log('AI analysis parsing failed, using defaults');
    }

    // Create media asset record
    const assetData = {
      title: oembedData.title,
      asset_type: 'video',
      file_url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail_url: oembedData.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      width: oembedData.width || 1920,
      height: oembedData.height || 1080,
      classification: analysis.classification,
      tags: analysis.tags,
      video_id: `YT-${videoId}`,
      nas_path: `NAS://MediaServer/YouTube/${videoId}/original.mp4`,
      s3_path: `S3://toyota-media/youtube/${videoId}/original.mp4`,
      proxy_path: `Proxy://Node01/YouTube/${videoId}/proxy.mp4`,
      final_path: `Final://YouTube/${videoId}/final.mp4`,
      indexed_at: new Date().toISOString(),
    };

    console.log('Created asset data:', assetData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        asset: assetData,
        message: 'Video indexed successfully',
        aiAnalysis: analysis
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error indexing YouTube video:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\/]+)/,
    /youtube\.com\/embed\/([^&\?\/]+)/,
    /youtube\.com\/v\/([^&\?\/]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
