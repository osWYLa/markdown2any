# Markdown 转图片生成器

将 Markdown 文本转换为精美图片的在线工具，支持实时预览、多主题、自定义样式，以及通过 HTTP API 程序化生成图片。

## 功能

- **实时编辑预览** — 三栏布局（配置 / 编辑器 / 预览），面板宽度可拖拽调整
- **工具栏** — 标题、粗体、斜体、下划线、删除线、引用、代码、代码块、链接、图片、表格、列表一键插入；插入操作保留浏览器撤销栈
- **Markdown 语法** — 标准语法 + GFM 扩展（表格、任务列表、删除线、自动链接）+ HTML 标签（`<u>`）+ 多语言代码高亮
- **8 个预设主题** — 简约明亮、深色优雅、温暖舒适、清新森系、深邃海洋、复古书卷、深夜静谧、浪漫樱花
- **5 个尺寸预设** — 微信朋友圈、微博竖图、Instagram 方图 / 竖图、小红书；也可手动输入宽高
- **颜色与渐变** — 背景色、文字色、强调色均可自定义；支持自定义渐变背景（起止色 + 角度）
- **间距控制** — 字体大小、行间距、段落间距、内边距
- **元信息** — 作者名、时间戳，位置可选顶部或底部
- **水印** — 可自定义文字、颜色、透明度、字号、旋转角度、铺设间距，DOM 元素实现（html2canvas 可捕获）
- **导出格式** — PNG / JPEG / WebP，1x / 2x / 3x 分辨率，JPEG/WebP 可调质量
- **自动高度** — 默认开启，内容超出画布时自动延伸，不截断
- **内容持久化** — 编辑内容保存至 `localStorage`，切换语言或刷新页面不丢失
- **国际化** — 中文（默认）/ English
- **HTTP API** — `POST /api/render` 接受 JSON，返回图片二进制，可集成到脚本或服务

## 快速开始

### 仅浏览器模式

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:5173
```

### 完整模式（含 API 服务）

需要安装 [Docker](https://docs.docker.com/get-docker/)。

```bash
docker compose up --build -d
# 访问 http://127.0.0.1:8080
```

验证服务正常：

```bash
curl http://127.0.0.1:8080/api/health
# {"status":"ok","browser":"connected",...}
```

调用 API：

```bash
curl -X POST http://127.0.0.1:8080/api/render \
  -H 'content-type: application/json' \
  -d '{"markdown":"# Hello\n\n**bold**","theme":"dark","format":"png","scale":2}' \
  --output out.png
