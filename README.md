# Markdown to Image Generator

将 Markdown 文本转换为精美图片的在线工具，支持浏览器直接导出和服务端 API 两种模式。

## 功能特性

- **Markdown 编辑** — 实时预览，工具栏支持常用语法快捷插入，编辑内容自动保存至本地
- **8 个预设主题** — 简约明亮、深色优雅、温暖舒适、森林气息、海洋之心、复古风格、午夜之魅、樱花物语
- **GFM 语法** — 表格、任务列表、删除线、代码高亮（多语言）
- **灵活配置** — 画布尺寸（5 个社交平台预设）、字体、颜色/渐变背景、间距
- **水印** — 可自定义内容、颜色、透明度、角度、密度
- **元信息** — 作者 / 时间戳，位置可选顶部或底部
- **导出选项** — PNG / JPEG / WebP，1x / 2x / 3x 分辨率，自动高度（防内容截断）
- **一键导出** — 浏览器端下载或复制到剪贴板（Safari 兼容）
- **HTTP API** — `POST /api/render` 接受 JSON，返回图片二进制，可集成到任意脚本或服务

## 快速开始

### 浏览器模式（仅前端）

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:5173
```

### 完整模式（前端 + 渲染 API）

需要安装 [Docker](https://docs.docker.com/get-docker/)。

```bash
docker compose up --build -d
# 访问 http://127.0.0.1:8080
```

健康检查：

```bash
curl http://127.0.0.1:8080/api/health
```

### API 快速调用

```bash
curl -X POST http://127.0.0.1:8080/api/render \
  -H 'content-type: application/json' \
  -d '{"markdown":"# Hello\n\n**bold**","theme":"dark","format":"png","scale":2}' \
  --output out.png
