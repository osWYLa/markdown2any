import express from 'express';
import pinoHttp from 'pino-http';
import { validateRender } from './schema.js';
import { initBrowser, getBrowserStatus, closeBrowser } from './browser.js';
import { renderToBuffer } from './render.js';
import { enqueue, getQueueSize } from './queue.js';
import logger from './logger.js';
import { PORT } from './config.js';

const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(pinoHttp({ logger }));

const EXT = { png: 'png', jpeg: 'jpg', webp: 'webp' };
const MIME = { png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp' };

app.post('/api/render', async (req, res) => {
  const valid = validateRender(req.body);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid input', code: 'INVALID_INPUT', details: validateRender.errors });
  }

  try {
    const buffer = await enqueue(() => renderToBuffer(req.body));
    const format = req.body.format || req.body.config?.export_format || 'png';
    const ext = EXT[format] || 'png';
    res.set('Content-Type', MIME[format] || 'image/png');
    res.set('Content-Disposition', `attachment; filename="markdown-image-${Date.now()}.${ext}"`);
    res.send(buffer);
  } catch (err) {
    if (err.code === 'RENDER_TIMEOUT') {
      return res.status(408).json({ error: 'Render timed out', code: 'RENDER_TIMEOUT' });
    }
    logger.error({ err }, 'Render failed');
    res.status(500).json({ error: 'Internal error', code: 'INTERNAL' });
  }
});

app.get('/api/health', (_req, res) => {
  const { status, pagesServed, uptimeMs } = getBrowserStatus();
  res.json({ status: 'ok', browser: status, pagesServed, uptimeMs, queue: getQueueSize() });
});

app.get('/api/version', (_req, res) => {
  res.json({ app: '1.0.0' });
});

// Graceful shutdown
const server = app.listen(PORT, () => logger.info({ PORT }, 'Renderer listening'));

async function shutdown() {
  logger.info('Shutting down');
  server.close(async () => {
    await closeBrowser();
    process.exit(0);
  });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start browser
initBrowser().catch((err) => {
  logger.error({ err }, 'Failed to launch browser');
  process.exit(1);
});
