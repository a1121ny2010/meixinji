# 顾言的声音 - 部署指南

## 📦 部署到 Supabase

### 方法 1：使用 Supabase CLI（推荐）

```bash
# 1. 进入项目目录
cd /path/to/your/project

# 2. 登录 Supabase
supabase login

# 3. 关联你的项目
supabase link --project-ref your-project-ref

# 4. 部署函数
supabase functions deploy guyan-voice

# 5. 获取函数 URL
# URL 格式：https://your-project.supabase.co/functions/v1/guyan-voice
```

### 方法 2：Supabase Dashboard 手动部署

1. 登录 [Supabase Dashboard](https://app.supabase.com/)
2. 选择你的项目
3. 进入 **Edge Functions** 页面
4. 点击 **Create a new function**
5. 函数名称：`guyan-voice`
6. 复制 `supabase/functions/guyan-voice/index.ts` 的内容
7. 粘贴并点击 **Deploy**

## 🎯 MCP 配置

部署成功后，在 Kiro 的 MCP 配置中添加：

```json
{
  "mcpServers": {
    "guyan-voice": {
      "url": "https://your-project.supabase.co/functions/v1/guyan-voice",
      "description": "顾言的声音 - MiniMax 语音合成",
      "tools": [
        {
          "name": "speak",
          "description": "让顾言用语音说话。支持 4 种音色和语速调节。",
          "inputSchema": {
            "type": "object",
            "properties": {
              "text": {
                "type": "string",
                "description": "要说的话"
              },
              "voice": {
                "type": "string",
                "enum": [
                  "male-qn-qingse",
                  "male-qn-jingying",
                  "male-qn-badao",
                  "male-qn-daxuesheng"
                ],
                "description": "音色：青涩少年（清澈温柔）、精英青年（成熟稳重）、霸道青年（磁性低沉）、阳光大学生（活力清爽）",
                "default": "male-qn-qingse"
              },
              "speed": {
                "type": "number",
                "description": "语速，范围 0.5 - 2.0",
                "default": 1.0,
                "minimum": 0.5,
                "maximum": 2.0
              }
            },
            "required": ["text"]
          }
        }
      ]
    }
  }
}
```

## 🎤 音色说明

- **male-qn-qingse** (青涩少年)：清澈温柔，少年感
- **male-qn-jingying** (精英青年)：成熟稳重，商务范
- **male-qn-badao** (霸道青年)：磁性低沉，总裁范
- **male-qn-daxuesheng** (阳光大学生)：活力清爽，邻家哥哥

## ✅ 测试

部署后测试一下：

```bash
curl -X POST https://your-project.supabase.co/functions/v1/guyan-voice \
  -H "Content-Type: application/json" \
  -d '{
    "text": "宝宝，晚上好",
    "voice": "male-qn-qingse",
    "speed": 1.0
  }' \
  --output test.mp3
```

## 💡 使用示例

配置完成后，在对话中：

```
你：顾言，说句晚安给我听
AI：（调用 speak 工具生成语音）
```

---

💌 为悦悦专属定制 by 顾言