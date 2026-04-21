import { chromium } from 'playwright';
import logger from './logger.js';
import { BROWSER_MAX_USES, BROWSER_MAX_AGE_MS, MAX_CONCURRENCY, FRONTEND_URL } from './config.js';

let browser = null;
let context = null;
let pagePool = [];
let pagesServed = 0;
let launchTime = 0;
let restarting = false;

async function launchBrowser() {
  logger.info('Launching browser');
  browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  });
  context = await browser.newContext();
  pagePool = await Promise.all(
    Array.from({ length: MAX_CONCURRENCY }, () => context.newPage())
  );
  pagesServed = 0;
  launchTime = Date.now();

  browser.on('disconnected', () => {
    if (!restarting) {
      logger.warn('Browser disconnected unexpectedly — restarting');
      restartBrowser();
    }
  });

  logger.info({ MAX_CONCURRENCY }, 'Browser ready');
}

async function restartBrowser() {
  if (restarting) return;
  restarting = true;
  try {
    await browser?.close().catch(() => {});
    await launchBrowser();
  } finally {
    restarting = false;
  }
}

export async function initBrowser() {
  await launchBrowser();
}

export async function acquirePage() {
  // Rotate browser when it's getting old or has served too many pages
  if (
    pagesServed >= BROWSER_MAX_USES ||
    Date.now() - launchTime >= BROWSER_MAX_AGE_MS
  ) {
    logger.info({ pagesServed }, 'Rotating browser');
    await restartBrowser();
  }

  while (pagePool.length === 0) {
    await new Promise((r) => setTimeout(r, 50));
  }
  return pagePool.pop();
}

export function releasePage(page) {
  pagesServed++;
  pagePool.push(page);
}

export function getBrowserStatus() {
  return {
    status: browser?.isConnected() ? 'connected' : 'disconnected',
    pagesServed,
    uptimeMs: launchTime ? Date.now() - launchTime : 0,
  };
}

export async function closeBrowser() {
  restarting = true;
  await browser?.close().catch(() => {});
}
