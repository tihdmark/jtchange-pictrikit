# Turso Setup Guide for Feedback System

本项目的反馈系统已从 Supabase 切换到 Turso（libSQL）。下面是最省心、一步一步的配置流程（适合 Vercel 部署 + 只存文字评论）。

## 1) 安装 Turso CLI（Windows）

Turso 官方要求 Windows 使用 WSL 来安装 CLI。安装好 WSL 后：

```bash
wsl
curl -sSfL https://get.tur.so/install.sh | bash
```

> 如果你已装 Turso CLI，跳过此步。

## 2) 登录 Turso

```bash
turso auth signup
# 如果已有账号可用 turso auth login
```

## 3) 创建数据库

```bash
turso db create pictrikit-feedback
```

## 4) 获取数据库 URL

```bash
turso db show --url pictrikit-feedback
```

## 5) 创建访问 Token

```bash
turso db tokens create pictrikit-feedback
```

## 6) 配置 Vercel 环境变量

在 Vercel 项目中添加：

- `TURSO_DATABASE_URL`：上一步拿到的 URL
- `TURSO_AUTH_TOKEN`：上一步创建的 Token
- `FEEDBACK_ADMIN_TOKEN`（可选）：用于管理回复/删除的管理员口令

## 7) 重新部署

保存环境变量后，触发一次重新部署即可。

---

## FAQ

### 数据库表需要手动创建吗？
不需要。`api/feedback.mjs` 会在第一次请求时自动创建表。

如需手动创建，可在 Turso shell 里运行：

```sql
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  username TEXT NOT NULL,
  reply TEXT,
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
```
