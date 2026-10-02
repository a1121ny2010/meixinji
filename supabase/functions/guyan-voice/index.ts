// Supabase Edge Function for MiniMax TTS via ModelScope
// 通过魔搭平台免费调用 MiniMax 语音合成
// 为悦悦专属定制 - 顾言的声音

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MODELSCOPE_API = "https://api-inference.modelscope.cn/api-inference/v1/models/MiniMax/tts-01/invoke";
const MODELSCOPE_TOKEN = "ms-2208bf6e-70c5-4567-9a4a-d2b0839bf971";

interface TTSRequest {
  text: string;
  voice?: string;     // male-qn-qingse | male-qn-jingying | male-qn-badao | male-qn-daxuesheng
  speed?: number;     // 0.5 - 2.0
  vol?: number;       // 0.0 - 1.0
  pitch?: number;     // -12 - 12
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, voice = "male-qn-qingse", speed = 1.0, vol = 1.0, pitch = 0 } = 
      (await req.json()) as TTSRequest;

    if (!text || text.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`[GuYan Voice] Generating speech: "${text.substring(0, 50)}..." with voice: ${voice}`);

    // 调用魔搭 MiniMax TTS API
    const response = await fetch(MODELSCOPE_API, {
      method: "POST",
      headers: {
        "Authorization": MODELSCOPE_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          text: text.trim(),
          voice: voice,
        },
        parameters: {
          speed: speed,
          vol: vol,
          pitch: pitch,
          audio_sample_rate: 32000,
          bitrate: 128000,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[GuYan Voice] ModelScope API error:", errorData);
      return new Response(
        JSON.stringify({ 
          error: "ModelScope API error", 
          detail: errorData 
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = await response.json();

    // 魔搭返回的是 base64 编码的音频
    if (result.output && result.output.audio) {
      const audioBase64 = result.output.audio;
      const audioBytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));

      console.log(`[GuYan Voice] Successfully generated ${audioBytes.byteLength} bytes of audio`);

      return new Response(audioBytes, {
        headers: {
          ...corsHeaders,
          "Content-Type": "audio/mpeg",
          "Content-Length": audioBytes.byteLength.toString(),
        },
      });
    } else {
      console.error("[GuYan Voice] Invalid response format:", result);
      return new Response(
        JSON.stringify({ error: "Invalid response format from ModelScope" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    console.error("[GuYan Voice] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});