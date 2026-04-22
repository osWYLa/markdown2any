import { acquirePage, releasePage } from './browser.js';
import { FRONTEND_URL } from './config.js';

const DEFAULT_CONFIG = {
  canvas_width: 1080, canvas_height: 1920,
  background_color: '#FFFFFF', is_gradient: false,
  gradient_start: '#667eea', gradient_end: '#764ba2', gradient_angle: 135,
  text_color: '#333333', accent_color: '#007AFF',
  font_family: 'PingFang SC, -apple-system, sans-serif',
  font_size: 16, padding: 40, line_height: 1.6, paragraph_spacing: 20,
  author: '', timestamp: '', meta_position: 'bottom',
  watermark_enable: false, watermark_text: '', watermark_opacity: 0.2,
  watermark_size: 16, watermark_angle: -30, watermark_color: '#888888',
  watermark_gap: 120, auto_height: true,
  export_format: 'png', export_scale: 2, export_quality: 0.92,
};

const THEMES = {
  light:   { background_color: '#FFFFFF', text_color: '#333333', accent_color: '#007AFF' },
  dark:    { background_color: '#1a1a1a', text_color: '#E5E5E5', accent_color: '#4A9EFF' },
  warm:    { background_color: '#FFF8F0', text_color: '#5D4E37', accent_color: '#D2691E' },
  forest:  { background_color: '#F0F7F0', text_color: '#2D4A2D', accent_color: '#3A7A3A' },
  ocean:   { background_color: '#F0F6FF', text_color: '#1A3A5C', accent_color: '#0066CC' },
  vintage: { background_color: '#F5F0E8', text_color: '#4A3728', accent_color: '#8B6914' },
  midnight: { background_color: '#0D1117', text_color: '#C9D1D9', accent_color: '#58A6FF' },
  sakura:  { background_color: '#FFF0F5', text_color: '#5C3344', accent_color: '#E75480' },
};

/**
 * Renders a markdown payload to an image buffer via Playwright.
 * @param {{ markdown, theme, config, format, scale, quality }} payload
 * @returns {Promise<Buffer>}
 */
export async function renderToBuffer(payload) {
  // Merge: DEFAULT_CONFIG ← theme ← payload.config ← top-level format/scale/quality
  let merged = { ...DEFAULT_CONFIG };
  if (payload.theme && THEMES[payload.theme]) {
    merged = { ...merged, is_gradient: false, ...THEMES[payload.theme] };
  }
  if (payload.config) {
    merged = { ...merged, ...payload.config };
  }
  if (payload.format) merged.export_format = payload.format;
  if (payload.scale)  merged.export_scale  = payload.scale;
  if (payload.quality) merged.export_quality = payload.quality;

  const format  = merged.export_format || 'png';
  const scale   = merged.export_scale  || 2;
  const quality = merged.export_quality ?? 0.92;
  const width   = merged.canvas_width;
  const height  = merged.canvas_height;

  const page = await acquirePage();
  try {
    await page.addInitScript((p) => { window.__RENDER_PAYLOAD__ = p; }, {
      markdown: payload.markdown,
      theme: payload.theme,
      config: merged,
    });

    await page.setViewportSize({ width, height });
    await page.goto(`${FRONTEND_URL}/render`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForFunction(() => window.__renderReady === true, { timeout: 10000 });
    await page.evaluate(() => document.fonts.ready);

    // auto_height: measure actual content height by temporarily clearing minHeight
    let captureHeight = height;
    if (merged.auto_height) {
      const contentHeight = await page.evaluate(() => {
        const el = document.getElementById('render-root');
        if (!el) return 0;
        const prev = el.style.minHeight;
        el.style.minHeight = '0px';
        const h = el.scrollHeight;
        el.style.minHeight = prev;
        return h;
      });
      captureHeight = Math.max(contentHeight, 1);
      await page.setViewportSize({ width, height: captureHeight });
    }

    // Clip to just the render-root element
    const box = await page.evaluate(() => {
      const el = document.getElementById('render-root');
      const r = el?.getBoundingClientRect();
      return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
    });

    const ctx = await page.context().newPage();
    await ctx.close(); // not used — placeholder; scale is set on context level

    const screenshotOptions = {
      type: format === 'png' ? 'png' : format === 'webp' ? 'webp' : 'jpeg',
      ...(format !== 'png' ? { quality: Math.round(quality * 100) } : {}),
      ...(box ? { clip: { ...box, width: box.width * scale, height: box.height * scale } } : {}),
    };

    // Use deviceScaleFactor via a fresh context for correct scale
    const scaledCtx = await page.context().browser().newContext({ deviceScaleFactor: scale });
    const scaledPage = await scaledCtx.newPage();
    try {
      await scaledPage.addInitScript((p) => { window.__RENDER_PAYLOAD__ = p; }, {
        markdown: payload.markdown,
        theme: payload.theme,
        config: merged,
      });
      await scaledPage.setViewportSize({ width, height: captureHeight });
      await scaledPage.goto(`${FRONTEND_URL}/render`, { waitUntil: 'networkidle', timeout: 15000 });
      await scaledPage.waitForFunction(() => window.__renderReady === true, { timeout: 10000 });
      await scaledPage.evaluate(() => document.fonts.ready);

      const clip = await scaledPage.evaluate(({ w, isAutoHeight }) => {
        const el = document.getElementById('render-root');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        let h = r.height;
        if (isAutoHeight) {
          const prev = el.style.minHeight;
          el.style.minHeight = '0px';
          h = el.scrollHeight;
          el.style.minHeight = prev;
        }
        return { x: r.x, y: r.y, width: w, height: h };
      }, { w: width, isAutoHeight: merged.auto_height });

      const buffer = await scaledPage.screenshot({
        type: screenshotOptions.type,
        ...(format !== 'png' ? { quality: screenshotOptions.quality } : {}),
        ...(clip ? { clip } : {}),
      });
      return buffer;
    } finally {
      await scaledPage.close();
      await scaledCtx.close();
    }
  } finally {
    // Clear init script state so page is reusable
    await page.evaluate(() => { delete window.__RENDER_PAYLOAD__; delete window.__renderReady; }).catch(() => {});
    releasePage(page);
  }
}
