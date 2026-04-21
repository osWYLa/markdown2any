export const PORT = parseInt(process.env.PORT || '3000', 10);
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const MAX_CONCURRENCY = parseInt(process.env.MAX_CONCURRENCY || '2', 10);
export const BROWSER_MAX_USES = parseInt(process.env.BROWSER_MAX_USES || '500', 10);
export const BROWSER_MAX_AGE_MS = parseInt(process.env.BROWSER_MAX_AGE_MS || String(60 * 60 * 1000), 10);
export const REQUEST_TIMEOUT_MS = parseInt(process.env.REQUEST_TIMEOUT_MS || '30000', 10);
