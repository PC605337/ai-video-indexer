import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, features } = await req.json();
    
    if (!imageUrl) {
      throw new Error("Image URL is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const results: Record<string, any> = {};

    // Face detection and recognition
    if (features.includes("faces")) {
      const faceResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              content: "You are an expert at facial recognition and identification. Analyze faces in images and provide detailed information about each person detected including their position, estimated attributes, and any visible identifiers like badges or name tags.",
            },
            {
              role: "user",
              content: `Analyze this image and identify all faces. For each person detected, provide: position in image, estimated role/title if visible, company badges or identifiers, and any other relevant details. Image: ${imageUrl}`,
            },
          ],
        }),
      });

      if (faceResponse.ok) {
        const data = await faceResponse.json();
        results.faces = data.choices?.[0]?.message?.content || "";
      }
    }

    // Vehicle detection
    if (features.includes("vehicles")) {
      const vehicleResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              content: "You are an expert automotive analyst. Identify vehicle makes, models, years, variants, and any visible features or modifications. Be specific about Toyota/Lexus vehicles.",
            },
            {
              role: "user",
              content: `Identify all vehicles in this image. Provide make, model, year, variant, color, and any distinctive features. Image: ${imageUrl}`,
            },
          ],
        }),
      });

      if (vehicleResponse.ok) {
        const data = await vehicleResponse.json();
        results.vehicles = data.choices?.[0]?.message?.content || "";
      }
    }

    // Logo and brand detection
    if (features.includes("logos")) {
      const logoResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              content: "You are an expert at brand and logo recognition. Identify all visible logos, brand marks, company names, and corporate identifiers in images.",
            },
            {
              role: "user",
              content: `Identify all logos and brands visible in this image. List each logo/brand with its position and context. Image: ${imageUrl}`,
            },
          ],
        }),
      });

      if (logoResponse.ok) {
        const data = await logoResponse.json();
        results.logos = data.choices?.[0]?.message?.content || "";
      }
    }

    // Auto-tagging
    if (features.includes("tags")) {
      const tagResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              content: "Generate comprehensive tags for media assets. Include categories: location, objects, people, vehicles, colors, mood, time of day, season, event type, and any other relevant descriptors. Return tags as a comma-separated list.",
            },
            {
              role: "user",
              content: `Generate comprehensive tags for this image. Return as comma-separated list. Image: ${imageUrl}`,
            },
          ],
        }),
      });

      if (tagResponse.ok) {
        const data = await tagResponse.json();
        results.tags = data.choices?.[0]?.message?.content || "";
      }
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Vision analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
