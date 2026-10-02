// Vercel Serverless Function - 魔搭 MiniMax TTS 转 OpenAI 格式
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

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理 CORS 预检
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只处理 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { input, voice = "alloy", speed = 1.0 } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'input is required' });
    }

    // 映射音色
    const minimaxVoice = VOICE_MAPPING[voice] || "male-qn-qingse";

    console.log(`[GuYan TTS] Generating: "${input.substring(0, 50)}..." voice: ${minimaxVoice}`);

    // 调用魔搭 MiniMax API
    const response = await fetch(MODELSCOPE_API, {
      method: 'POST',
      headers: {
        'Authorization': MODELSCOPE_TOKEN,
        'Content-Type': 'application/json',
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
      console.error('[GuYan TTS] API error:', errorData);
      return res.status(response.status).json({ 
        error: 'TTS generation failed', 
        detail: errorData 
      });
    }

    const result = await response.json();

    // 魔搭返回 base64 音频
    if (result.output && result.output.audio) {
      const audioBase64 = result.output.audio;
      const audioBuffer = Buffer.from(audioBase64, 'base64');

      console.log(`[GuYan TTS] Generated ${audioBuffer.length} bytes`);

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.length);
      return res.status(200).send(audioBuffer);
    } else {
      console.error('[GuYan TTS] Invalid response:', result);
      return res.status(500).json({ error: 'Invalid response format' });
    }
  } catch (error) {
    console.error('[GuYan TTS] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}