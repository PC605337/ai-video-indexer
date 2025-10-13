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
    const { assetId } = await req.json();

    if (!assetId) {
      return new Response(
        JSON.stringify({ error: "Asset ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch asset details
    const { data: asset, error: fetchError } = await supabase
      .from("media_assets")
      .select("*")
      .eq("id", assetId)
      .single();

    if (fetchError || !asset) {
      throw new Error("Asset not found");
    }

    const videoUrl = asset.thumbnail_url || asset.file_url;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Analyze different aspects of the video
    const analysisTypes = [
      {
        type: "objects",
        prompt: "Identify and list all objects, vehicles, logos, and brands visible in this video thumbnail. Provide specific details about vehicle makes and models if present. Format as a JSON array of objects with 'name', 'confidence', and 'category' fields."
      },
      {
        type: "scenes",
        prompt: "Analyze the scenes and settings in this video. Classify the content type (interview, product showcase, event, commercial, etc.), describe the environment, lighting, and production quality. Format as JSON with 'contentType', 'environment', 'lighting', and 'productionQuality' fields."
      },
      {
        type: "keywords",
        prompt: "Extract key topics, themes, and keywords from this video. Focus on main subjects, activities, and concepts shown. Format as a JSON array of strings (keywords)."
      },
      {
        type: "summary",
        prompt: "Generate a comprehensive 2-3 sentence summary of this video describing what it shows, the context, and key highlights suitable for search and accessibility."
      }
    ];

    const results: Record<string, any> = {};

    // Run all analyses
    for (const analysis of analysisTypes) {
      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: "You are a video analysis AI. Always respond with valid JSON in the exact format requested.",
              },
              {
                role: "user",
                content: `${analysis.prompt}\n\nAnalyze this video thumbnail: ${videoUrl}`,
              },
            ],
            response_format: { type: "json_object" }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          
          if (analysis.type === "summary") {
            results[analysis.type] = content ? JSON.parse(content).summary || content : "";
          } else {
            results[analysis.type] = content ? JSON.parse(content) : {};
          }
        }
      } catch (error) {
        console.error(`Error analyzing ${analysis.type}:`, error);
        results[analysis.type] = analysis.type === "summary" ? "" : {};
      }
    }

    // Prepare metadata structure similar to Azure AI Video Indexer
    const aiMetadata = {
      topics: results.keywords || [],
      keywords: results.keywords || [],
      labels: results.objects?.map((obj: any) => ({
        name: obj.name,
        confidence: obj.confidence || 0.8,
        category: obj.category || "general"
      })) || [],
      brands: results.objects?.filter((obj: any) => obj.category === "brand")?.map((obj: any) => ({
        name: obj.name,
        confidence: obj.confidence || 0.8
      })) || [],
      scenes: results.scenes || {},
      analyzedAt: new Date().toISOString(),
      version: "1.0"
    };

    // Update the asset with AI metadata
    const { error: updateError } = await supabase
      .from("media_assets")
      .update({
        ai_summary: results.summary,
        ai_metadata: aiMetadata,
        updated_at: new Date().toISOString()
      })
      .eq("id", assetId);

    if (updateError) {
      throw updateError;
    }

    console.log("AI metadata generated successfully for asset:", assetId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "AI metadata generated successfully",
        summary: results.summary,
        metadata: aiMetadata
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-video-metadata:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Failed to generate video metadata"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
