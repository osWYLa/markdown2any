# Markdown to Image Generator

> 📖 Language: [中文](README.md) | **English**

Turn Markdown into beautiful images. Live preview, 8 built-in themes, rich styling controls — and everything the UI can render is also available as a programmable HTTP API.

## Features

- **Live 3-pane editor** — config / editor / preview, drag to resize panes
- **Markdown toolbar** — one-click insert for headings, bold, italic, underline, strikethrough, blockquote, inline code, code block, link, image, table, list — all preserve the browser's native undo stack
- **Markdown syntax** — standard + GFM (tables, task lists, strikethrough, autolinks) + HTML tags (e.g. `<u>`) + multi-language syntax highlighting
- **8 preset themes** — light, dark, warm, forest, ocean, vintage, midnight, sakura
- **5 preset sizes** — WeChat Moments, Weibo, Instagram square / portrait, Xiaohongshu — plus free-form width/height
- **Colors & gradients** — fully customizable background / text / accent colors; optional gradient background (start/end color + angle)
- **Spacing controls** — font size, line-height, paragraph spacing, padding
- **Meta info** — author name + timestamp, positioned top or bottom
- **Watermark** — custom text, color, opacity, size, rotation, tile gap; rendered as DOM so both html2canvas and Playwright can capture it
- **Export formats** — PNG / JPEG / WebP at 1x / 2x / 3x, with quality control for JPEG/WebP
- **Auto height** — enabled by default; canvas grows to fit content instead of clipping
- **Persistence** — editor content is saved to `localStorage`, survives language switch and reloads
- **i18n** — Chinese (default) / English
- **HTTP API** — `POST /api/render` accepts JSON, returns image bytes — easy to embed in scripts or upstream services
- **Copy cURL** — one-click copy of the current config as a curl command, so the current preview is trivially reproducible

## Quick start

### Option A: Frontend only (fastest)

You need Node.js 18+ and a modern browser. This gets you the in-browser export (html2canvas) mode:

```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

### Option B: Full stack (with rendering API)

Requires [Docker](https://docs.docker.com/get-docker/). Starts both the SPA frontend and the Playwright renderer service.

```bash
docker compose up --build -d
# open http://127.0.0.1:8080
```

By default the stack is only bound to `127.0.0.1:8080`. To expose it publicly, change the `ports` in `docker-compose.yml` and put an authenticating reverse proxy in front (the app itself ships no auth).

Health check:

```bash
curl http://127.0.0.1:8080/api/health
# {"status":"ok","browser":"connected",...}
```

Render via API:

```bash
curl -X POST http://127.0.0.1:8080/api/render \
  -H 'content-type: application/json' \
  -d '{"markdown":"# Hello\n\n**bold**","theme":"dark","format":"png","scale":2}' \
  --output out.png
```

Full API reference: [docs/api.md](docs/api.md).

## Project layout

```
markdown-to-image-generator/
├── frontend/              # React 19 + Vite 7 SPA
│   ├── src/
│   │   ├── render/        # Pure render layer, shared by browser & Playwright
│   │   ├── ui/            # Interactive UI (config panel, editor, toolbar, ...)
│   │   ├── hooks/         # Persistence, panel resize, export state
│   │   ├── routes/        # RenderRoute — Playwright headless entry
│   │   └── i18n/          # zh / en locales
│   ├── Dockerfile         # Multi-stage build, serves via nginx:1.27-alpine
│   └── nginx.conf         # SPA fallback + /api reverse-proxy
├── renderer/              # Node.js rendering service
│   ├── src/               # Express + Playwright + p-queue
│   ├── test/              # Jest + pixelmatch pixel-diff snapshots
│   └── Dockerfile         # FROM mcr.microsoft.com/playwright:v1.48.0-jammy
├── docs/api.md            # Full rendering API reference
├── .github/workflows/     # GitHub Actions CI
└── docker-compose.yml     # One-click stack (127.0.0.1:8080)
```

## Architecture

```
browser ──:8080──▶  nginx (frontend container)
                       │
                       ├─ /          SPA (React UI)
                       ├─ /render    SPA (RenderRoute, used by Playwright)
                       └─ /api/*  ─▶ renderer:3000 (Express + Playwright)
```

- **Browser export**: html2canvas captures DOM directly — no server round-trip
- **API export**: Express receives request → Playwright opens `/render` → inject params → wait for `window.__renderReady` → screenshot
- **`frontend/src/render/` is the shared contract**: the same React components render in the user's browser and under headless Playwright, so both export paths look identical

## Tech stack

| Area | Tech |
|------|------|
| Frontend | React 19 + Vite 7 |
| Markdown parsing | react-markdown 10 + remark-gfm + rehype-raw |
| Code highlighting | react-syntax-highlighter (Prism) |
| In-browser capture | html2canvas 1.4 |
| i18n | i18next + react-i18next |
| Rendering service | Express 4 + Playwright 1.48 |
| Concurrency | p-queue |
| Request validation | Ajv 8 |
| Logging | pino |
| Container | Docker + nginx 1.27 |

## Key config options

| Option | Default | Range |
|--------|---------|-------|
| Canvas width | 1080px | 100–4096 |
| Canvas height | 1920px | 100–8192 |
| Font size | 16px | 12–32 |
| Padding | 40px | 20–80 |
| Line height | 1.6 | 1.2–2.5 |
| Paragraph spacing | 20px | 10–40 |
| Export format | PNG | PNG / JPEG / WebP |
| Export scale | 2x | 1x / 2x / 3x |
| Auto height | on | — |

Full field list (watermark, meta, gradient, etc.) in [docs/api.md](docs/api.md).

## Tests

Pixel-diff snapshot tests require the full stack running locally. First-time baseline:

```bash
docker compose up --build -d

cd renderer
npm install

# Generate baselines on first run
UPDATE_SNAPSHOTS=1 RENDERER_URL=http://127.0.0.1:8080 npm test

# Commit baselines
git add test/snapshots/*.png
git commit -m "test: add snapshot baselines"
```

Regression runs:

```bash
RENDERER_URL=http://127.0.0.1:8080 npm test
```

Tests fail when pixel diff exceeds 0.5%, with a `*.diff.png` written to `renderer/test/snapshots/`.

## Deployment

**Static deploy** (browser export only, no API):

```bash
cd frontend
npm run build
# Deploy dist/ to Vercel / Netlify / GitHub Pages / any static host
```

`frontend/nginx.conf` contains both the SPA fallback and the `/api` proxy pass — drop it into your own nginx if self-hosting.

**Full deploy** (with API):

```bash
docker compose up --build -d
```

Default bind is `127.0.0.1:8080`. To expose it publicly:

1. Change the `ports` in `docker-compose.yml` to `0.0.0.0:8080:80`.
2. Put an authenticating reverse proxy in front (Caddy / Nginx / Traefik). `docker-compose.yml` has a commented Caddy template.

Renderer tunables (`MAX_CONCURRENCY`, `REQUEST_TIMEOUT_MS`, ...) are documented in [docs/api.md](docs/api.md).

## Contributing

Open an issue for bugs or feature requests; for code changes, fork → topic branch → PR. If your change affects visual output, also update the baseline images in `renderer/test/snapshots/`.

## License

MIT

---

📖 Language: [中文](README.md) | **English**