```

详细 API 文档见 [docs/api.md](docs/api.md)。

## 项目结构

```
markdown-to-image-generator/
├── frontend/                       # React + Vite 前端
│   ├── src/
│   │   ├── main.jsx                # 入口，挂载 AppRouter
│   │   ├── AppRouter.jsx           # 路由：/ → App，/render → RenderRoute
│   │   ├── App.jsx                 # 主界面（~100 行）
│   │   ├── render/                 # 纯渲染层（无 UI 依赖，被前端和 Playwright 共用）
│   │   │   ├── PreviewCanvas.jsx   # 画布组件（forwardRef）
│   │   │   ├── defaultConfig.js    # 配置默认值
│   │   │   ├── themes.js           # 8 个预设主题
│   │   │   ├── presetSizes.js      # 社交平台尺寸预设
│   │   │   ├── colorUtils.js       # WCAG 亮度计算
│   │   │   ├── validators.js       # 输入校验
│   │   │   ├── exportImage.js      # html2canvas 导出封装
│   │   │   ├── preview.css         # 画布样式
│   │   │   └── components/         # MarkdownRenderer, MetaInfo, Watermark
│   │   ├── ui/                     # 交互 UI 组件
│   │   │   ├── ConfigPanel.jsx
│   │   │   ├── Editor.jsx
│   │   │   ├── Toolbar.jsx
│   │   │   ├── ExportActions.jsx
│   │   │   ├── insertText.js       # execCommand 插入（保留撤销栈）
│   │   │   └── config-sections/    # CanvasSize, Typography, Color, Meta, Watermark, Export
│   │   ├── hooks/
│   │   │   ├── usePersistentMarkdown.js  # localStorage 持久化，不随语言切换重置
│   │   │   ├── useResizablePanels.js     # 面板拖拽（pointer events）
│   │   │   └── useExportImage.js         # 导出状态管理
│   │   ├── routes/
│   │   │   └── RenderRoute.jsx     # Playwright 无头渲染入口，设置 window.__renderReady
│   │   └── i18n/                   # 中英文翻译
│   ├── Dockerfile                  # 多阶段：node → nginx
│   └── nginx.conf                  # SPA fallback + /api 反代
├── renderer/                       # Node.js 渲染服务（Express + Playwright）
│   ├── src/
│   │   ├── server.js               # HTTP 路由，优雅关闭
│   │   ├── render.js               # Playwright 截图流水线
│   │   ├── browser.js              # 浏览器单例 + 页面池 + 自动重启
│   │   ├── queue.js                # p-queue 并发控制 + 超时
│   │   ├── schema.js               # Ajv 参数校验
│   │   ├── config.js               # 环境变量
│   │   └── logger.js               # pino 日志
│   ├── test/
│   │   ├── fixtures/               # 4 个测试用例（plain, codeblock, watermark, gradient）
│   │   ├── snapshots/              # 基准截图（首次运行 UPDATE_SNAPSHOTS=1 生成）
│   │   └── render.test.js          # Jest + pixelmatch 像素对比
│   └── Dockerfile
├── docs/
│   └── api.md                      # API 文档与示例
├── .github/workflows/ci.yml        # GitHub Actions：构建 + 快照测试
└── docker-compose.yml              # 一键启动
```

## 架构说明

```
Browser ──HTTP:8080──▶ nginx (frontend)
                           │  /           → SPA (React)
                           │  /render     → SPA (RenderRoute, Playwright 专用)
                           └  /api/*  ──▶ renderer:3000 (Express + Playwright)
```

- **前端** 负责浏览器内渲染（html2canvas）和界面交互
- **渲染服务** 驱动无头 Chromium，导航到 `/render`，注入参数，等待 `window.__renderReady`，截图返回
- **`render/` 目录**是两者的共享契约：同一套组件既在浏览器中渲染，也被 Playwright 捕获

## 技术栈

| 层 | 技术 |
|----|------|
| 前端框架 | React 19 + Vite 7 |
| Markdown 渲染 | react-markdown + remark-gfm + rehype-raw |
| 代码高亮 | react-syntax-highlighter (Prism) |
| 浏览器导出 | html2canvas |
| 国际化 | i18next + react-i18next |
| 渲染服务 | Express + Playwright |
| 请求队列 | p-queue |
| 参数校验 | Ajv |
| 日志 | pino |
| 容器 | Docker + nginx |

## 画布尺寸参考

| 平台 | 尺寸 | 比例 |
|------|------|------|
| 微信朋友圈 | 1080 × 1260 | 6:7 |
| 微博竖图 | 1080 × 1920 | 9:16 |
| Instagram 方图 | 1080 × 1080 | 1:1 |
| Instagram 竖图 | 1080 × 1350 | 4:5 |
| 小红书 | 1080 × 1440 | 3:4 |

## 环境变量（渲染服务）

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | 监听端口 |
| `FRONTEND_URL` | `http://localhost:5173` | 前端 /render 页面地址 |
| `MAX_CONCURRENCY` | `2` | 最大并发渲染数 |
| `BROWSER_MAX_USES` | `500` | 渲染 N 次后重启浏览器 |
| `BROWSER_MAX_AGE_MS` | `3600000` | 运行 1 小时后重启浏览器 |
| `REQUEST_TIMEOUT_MS` | `30000` | 单次渲染超时（ms） |

## 运行测试

```bash
# 启动完整栈
docker compose up --build -d

# 首次生成基准截图
cd renderer && npm install
UPDATE_SNAPSHOTS=1 RENDERER_URL=http://127.0.0.1:8080 npm test
git add test/snapshots/*.png && git commit -m "test: add snapshot baselines"

# 后续回归测试
RENDERER_URL=http://127.0.0.1:8080 npm test
```

## 部署

静态部署（仅浏览器导出，无 API）：

```bash
cd frontend && npm run build
# 将 dist/ 部署到 Vercel / Netlify / GitHub Pages
```

完整部署（含 API）：

```bash
docker compose up --build -d
# 默认只监听 127.0.0.1:8080
# 如需公网访问，修改 docker-compose.yml 中的 ports 并在前面加反代 + 认证
```

## 许可证

MIT
