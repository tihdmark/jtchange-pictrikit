# PictriKit 2026 Product-Led SEO Master Plan

## 📊 当前问题诊断

### GSC 错误分析
- **22 页 "Page with redirect"**: URL 结构不一致（www vs non-www, trailing slash）
- **14 页 "Discovered - currently not indexed"**: 内容薄弱 + 内部链接不足
- **2 页 404 错误**: 死链接或已删除页面

---

## 🔧 Phase 1: 技术调试（立即执行）

### 1.1 URL 规范化策略

**最优方案**: 统一使用 `https://www.pictrikit.com/page.html`（保留 .html）

**原因**:
- 你的网站是静态 HTML，保留 .html 更自然
- 移除 .html 需要额外的 rewrite 规则，增加复杂性
- 当前 sitemap 和 canonical 已使用 .html 格式


### 1.2 Vercel 配置优化

当前配置已经正确，但需要确保：

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "pictrikit.com" }],
      "destination": "https://www.pictrikit.com/:path*",
      "permanent": true
    }
  ],
  "trailingSlash": false
}
```

**检查清单**:
- ✅ non-www → www 301 重定向
- ✅ trailingSlash: false（避免 /page.html/ 问题）
- ⚠️ 需要添加：index.html → / 重定向

### 1.3 需要添加的重定向规则

```json
{
  "redirects": [
    {
      "source": "/index.html",
      "destination": "/",
      "permanent": true
    },
    {
      "source": "/:path*.html/",
      "destination": "/:path*.html",
      "permanent": true
    }
  ]
}
```

### 1.4 Canonical URL 同步检查

**规则**: Sitemap URL = Canonical URL = 实际访问 URL

当前状态检查脚本：
```powershell
# 检查所有页面的 canonical 是否与 sitemap 一致
Get-ChildItem *.html | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match 'rel="canonical" href="([^"]+)"') {
        Write-Host "$($_.Name): $($matches[1])"
    }
}
```

---

## 📝 Phase 2: 内容工程（解决 Thin Content）

### 2.1 "Instructional Content" 模块设计

**核心原则**: 不干扰工具 UI，但为 Google 提供足够的文本信号

**最优方案**: 在工具页面底部添加 "How It Works" 折叠模块

```html
<!-- 工具页面底部添加 -->
<section class="seo-content" style="margin-top:3rem;padding:2rem;background:#f9fafb;border-radius:12px;">
  <h2>How to Compare Screenshots Side by Side</h2>
  
  <div class="steps">
    <h3>Step 1: Upload Your Screenshots</h3>
    <p>Drag and drop or click to upload 2-4 screenshots you want to compare.</p>
    
    <h3>Step 2: Choose Layout</h3>
    <p>Select from side-by-side, vertical stack, or grid comparison layouts.</p>
    
    <h3>Step 3: Export</h3>
    <p>Download your comparison image as PNG or JPG in high resolution.</p>
  </div>
  
  <div class="use-cases">
    <h3>Common Use Cases</h3>
    <ul>
      <li>UI/UX design reviews and feedback</li>
      <li>Before/after app updates</li>
      <li>Bug reports with visual evidence</li>
      <li>Portfolio presentations</li>
    </ul>
  </div>
</section>
```

### 2.2 每个工具页面的内容模板

| 页面 | H1 | 核心关键词 | Use Cases |
|------|-----|-----------|-----------|
| compare-screenshots | Compare Screenshots Side by Side | screenshot comparison, side by side | UI review, bug reports |
| combine-chat-screenshots | Combine Chat Screenshots | merge chat, stitch conversation | WhatsApp, iMessage |
| put-two-screenshots-together | Put Two Screenshots Together | combine two images | tutorials, comparisons |
| stack-screenshots-vertically | Stack Screenshots Vertically | vertical stack, long screenshot | scrolling content |
| before-after-screenshot | Before & After Screenshot | before after comparison | design changes |
| screenshot-grid-layout | Screenshot Grid Layout | grid layout, collage | galleries, portfolios |

### 2.3 FAQ Schema 增强

为每个工具页面添加 FAQ 结构化数据：

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I compare two screenshots side by side?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Upload your screenshots to PictriKit, select the Compare layout, and export your comparison image."
      }
    }
  ]
}
```

---

## 🔗 Phase 3: 内部链接图谱（Hub & Spoke）

### 3.1 链接架构设计

```
                    ┌─────────────────┐
                    │   Homepage      │
                    │   (Hub)         │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐        ┌────▼────┐        ┌────▼────┐
    │ Compare │        │ Combine │        │  Grid   │
    │ (Spoke) │        │ (Spoke) │        │ (Spoke) │
    └────┬────┘        └────┬────┘        └────┬────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Cross-links   │
                    │ between spokes  │
                    └─────────────────┘
```

