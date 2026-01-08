# Vercel 部署检查清单

## ✅ 已完成的修复

### 1. Vercel 配置
- ✅ `vercel.json` 简化为空对象 `{}`，让 Vercel 自动检测
- ✅ `package.json` 移除 `engines` 字段，避免版本警告
- ✅ 保持 `type: "module"` 用于 ES Module 支持

### 2. API 增强
- ✅ 添加详细的 console.log 调试信息
- ✅ POST 返回包含 `stored` 和 `debug` 字段
- ✅ GET 返回包含错误信息（如果 KV 失败）
- ✅ 所有错误都有明确的日志输出

### 3. 测试工具
- ✅ 创建 `test-api.html` 用于快速测试 API 端点

## 🚀 部署步骤

### 1. 提交代码
```bash
git add .
git commit -m "fix: simplify vercel config and enhance API debugging"
git push
```

### 2. 在 Vercel 配置环境变量
访问 Vercel Dashboard → 你的项目 → Settings → Environment Variables

**必需配置：**
- `KV_REST_API_URL` - Vercel KV 的 REST API URL
- `KV_REST_API_TOKEN` - Vercel KV 的 REST API Token

**可选配置：**
- `FEEDBACK_ADMIN_TOKEN` - 管理员令牌（用于回复和删除反馈）

### 3. 创建 Vercel KV 数据库
1. 访问 Vercel Dashboard → Storage → Create Database
2. 选择 "KV" (Redis)
3. 命名为 `pictrikit-feedback`
4. 创建后，Vercel 会自动添加环境变量到你的项目

### 4. 重新部署
```bash
vercel --prod
```

或者在 Vercel Dashboard 点击 "Redeploy"

## 🧪 测试流程

### 方法 1: 使用测试页面
1. 访问 `https://your-domain.com/test-api.html`
2. 点击 "Test /api/debug" 检查环境配置
3. 点击 "Test POST /api/feedback" 提交测试反馈
4. 点击 "Test GET /api/feedback" 查看反馈列表

### 方法 2: 使用 feedback.html
1. 访问 `https://your-domain.com/feedback.html`
2. 在表单中输入测试消息
3. 点击 "Send Feedback"
4. 刷新页面，检查 "Community Feedback" 区域

### 方法 3: 查看 Vercel 日志
1. 访问 Vercel Dashboard → 你的项目 → Deployments
2. 点击最新部署 → Functions
3. 点击 `/api/feedback` 查看实时日志
4. 查找以下日志：
   - `POST /api/feedback - Body: {...}`
   - `✅ KV storage successful: fb_xxx`
   - `GET /api/feedback - KV configured: true`
   - `✅ KV read successful - Count: X`

## 🔍 故障排查

### 问题 1: ERR_CONNECTION_CLOSED
**原因：** Vercel 配置过于复杂，导致 API 路由无法识别
**解决：** 已修复 - `vercel.json` 简化为 `{}`

### 问题 2: 提交成功但看不到消息
**可能原因：**
1. KV 未配置 → 检查环境变量
2. KV 写入失败 → 查看 Vercel 日志中的 `❌ KV storage failed`
3. KV 读取失败 → 查看 Vercel 日志中的 `❌ KV read error`

**调试步骤：**
1. 访问 `/api/debug` 检查 KV 配置状态
2. 查看 POST 响应中的 `stored: true/false`
3. 查看 Vercel 函数日志

### 问题 3: 函数超时
**原因：** KV 连接慢或网络问题
**解决：** 代码已包含 try-catch，即使 KV 失败也会返回成功

## 📊 预期行为

### POST /api/feedback 成功响应
```json
{
  "success": true,
  "id": "fb_1234567890_abc123",
  "stored": true,
  "debug": {
    "kvConfigured": true,
    "timestamp": "2026-01-08T07:00:00.000Z"
  }
}
```

### GET /api/feedback 成功响应
```json
{
  "success": true,
  "feedback": [
    {
      "id": "fb_1234567890_abc123",
      "content": "Test message",
      "username": "TestUser123",
      "timestamp": "2026-01-08T07:00:00.000Z",
      "reply": null
    }
  ],
  "isAdmin": false
}
```

## 🎯 成功标准

- ✅ `/api/debug` 返回 `kvTest.status: "connected"`
- ✅ POST 返回 `stored: true`
- ✅ GET 返回非空的 `feedback` 数组
- ✅ `feedback.html` 页面显示提交的消息
- ✅ 刷新页面后消息仍然存在

## 📝 注意事项

1. **首次部署**需要手动创建 Vercel KV 数据库
2. **环境变量**在添加后需要重新部署才能生效
3. **本地测试**需要在 `.env` 文件中配置 KV 环境变量
4. **Rate Limiting** 限制每分钟 5 次提交（每个 IP）
