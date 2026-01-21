# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## 语言
- 本仓库偏好中文沟通（代码与注释按原有风格即可）。

## 项目概览（做什么）
- PictriKit 是一个以**静态 HTML + 原生 JS**为主的截图排版工具站点。
- 线上部署偏向 Vercel：根目录的 `vercel.json` 负责 clean URLs、重定向与缓存/安全 headers。
- 主要交互应用页面为 `app.html`，其 JS 入口为 `dist/app.js`（打包后的单文件）。
- 可选后端：`api/feedback.mjs` 是 Vercel Serverless Function，用 Supabase 存取 feedback。

## 常用命令（Windows / PowerShell）

### 1) 本地预览静态站点（根目录）
> 适合调试页面、SEO 文本、静态资源、以及 `dist/app.js` 的行为。

- 使用 Python（若已安装）：
  - `python -m http.server 8000`
  - 访问 `http://127.0.0.1:8000/`

- 或使用 Node 的静态服务器（仓库里已带 `node_modules/`，但不强依赖）：
  - `npx http-server -p 8000 -c-1`

### 2) 运行/修改“源码版”并执行单元测试（dev-files）
> `dev-files/` 是开发目录（源码、测试、工具依赖），生产用的是根目录的静态文件 + `dist/`。

- 安装依赖：
  - `cd dev-files; npm i`

- 运行测试：
  - `cd dev-files; npm test`

- watch 模式：
  - `cd dev-files; npm run test:watch`

- 运行单个测试文件：
  - `cd dev-files; npx vitest run src/__tests__/StateManager.test.js`

- 只跑某个用例（按名称过滤）：
  - `cd dev-files; npx vitest run -t "undo state changes"`

- 本地起开发静态服务器（dev-files 下的脚本）：
  - `cd dev-files; npm run serve`

### 3) Lint/格式化
- 仓库当前未发现 ESLint/Prettier 等 lint/format 配置（无对应 config 与 npm scripts）。
- 如需引入，请先确认希望约束的范围（仅 `dev-files/src` 还是包含根目录静态 HTML）。

## 关键目录与职责（大图景）

### 生产/站点（根目录）
- `*.html`：站点页面（工具页、FAQ、Privacy、Terms、Templates、Tutorials 等）。
- `dist/app.js`：截图排版工具的**打包产物**（`app.html` 使用）。
- `styles/`：站点/画布相关 CSS。
- `assets/`：静态资源（图片、图标、截图等）。
- `vercel.json`：
  - `cleanUrls: true` + `trailingSlash: false`
  - non-www → www 重定向、`/index.html` → `/` 等兼容重定向
  - 针对 `assets` 的长缓存、针对 `*.html` 的 must-revalidate

### 可选后端（Vercel Functions）
- `api/feedback.mjs`
  - `GET`：拉取未 deleted 的反馈列表（按 `created_at` 倒序）。
  - `POST`：新增反馈（content/username）。
  - `PUT` / `DELETE`：需要 `x-admin-token` 与 `FEEDBACK_ADMIN_TOKEN` 匹配。
- 环境变量示例见 `.env.example`（Supabase URL/Anon key + 可选 Admin token）。
- `lib/supabase.js` 提供 `createClient` 的轻量封装（注意生产函数里目前直接在 `api/feedback.mjs` 创建 client）。

### 开发源码与测试（dev-files/）
> 这里是“可读、可测、可维护”的模块化源码；`dist/app.js` 是其演进/打包结果。

- `dev-files/src/main.js`：应用入口（组装各系统并绑定 DOM 事件）。
- 核心架构是“事件总线 + 单一状态树 + 多个系统模块”的组合：
  - `dev-files/src/state/EventBus.js`：模块解耦通信。
  - `dev-files/src/state/StateManager.js`：单一状态源（layoutTree、properties、zoom…），支持订阅、undo/redo、导入导出。
  - `dev-files/src/layout/layoutTypes.js`：布局定义（线性/固定结构/带 frame 等），通过 `initialSlots/maxSlots/css/slotStyles` 描述。
  - `dev-files/src/layout/LayoutSystem.js`：根据 layout definition 创建 layoutTree、对线性布局追加 slot。
  - `dev-files/src/image/ImageHandler.js`：图片上传、拖拽、slot 赋值/移除（生产版在 `dist/app.js` 中可对应到同名职责）。
  - `dev-files/src/render/CanvasRenderer.js`：将 state 渲染为 DOM（生产版 `dist/app.js` 里包含大量渲染细节）。
  - `dev-files/src/export/ExportSystem.js`：导出/复制（源码版依赖 html2canvas；生产版对 Linear/Frame 做了 Canvas API 导出以保持原始分辨率）。
- 测试：
  - `dev-files/src/__tests__/StateManager.test.js`
  - `dev-files/src/__tests__/LayoutSystem.test.js`
  - Vitest 环境：`dev-files/vitest.config.js`（jsdom + globals）。

## 修改代码时的定位建议（帮助快速上手）
- UI/交互（按钮、面板、快捷操作）：
  - 先看 `app.html` 中的 DOM 结构与 data-* 绑定点；再对照 `dist/app.js` 的 `bind*` 逻辑。
- 新增/调整布局：
  - 优先改 `dev-files/src/layout/layoutTypes.js`（定义 slots/css/slotStyles），再确认 `dist/app.js` 里对应的 `LAYOUT_DEFINITIONS` 是否也需要同步（若生产不走构建流程，就需要手动同步）。
- 导出质量/分辨率问题：
  - 生产导出逻辑集中在 `dist/app.js` 的 ExportSystem（区分 Linear/Frame 的 Canvas 导出 vs 其他布局的 html2canvas）。
- 反馈 API 问题：
  - 检查 `api/feedback.mjs` 的请求方法与 header（`x-admin-token`）以及 `.env` 环境变量。

## 相关文档（只列对开发决策有用的）
- `README.md`：项目定位、目录结构说明。
- `dev-files/LAUNCH_CHECKLIST.md`：上线前验证清单（功能/SEO/性能/安全）。
- `SEO-MASTER-PLAN-2026.md`、`GSC-CHECK-REPORT.md`：SEO/GSC 的既有决策背景（URL 规范化、重定向、canonical/sitemap 对齐等）。
