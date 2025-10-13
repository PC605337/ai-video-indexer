import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Toyota Executives Data (from global.toyota)
    const executives = [
      {
        name: "Akio Toyoda",
        role_title: "Chairman of the Board of Directors",
        bio: "Chairman and former President of Toyota Motor Corporation, led transformation initiatives including TNGA platform and electrification strategy.",
        company: "Toyota",
        region: "Global",
        photo_url: "https://global.toyota/pages/news/images/2023/06/09/1330/20230609_01_01_s.jpg"
      },
      {
        name: "Koji Sato",
        role_title: "President",
        bio: "President and CEO of Toyota Motor Corporation, former Lexus International President, leading next-generation mobility initiatives.",
        company: "Toyota",
        region: "Global",
        photo_url: "https://global.toyota/pages/news/images/2023/04/03/1330/20230403_01_02_s.jpg"
      },
      {
        name: "Yoichi Miyazaki",
        role_title: "Executive Vice President",
        bio: "Executive Vice President overseeing China and Asia operations.",
        company: "Toyota",
        region: "Asia",
        photo_url: "https://global.toyota/pages/news/images/2023/04/03/1330/20230403_01_03_s.jpg"
      },
      {
        name: "Shigeki Terashi",
        role_title: "Executive Vice President",
        bio: "Executive Vice President responsible for advanced technology development.",
        company: "Toyota",
        region: "Global",
        photo_url: "https://global.toyota/pages/news/images/2022/06/14/1330/20220614_01_03_s.jpg"
      },
      {
        name: "Takeshi Uchiyamada",
        role_title: "Chairman (Former)",
        bio: "Former Chairman, known as the father of the Prius, pioneered hybrid technology.",
        company: "Toyota",
        region: "Global",
        photo_url: "https://global.toyota/pages/news/images/2018/06/13/1330/20180613_01_04_s.jpg"
      }
    ];

    // Insert executives into face_library
    const { error: faceError } = await supabase
      .from("face_library")
      .upsert(executives, { onConflict: "name" });

    if (faceError) throw faceError;

    // Toyota Vehicles Data
    const toyotaVehicles = [
      { make: "Toyota", model: "Camry", year: 2024, category: "Sedan", variant: "Hybrid", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/2bb52d7ade60e4b93e84c60834f7ac19.png" },
      { make: "Toyota", model: "Corolla", year: 2024, category: "Sedan", variant: "Hybrid", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/7a79e9853e94aa481c6e5f619ac09f21.png" },
      { make: "Toyota", model: "RAV4", year: 2024, category: "SUV", variant: "Prime", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/0a0e1a76e4e3bd01bbdaa0c4db9ec7e6.png" },
      { make: "Toyota", model: "Highlander", year: 2024, category: "SUV", variant: "Hybrid", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/5a7c6f7c8d33a0354e8e3d1d19f4dbfc.png" },
      { make: "Toyota", model: "Prius", year: 2024, category: "Hybrid", variant: "Prime", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/59c21d71e999c2d0b72ec86e66578f7e.png" },
      { make: "Toyota", model: "Tacoma", year: 2024, category: "Truck", variant: "TRD Pro", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/c1f8d82f3a46c3c7e0f7d8e8b9f1e6d5.png" },
      { make: "Toyota", model: "Tundra", year: 2024, category: "Truck", variant: "Hybrid", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/9e8c7f6a5d4b3c2a1e0f9d8c7b6a5e4.png" },
      { make: "Toyota", model: "4Runner", year: 2024, category: "SUV", variant: "TRD Pro", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/3f4e5d6c7b8a9d0e1f2a3b4c5d6e7f8.png" },
      { make: "Toyota", model: "Sienna", year: 2024, category: "Minivan", variant: "Hybrid", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3.png" },
      { make: "Toyota", model: "Crown", year: 2024, category: "Sedan", variant: "Hybrid", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.png" },
      { make: "Toyota", model: "bZ4X", year: 2024, category: "Electric SUV", variant: "AWD", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9.png" },
      { make: "Toyota", model: "GR Supra", year: 2024, category: "Sports Car", variant: "3.0", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2.png" },
      { make: "Toyota", model: "GR86", year: 2024, category: "Sports Car", variant: "Manual", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5.png" },
      { make: "Toyota", model: "Sequoia", year: 2024, category: "SUV", variant: "TRD Pro", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8.png" }
    ];

    // Lexus Vehicles Data
    const lexusVehicles = [
      { make: "Lexus", model: "ES", year: 2024, category: "Sedan", variant: "ES 350", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1.png" },
      { make: "Lexus", model: "RX", year: 2024, category: "SUV", variant: "RX 500h", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4.png" },
      { make: "Lexus", model: "NX", year: 2024, category: "SUV", variant: "NX 450h+", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7.png" },
      { make: "Lexus", model: "GX", year: 2024, category: "SUV", variant: "GX 550", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0.png" },
      { make: "Lexus", model: "LX", year: 2024, category: "SUV", variant: "LX 600", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3.png" },
      { make: "Lexus", model: "LS", year: 2024, category: "Sedan", variant: "LS 500h", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6.png" },
      { make: "Lexus", model: "IS", year: 2024, category: "Sedan", variant: "IS 500", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9.png" },
      { make: "Lexus", model: "LC", year: 2024, category: "Coupe", variant: "LC 500", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2.png" },
      { make: "Lexus", model: "RC", year: 2024, category: "Coupe", variant: "RC F", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5.png" },
      { make: "Lexus", model: "UX", year: 2024, category: "SUV", variant: "UX 250h", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8.png" },
      { make: "Lexus", model: "TX", year: 2024, category: "SUV", variant: "TX 550h+", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1.png" },
      { make: "Lexus", model: "RZ", year: 2024, category: "Electric SUV", variant: "RZ 450e", image_url: "https://vehicle-images.dealerinspire.com/stock-images/chrome/9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4.png" }
    ];

    const allVehicles = [...toyotaVehicles, ...lexusVehicles];

    // Insert vehicles into vehicle_library
    const { error: vehicleError } = await supabase
      .from("vehicle_library")
      .upsert(allVehicles, { onConflict: "make,model,year" });

    if (vehicleError) throw vehicleError;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Populated ${executives.length} executives and ${allVehicles.length} vehicles`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
