# 快速部署指南

## 🚀 一键部署

```bash
# 1. 提交所有更改
git add .
git commit -m "fix: resolve feedback API connection issues"
git push

# 2. 等待 Vercel 自动部署（如果已连接 GitHub）
# 或手动部署：
vercel --prod
```

## ✅ 部署后验证

### 1. 测试 API 连接
访问：`https://your-domain.com/test-api.html`

点击三个测试按钮，确保都返回成功。

### 2. 测试反馈功能
访问：`https://your-domain.com/feedback.html`

1. 输入测试消息
2. 点击 "Send Feedback"
3. 看到 "Thanks for your feedback!" 提示
4. 刷新页面
5. 确认消息显示在 "Community Feedback" 区域

### 3. 检查 Vercel 日志
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目
3. Deployments → 最新部署 → Functions → `/api/feedback`
4. 查看日志，确认看到：
   - `✅ KV storage successful`
   - `✅ KV read successful`

## 🔧 如果需要配置 KV

### 首次部署需要创建 KV 数据库

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目
3. 点击 "Storage" 标签
4. 点击 "Create Database"
5. 选择 "KV" (Redis)
6. 命名：`pictrikit-feedback`
7. 选择区域（建议选择离用户最近的）
8. 点击 "Create"
9. 创建后，Vercel 会自动添加环境变量：
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
10. 点击 "Redeploy" 使环境变量生效

## 📊 成功标准

- ✅ `/api/debug` 返回 `kv.status: "connected"`
- ✅ POST `/api/feedback` 返回 `stored: true`
- ✅ GET `/api/feedback` 返回非空数组
- ✅ `feedback.html` 显示提交的消息
- ✅ 刷新后消息仍然存在

## 🎯 完成！

如果所有测试都通过，你的 Feedback 功能已经完全正常工作了！

用户现在可以：
- ✅ 提交反馈
- ✅ 查看所有反馈
- ✅ 数据持久化存储
- ✅ 刷新后数据不丢失
