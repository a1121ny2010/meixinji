// Cloudflare Worker - 魔搭 MiniMax TTS 转 OpenAI TTS 格式
// 让魔搭的语音合成能在任何支持 OpenAI TTS 的应用中使用

const MODELSCOPE_API = "https://api-inference.modelscope.cn/api-inference/v1/models/MiniMax/tts-01/invoke";
const MODELSCOPE_TOKEN = "ms-2208bf6e-70c5-4567-9a4a-d2b0839bf971";

// 音色映射：OpenAI 风格名称 -> MiniMax voice_id
const VOICE_MAPPING = {
  "alloy": "male-qn-qingse",        // 青涩少年（清澈温柔）
  "echo": "male-qn-jingying",       // 精英青年（成熟稳重）
  "fable": "male-qn-badao",         // 霸道青年（磁性低沉）
  "onyx": "male-qn-daxuesheng",     // 阳光大学生（活力清爽）
  "nova": "male-qn-qingse",         // 默认：青涩少年
  "shimmer": "male-qn-qingse"       // 默认：青涩少年
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS 预检
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // 只处理 /v1/audio/speech 路径
    if (url.pathname !== "/v1/audio/speech") {
      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      // 解析 OpenAI TTS 格式的请求
      const body = await request.json();
      const { input, voice = "alloy", speed = 1.0 } = body;

      if (!input) {
        return new Response(JSON.stringify({ error: "input is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // 映射音色
      const minimaxVoice = VOICE_MAPPING[voice] || "male-qn-qingse";

      console.log(`[TTS Proxy] Generating speech: "${input.substring(0, 50)}..." with voice: ${minimaxVoice}`);

      // 调用魔搭 MiniMax API
      const response = await fetch(MODELSCOPE_API, {
        method: "POST",
        headers: {
          "Authorization": MODELSCOPE_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            text: input,
            voice: minimaxVoice,
          },
          parameters: {
            speed: speed,
            vol: 1.0,
            pitch: 0,
            audio_sample_rate: 32000,
            bitrate: 128000,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[TTS Proxy] ModelScope API error:", errorData);
        return new Response(JSON.stringify({ 
          error: "TTS generation failed", 
          detail: errorData 
        }), {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      const result = await response.json();

      // 魔搭返回 base64 音频，转换为二进制
      if (result.output && result.output.audio) {
        const audioBase64 = result.output.audio;
        const audioData = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));

        console.log(`[TTS Proxy] Successfully generated ${audioData.byteLength} bytes of audio`);

        // 返回标准音频流（兼容 OpenAI TTS 格式）
        return new Response(audioData, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": audioData.byteLength.toString(),
            "Access-Control-Allow-Origin": "*",
          },
        });
      } else {
        console.error("[TTS Proxy] Invalid response format:", result);
        return new Response(JSON.stringify({ 
          error: "Invalid response format" 
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    } catch (error) {
      console.error("[TTS Proxy] Error:", error);
      return new Response(JSON.stringify({ 
        error: error.message 
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};