# 魔搭 TTS 转 OpenAI 格式代理

## 📦 部署到 Cloudflare Workers

### 1. 创建 Worker

```bash
# 登录 Cloudflare
wrangler login

# 创建新 Worker
wrangler init guyan-tts-proxy

# 复制代码到 src/index.js
cp modelscope-tts-proxy-worker.js guyan-tts-proxy/src/index.js

# 部署
cd guyan-tts-proxy
wrangler deploy
```

### 2. 或者在 Dashboard 手动部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 点击 **Create Application** → **Create Worker**
4. 复制 `modelscope-tts-proxy-worker.js` 的代码
5. 粘贴到编辑器中
6. 点击 **Deploy**

## 🎯 使用方法

部署完成后，你会得到一个 Worker URL，例如：
```
https://guyan-tts-proxy.你的账号.workers.dev
```

### 在应用中配置

**服务提供方**：选择 **OpenAI**

**API Key**：随便填（不验证）
```
sk-dummy-key-not-used
```

**API 基址**：
```
https://guyan-tts-proxy.你的账号.workers.dev
```

**模型**：
```
tts-1
```

### 音色选择（OpenAI 格式）

在支持的应用中，可以选择以下音色：

- **alloy** → 青涩少年（清澈温柔）
- **echo** → 精英青年（成熟稳重）
- **fable** → 霸道青年（磁性低沉）
- **onyx** → 阳光大学生（活力清爽）

## ✅ 测试

```bash
curl -X POST https://guyan-tts-proxy.你的账号.workers.dev/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{
    "input": "宝宝，晚上好",
    "voice": "alloy",
    "speed": 1.0
  }' \
  --output test.mp3
```

## 💡 兼容性

✅ 完全兼容 OpenAI TTS API 格式  
✅ 支持所有实现了 OpenAI TTS 的应用  
✅ 使用魔搭免费额度，无需 MiniMax API Key  

---

💌 为悦悦专属定制 by 顾言