```

完整 API 文档见 [docs/api.md](docs/api.md)。

## 项目结构

```
markdown-to-image-generator/
├── frontend/                        # React 19 + Vite 7 前端
│   ├── src/
│   │   ├── main.jsx                 # 入口
│   │   ├── AppRouter.jsx            # 路由：/ → App，/render → RenderRoute
│   │   ├── App.jsx                  # 主界面组件（~100 行）
│   │   ├── render/                  # 纯渲染层，不依赖 UI / hooks / i18n
│   │   │   ├── PreviewCanvas.jsx    # 画布（React.forwardRef）
│   │   │   ├── defaultConfig.js     # 所有配置项的默认值
│   │   │   ├── themes.js            # 8 个主题定义
│   │   │   ├── presetSizes.js       # 5 个尺寸预设
│   │   │   ├── colorUtils.js        # WCAG 相对亮度 / 深色背景判断
│   │   │   ├── validators.js        # 内容长度校验
│   │   │   ├── exportImage.js       # html2canvas 封装（下载 / 复制）
│   │   │   ├── preview.css          # 画布内容样式
│   │   │   └── components/
│   │   │       ├── MarkdownRenderer.jsx  # react-markdown 渲染
│   │   │       ├── MetaInfo.jsx          # 作者 / 时间戳
│   │   │       └── Watermark.jsx         # DOM 平铺水印
│   │   ├── ui/                      # 交互 UI 组件（不被 render/ 依赖）
│   │   │   ├── ConfigPanel.jsx
│   │   │   ├── Editor.jsx           # 编辑器 + 字符计数
│   │   │   ├── Toolbar.jsx          # Markdown 工具栏
│   │   │   ├── insertText.js        # execCommand 插入，保留撤销栈
│   │   │   ├── ExportActions.jsx    # 下载 / 复制按钮
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   ├── Resizer.jsx          # 面板拖拽分隔条
│   │   │   ├── Toasts.jsx           # 错误 / 成功 / 溢出提示
│   │   │   ├── ThemeSelector.jsx
│   │   │   ├── PresetSizes.jsx
│   │   │   └── config-sections/
│   │   │       ├── CanvasSize.jsx
│   │   │       ├── Typography.jsx
│   │   │       ├── Color.jsx
│   │   │       ├── Meta.jsx
│   │   │       ├── Watermark.jsx
│   │   │       └── Export.jsx       # 格式 / 分辨率 / 质量 / 自动高度
│   │   ├── hooks/
│   │   │   ├── usePersistentMarkdown.js  # localStorage 持久化
│   │   │   ├── useResizablePanels.js     # pointer events 拖拽
│   │   │   └── useExportImage.js         # 导出状态 + 溢出检测
│   │   ├── routes/
│   │   │   └── RenderRoute.jsx      # Playwright 无头入口，置 window.__renderReady
│   │   └── i18n/
│   │       ├── index.js
│   │       └── locales/
│   │           ├── zh.json          # 中文（默认）
│   │           └── en.json          # English
│   ├── Dockerfile                   # 多阶段：node:22-alpine → nginx:1.27-alpine
│   └── nginx.conf                   # SPA fallback + /api 反代到 renderer
├── renderer/                        # Node.js 渲染服务
│   ├── src/
│   │   ├── server.js                # Express 路由，优雅关闭（SIGTERM）
│   │   ├── render.js                # Playwright 截图流水线
│   │   ├── browser.js               # 浏览器单例 + 页面池 + 自动重启
│   │   ├── queue.js                 # p-queue 并发限制 + 超时
│   │   ├── schema.js                # Ajv 参数校验
│   │   ├── config.js                # 环境变量读取
│   │   └── logger.js                # pino 日志
│   ├── test/
│   │   ├── fixtures/                # plain / codeblock / watermark / gradient
│   │   ├── snapshots/               # 基准截图（需手动生成后提交）
│   │   └── render.test.js           # Jest + pixelmatch 像素对比
│   └── Dockerfile                   # FROM mcr.microsoft.com/playwright:v1.48.0-jammy
├── docs/
│   └── api.md                       # API 接口文档
├── .github/workflows/ci.yml         # GitHub Actions：build + 快照测试
└── docker-compose.yml               # 一键启动（127.0.0.1:8080）
```

## 架构

```
浏览器 ──:8080──▶  nginx（frontend 容器）
                      │
                      ├─ /           SPA（React UI）
                      ├─ /render     SPA（RenderRoute，Playwright 专用）
                      └─ /api/*  ──▶ renderer:3000（Express + Playwright）
```

- **浏览器导出**：html2canvas 在浏览器内直接捕获 DOM，无需服务器
- **API 导出**：Express 接收请求 → Playwright 访问 `/render` → 注入参数 → 等待 `window.__renderReady` → 截图返回
- **`render/` 是共享契约**：同一套 React 组件既在用户浏览器中渲染，也被 Playwright 无头捕获，保证两种导出结果一致

## 技术栈

| 模块 | 技术 |
|------|------|
| 前端框架 | React 19 + Vite 7 |
| Markdown 解析 | react-markdown 10 + remark-gfm + rehype-raw |
| 代码高亮 | react-syntax-highlighter（Prism） |
| 浏览器截图 | html2canvas 1.4 |
| 国际化 | i18next + react-i18next |
| 渲染服务 | Express 4 + Playwright 1.48 |
| 并发队列 | p-queue |
| 参数校验 | Ajv 8 |
| 日志 | pino |
| 容器 | Docker + nginx 1.27 |

## 配置说明

| 配置项 | 默认值 | 范围 |
|--------|--------|------|
| 画布宽度 | 1080px | 100–4096 |
| 画布高度 | 1920px | 100–8192 |
| 字体大小 | 16px | 12–32 |
| 内边距 | 40px | 20–80 |
| 行间距 | 1.6 | 1.2–2.5 |
| 段落间距 | 20px | 10–40 |
| 导出格式 | PNG | PNG / JPEG / WebP |
| 导出分辨率 | 2x | 1x / 2x / 3x |
| 自动高度 | 开启 | — |

## 运行测试

快照测试需要完整栈运行后生成基准图，首次执行：

```bash
# 启动完整栈
docker compose up --build -d

# 安装测试依赖
cd renderer && npm install

# 生成基准截图
UPDATE_SNAPSHOTS=1 RENDERER_URL=http://127.0.0.1:8080 npm test

# 提交基准
git add test/snapshots/*.png
git commit -m "test: add snapshot baselines"
```

后续回归：

```bash
RENDERER_URL=http://127.0.0.1:8080 npm test
```

像素差异超过 0.5% 时测试失败，并在 `test/snapshots/` 生成 `*.diff.png`。

## 部署

**静态部署**（仅浏览器导出，无 API）：

```bash
cd frontend && npm run build
# 将 dist/ 部署到 Vercel / Netlify / GitHub Pages
```

**完整部署**（含 API）：

```bash
docker compose up --build -d
```

默认只监听 `127.0.0.1:8080`。如需公网访问，修改 `docker-compose.yml` 中的 `ports` 并在前面添加带认证的反向代理（项目本身不内置认证）。

## 许可证

MIT
