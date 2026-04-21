import PQueue from 'p-queue';
import { MAX_CONCURRENCY, REQUEST_TIMEOUT_MS } from './config.js';

const queue = new PQueue({ concurrency: MAX_CONCURRENCY });

export function enqueue(fn) {
  return queue.add(() => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(Object.assign(new Error('Render timeout'), { code: 'RENDER_TIMEOUT' })), REQUEST_TIMEOUT_MS)
    );
    return Promise.race([fn(), timeout]);
  });
}

export function getQueueSize() {
  return queue.size + queue.pending;
}
