# Markdown 转图片生成器

> 📖 Language: **中文** | [English](README.en.md)

将 Markdown 文本转换为精美图片的在线工具。内置实时预览、8 个主题、丰富的样式配置；既能在浏览器内直接导出，也可通过 HTTP API 程序化生成图片。

## 功能特性

- **实时编辑预览** — 三栏布局（配置 / 编辑器 / 预览），面板宽度可拖拽调整
- **Markdown 工具栏** — 标题、粗体、斜体、下划线、删除线、引用、代码、代码块、链接、图片、表格、列表一键插入；保留浏览器原生撤销栈
- **Markdown 语法** — 标准语法 + GFM 扩展（表格、任务列表、删除线、自动链接）+ HTML 标签（`<u>` 等）+ 多语言代码高亮
- **8 个预设主题** — 简约明亮、深色优雅、温暖舒适、清新森系、深邃海洋、复古书卷、深夜静谧、浪漫樱花
- **5 个尺寸预设** — 微信朋友圈、微博竖图、Instagram 方图 / 竖图、小红书；也可手动输入宽高
- **颜色与渐变** — 背景色、文字色、强调色任意自定义；支持自定义渐变背景（起止色 + 角度）
- **间距控制** — 字号、行间距、段落间距、内边距
- **元信息** — 作者名、时间戳，位置可选顶部或底部
- **水印** — 自定义文字、颜色、透明度、字号、旋转角度、铺设间距；DOM 实现，html2canvas / Playwright 均可捕获
- **导出格式** — PNG / JPEG / WebP，1x / 2x / 3x 分辨率，JPEG/WebP 可调质量
- **自动高度** — 默认开启，内容超出画布时自动延伸
- **内容持久化** — 编辑内容保存至 `localStorage`，切换语言或刷新页面不丢失
- **国际化** — 中文（默认）/ English
- **HTTP API** — `POST /api/render` 接受 JSON，返回图片二进制，易于集成到脚本、工作流或上游服务
- **Copy cURL** — 一键把当前配置复制成 curl 命令，方便脚本化复现当前预览效果

## 快速开始

### 方式 A：仅前端（最快上手）

只需要 Node.js 18+ 和现代浏览器，即可使用"浏览器导出"模式（基于 html2canvas）：

```bash
cd frontend
npm install
npm run dev
# 浏览器打开 http://localhost:5173
```

### 方式 B：完整栈（含 API 服务）

需要 [Docker](https://docs.docker.com/get-docker/)。启动后会同时提供：SPA 前端 + Playwright 渲染服务。

```bash
docker compose up --build -d
# 浏览器打开 http://127.0.0.1:8080
```

默认只监听 `127.0.0.1:8080`，如需对外暴露请在 `docker-compose.yml` 中调整端口并在前面加带认证的反代（项目本身不内置认证）。

验证服务正常：

```bash
curl http://127.0.0.1:8080/api/health
# {"status":"ok","browser":"connected",...}
```

调用渲染 API：

```bash
curl -X POST http://127.0.0.1:8080/api/render \
  -H 'content-type: application/json' \
  -d '{"markdown":"# Hello\n\n**bold**","theme":"dark","format":"png","scale":2}' \
  --output out.png
```

完整 API 参考见 [docs/api.md](docs/api.md)。

## 项目结构

```
markdown-to-image-generator/
├── frontend/              # React 19 + Vite 7 前端
│   ├── src/
│   │   ├── render/        # 纯渲染层，浏览器与 Playwright 共享
│   │   ├── ui/            # 交互 UI（配置面板、编辑器、工具栏等）
│   │   ├── hooks/         # 持久化、面板拖拽、导出
│   │   ├── routes/        # RenderRoute（Playwright 无头入口）
│   │   └── i18n/          # zh / en 语言包
│   ├── Dockerfile         # 多阶段构建到 nginx:1.27-alpine
│   └── nginx.conf         # SPA fallback + /api 反代
├── renderer/              # Node.js 渲染服务
│   ├── src/               # Express + Playwright + p-queue
│   ├── test/              # Jest + pixelmatch 像素快照
│   └── Dockerfile         # FROM mcr.microsoft.com/playwright:v1.48.0-jammy
├── docs/api.md            # 渲染 API 完整文档
├── .github/workflows/     # GitHub Actions CI
└── docker-compose.yml     # 一键启动（127.0.0.1:8080）
```

## 架构

```
浏览器 ──:8080──▶  nginx（frontend 容器）
                      │
                      ├─ /          SPA（React UI）
                      ├─ /render    SPA（RenderRoute，Playwright 专用）
                      └─ /api/*  ─▶ renderer:3000（Express + Playwright）
```

- **浏览器导出**：html2canvas 在浏览器内直接捕获 DOM，无需服务器
- **API 导出**：Express 接到请求 → Playwright 访问 `/render` 页 → 注入参数 → 等待 `window.__renderReady` → 截图返回
- **`frontend/src/render/` 是共享契约**：同一套 React 组件既在用户浏览器渲染，也被 Playwright 无头捕获，保证两种导出结果一致

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

## 关键配置项

| 配置项 | 默认值 | 范围 |
|--------|--------|------|
| 画布宽度 | 1080px | 100–4096 |
| 画布高度 | 1920px | 100–8192 |
| 字号 | 16px | 12–32 |
| 内边距 | 40px | 20–80 |
| 行间距 | 1.6 | 1.2–2.5 |
| 段落间距 | 20px | 10–40 |
| 导出格式 | PNG | PNG / JPEG / WebP |
| 导出分辨率 | 2x | 1x / 2x / 3x |
| 自动高度 | 开启 | — |

完整配置字段（含水印、元信息、渐变等）见 [docs/api.md](docs/api.md)。

## 测试

像素快照测试需要完整栈在本机运行。首次生成基准：

```bash
docker compose up --build -d

cd renderer
npm install

# 首次生成基准图
UPDATE_SNAPSHOTS=1 RENDERER_URL=http://127.0.0.1:8080 npm test

# 提交基准
git add test/snapshots/*.png
git commit -m "test: add snapshot baselines"
```

后续回归：

```bash
RENDERER_URL=http://127.0.0.1:8080 npm test
```

像素差异 > 0.5% 时测试失败，并在 `renderer/test/snapshots/` 生成 `*.diff.png`。

## 部署

**静态部署**（仅浏览器导出，无 API）：

```bash
cd frontend
npm run build
# 将 dist/ 部署到 Vercel / Netlify / GitHub Pages / 任意静态主机
```

`frontend/nginx.conf` 同时包含 SPA fallback 和 `/api` 反代，复制到自建 nginx 也可。

**完整部署**（含 API）：

```bash
docker compose up --build -d
```

默认只监听 `127.0.0.1:8080`。如需公网访问：

1. 修改 `docker-compose.yml` 中的 `ports` 为 `0.0.0.0:8080:80`；
2. 在前面加带认证的反向代理（Caddy / Nginx / Traefik），`docker-compose.yml` 底部有 Caddy 模板可参考。

渲染服务可调的环境变量（`MAX_CONCURRENCY`、`REQUEST_TIMEOUT_MS` 等）见 [docs/api.md](docs/api.md)。

## 贡献

欢迎通过 Issue 反馈问题；需要改代码时请 fork → 新分支 → 提 PR。如果改动涉及视觉输出，请同时更新 `renderer/test/snapshots/` 的基准图。

## 许可证

MIT

---

📖 Language: **中文** | [English](README.en.md)
