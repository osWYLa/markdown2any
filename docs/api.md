# Renderer API

The renderer service exposes a small HTTP API on port `3000` (proxied through nginx at `/api/`).

## Base URL

| Environment | URL |
|-------------|-----|
| Docker Compose (local) | `http://127.0.0.1:8080/api` |
| Renderer direct | `http://localhost:3000/api` |

---

## POST /api/render

Convert Markdown to an image and return it as binary.

### Request body (JSON)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `markdown` | string (≤10000 chars) | ✅ | Markdown source |
| `theme` | string | — | Preset theme name: `light` `dark` `warm` `forest` `ocean` `vintage` `midnight` `sakura` |
| `config` | object | — | Partial `RenderConfig` — overrides theme defaults (see fields below) |
| `format` | `png` \| `jpeg` \| `webp` | — | Output format (default: `png`) |
| `scale` | `1` \| `2` \| `3` | — | Device pixel ratio (default: `2`) |
| `quality` | 0.01–1 | — | JPEG/WebP quality (default: `0.92`, ignored for PNG) |

#### RenderConfig fields

```json
{
  "canvas_width":      1080,
  "canvas_height":     1920,
  "background_color":  "#FFFFFF",
  "is_gradient":       false,
  "gradient_start":    "#667eea",
  "gradient_end":      "#764ba2",
  "gradient_angle":    135,
  "text_color":        "#333333",
  "accent_color":      "#007AFF",
  "font_family":       "PingFang SC, -apple-system, sans-serif",
  "font_size":         16,
  "padding":           40,
  "line_height":       1.6,
  "paragraph_spacing": 20,
  "author":            "",
  "timestamp":         "",
  "meta_position":     "bottom",
  "watermark_enable":  false,
  "watermark_text":    "",
  "watermark_opacity": 0.2,
  "watermark_size":    16,
  "watermark_angle":   -30,
  "watermark_color":   "#888888",
  "watermark_gap":     120,
  "auto_height":       true
}
```

### Response

- **200 OK** — binary image, `Content-Type: image/<format>`, `Content-Disposition: attachment; filename="markdown-image-<ts>.<ext>"`
- **400 Bad Request** — `{ "error": "Invalid input", "code": "INVALID_INPUT", "details": [...] }`
- **408 Request Timeout** — `{ "error": "Render timed out", "code": "RENDER_TIMEOUT" }`
- **500 Internal Server Error** — `{ "error": "Internal error", "code": "INTERNAL" }`

---

## GET /api/health

Returns service status.

```json
{
  "status": "ok",
  "browser": "connected",
  "pagesServed": 42,
  "uptimeMs": 3600000,
  "queue": 0
}
```

---

## GET /api/version

```json
{ "app": "1.0.0" }
```

---

## Examples

### Plain render (curl)

```bash
curl -X POST http://127.0.0.1:8080/api/render \
  -H 'content-type: application/json' \
  -d '{"markdown":"# Hello\n\n**bold** and *italic*","format":"png","scale":2}' \
  --output out.png
```

### Dark theme + JPEG

```bash
curl -X POST http://127.0.0.1:8080/api/render \
  -H 'content-type: application/json' \
  -d '{"markdown":"# Dark\n\nsome text","theme":"dark","format":"jpeg","quality":0.9}' \
  --output dark.jpg
```

### Custom config (OG image 1200×630)

```bash
curl -X POST http://127.0.0.1:8080/api/render \
  -H 'content-type: application/json' \
  -d '{
    "markdown": "# My Article Title\n\nA short description for social sharing.",
    "config": {
      "canvas_width": 1200,
      "canvas_height": 630,
      "is_gradient": true,
      "gradient_start": "#667eea",
      "gradient_end": "#764ba2",
      "text_color": "#ffffff",
      "accent_color": "#ffffff",
      "font_size": 24,
      "padding": 60
    },
    "format": "png",
    "scale": 2
  }' \
  --output og.png
```

### Watermark

```bash
curl -X POST http://127.0.0.1:8080/api/render \
  -H 'content-type: application/json' \
  -d '{
    "markdown": "# Confidential Report",
    "config": {
      "watermark_enable": true,
      "watermark_text": "DRAFT",
      "watermark_opacity": 0.12,
      "watermark_angle": -30
    }
  }' \
  --output report.png
```

### httpie equivalent

```bash
http POST http://127.0.0.1:8080/api/render \
  markdown='# Hello' theme=dark format=png scale:=2 \
  > out.png
```

---

## Environment variables (renderer service)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP port |
| `FRONTEND_URL` | `http://localhost:5173` | URL of the frontend `/render` page |
| `MAX_CONCURRENCY` | `2` | Parallel render jobs |
| `BROWSER_MAX_USES` | `500` | Restart browser after N renders |
| `BROWSER_MAX_AGE_MS` | `3600000` | Restart browser after 1 hour |
| `REQUEST_TIMEOUT_MS` | `30000` | Per-job timeout in ms |
| `LOG_LEVEL` | `info` | Pino log level |

---

## Adding a new theme

1. Add an entry to `frontend/src/render/themes.js` — give it a unique `id` and a `config` object.
2. Add the same `id` + flat config to the `THEMES` map in `renderer/src/render.js`.
3. Run `UPDATE_SNAPSHOTS=1 npm test` in `renderer/` to regenerate baselines.