### 3.2 首页链接密度要求

**目标**: 从首页到任何工具页面 ≤ 2 次点击

当前已实现：
- ✅ Popular Tools 区域（6个直接链接）
- ✅ Footer 工具链接

需要增强：
- 添加 "All Tools" 导航入口
- 在 Hero 区域添加快速入口

### 3.3 工具页面互链规则

每个工具页面必须包含：
1. **Try Other Tools** 模块（4个相关工具）
2. **Footer 工具链接**（6个热门工具）
3. **面包屑导航**（Home > Tools > Current Tool）

---

## 🤖 Phase 4: GEO 策略（AI 可读性优化）

### 4.1 为什么 GEO 重要

2026年，用户越来越多通过 AI 助手（ChatGPT、Perplexity、Google AI Overview）获取工具推荐。

**目标**: 当用户问 "How do I align screenshots?" 时，AI 推荐 PictriKit。

### 4.2 AI 可读性优化清单

#### A. 结构化数据增强

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PictriKit Screenshot Comparison Tool",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Compare screenshots side by side",
    "Create before/after comparisons",
    "Grid layout for multiple images",
    "No registration required",
    "Privacy-first: images stay on device"
  ],
  "screenshot": "https://www.pictrikit.com/assets/images/screenshot.png",
  "softwareHelp": {
    "@type": "CreativeWork",
    "url": "https://www.pictrikit.com/tutorials.html"
  }
}
```

#### B. 语义化 HTML 结构

```html
<article itemscope itemtype="https://schema.org/HowTo">
  <h1 itemprop="name">How to Compare Screenshots Side by Side</h1>
  <meta itemprop="totalTime" content="PT1M">
  
  <div itemprop="step" itemscope itemtype="https://schema.org/HowToStep">
    <h3 itemprop="name">Upload Screenshots</h3>
    <p itemprop="text">Drag and drop your images into the upload area.</p>
  </div>
</article>
```

#### C. 明确的功能声明

在每个工具页面的 meta description 中使用动作导向语言：

```html
<meta name="description" content="Compare screenshots side by side online. Free tool to create UI comparisons, before/after images, and visual diffs. No signup required.">
```

### 4.3 AI 引用优化

**关键**: AI 引擎偏好引用具有明确、权威声明的内容。

在每个工具页面添加 "What This Tool Does" 声明：

```html
<div class="tool-declaration" style="background:#e0f2fe;padding:1rem;border-radius:8px;margin:1rem 0;">
  <strong>PictriKit Compare Tool</strong> lets you place two or more screenshots 
  side by side to create professional comparison images. Perfect for UI reviews, 
  bug reports, and design presentations.
</div>
```

---

## 📋 执行路线图

### Week 1: 技术修复
- [ ] 更新 vercel.json 添加 index.html 重定向
- [ ] 验证所有 canonical URL 与 sitemap 一致
- [ ] 在 GSC 中请求重新索引

### Week 2: 内容增强
- [ ] 为每个工具页面添加 "How It Works" 模块
- [ ] 添加 FAQ Schema 到所有工具页面
- [ ] 更新 meta descriptions 为动作导向

### Week 3: 链接优化
- [ ] 添加面包屑导航到所有工具页面
- [ ] 增强首页的工具入口
- [ ] 验证内部链接图谱完整性

### Week 4: GEO 优化
- [ ] 升级 JSON-LD 为 SoftwareApplication + HowTo
- [ ] 添加 featureList 到结构化数据
- [ ] 添加 "Tool Declaration" 模块

---

## 🎯 成功指标

| 指标 | 当前 | 目标（30天） | 目标（90天） |
|------|------|-------------|-------------|
| 索引页面数 | ~6 | 15+ | 20 |
| 重定向错误 | 22 | 0 | 0 |
| 平均排名 | N/A | Top 50 | Top 20 |
| AI 引用率 | 0% | 5% | 15% |

---

## 🔧 立即执行的代码修改

### 1. 更新 vercel.json

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "pictrikit.com" }],
      "destination": "https://www.pictrikit.com/:path*",
      "permanent": true
    },
    {
      "source": "/index.html",
      "destination": "/",
      "permanent": true
    }
  ],
  "trailingSlash": false
}
```

### 2. 更新 sitemap.xml lastmod

将所有 lastmod 更新为当前日期，表示内容已更新。

### 3. 在 GSC 中操作

1. 提交更新后的 sitemap
2. 使用 URL 检查工具请求重新索引关键页面
3. 监控索引覆盖率报告

---

**文档版本**: 1.0  
**创建日期**: 2026年1月12日  
**下次审查**: 2026年2月12日
