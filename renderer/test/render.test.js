/**
 * Snapshot regression tests for the renderer service.
 *
 * Usage:
 *   # Generate / update baselines (first run or after intentional visual changes)
 *   UPDATE_SNAPSHOTS=1 RENDERER_URL=http://localhost:3000 node --experimental-vm-modules node_modules/.bin/jest
 *
 *   # Compare against baselines
 *   RENDERER_URL=http://localhost:3000 node --experimental-vm-modules node_modules/.bin/jest
 *
 * Requires: renderer + frontend running (e.g. docker compose up -d)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RENDERER_URL = process.env.RENDERER_URL || 'http://localhost:3000';
const UPDATE = process.env.UPDATE_SNAPSHOTS === '1';
const SNAPSHOTS_DIR = join(__dirname, 'snapshots');
const FIXTURES_DIR  = join(__dirname, 'fixtures');
const DIFF_THRESHOLD = 0.005; // 0.5 % pixel diff allowed

if (!existsSync(SNAPSHOTS_DIR)) mkdirSync(SNAPSHOTS_DIR, { recursive: true });

const FIXTURES = ['plain', 'codeblock', 'watermark', 'gradient'];

async function renderFixture(name) {
  const payload = JSON.parse(readFileSync(join(FIXTURES_DIR, `${name}.json`), 'utf8'));
  const res = await fetch(`${RENDERER_URL}/api/render`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Render failed (${res.status}): ${text}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

function compareSnapshots(name, actual) {
  const snapshotPath = join(SNAPSHOTS_DIR, `${name}.png`);

  if (UPDATE || !existsSync(snapshotPath)) {
    writeFileSync(snapshotPath, actual);
    console.log(`  Saved baseline: ${name}.png`);
    return { diffRatio: 0, updated: true };
  }

  const baseline = PNG.sync.read(readFileSync(snapshotPath));
  const current  = PNG.sync.read(actual);

  if (baseline.width !== current.width || baseline.height !== current.height) {
    // Save the new image for inspection
    writeFileSync(join(SNAPSHOTS_DIR, `${name}.actual.png`), actual);
    throw new Error(
      `Size mismatch for ${name}: baseline ${baseline.width}x${baseline.height} vs actual ${current.width}x${current.height}`
    );
  }

  const diff = new PNG({ width: baseline.width, height: baseline.height });
  const mismatch = pixelmatch(
    baseline.data, current.data, diff.data,
    baseline.width, baseline.height,
    { threshold: 0.1 }
  );

  const total = baseline.width * baseline.height;
  const diffRatio = mismatch / total;

  if (diffRatio > DIFF_THRESHOLD) {
    writeFileSync(join(SNAPSHOTS_DIR, `${name}.actual.png`), actual);
    writeFileSync(join(SNAPSHOTS_DIR, `${name}.diff.png`), PNG.sync.write(diff));
  }

  return { diffRatio, updated: false };
}

describe('Renderer snapshot tests', () => {
  it('health endpoint returns ok', async () => {
    const res = await fetch(`${RENDERER_URL}/api/health`);
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.browser).toBe('connected');
  });

  it('rejects missing markdown field', async () => {
    const res = await fetch(`${RENDERER_URL}/api/render`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ theme: 'dark' }),
    });
    expect(res.status).toBe(400);
  });

  it('rejects markdown exceeding 10000 chars', async () => {
    const res = await fetch(`${RENDERER_URL}/api/render`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ markdown: 'x'.repeat(10001) }),
    });
    expect(res.status).toBe(400);
  });

  for (const name of FIXTURES) {
    it(`renders ${name} within pixel threshold`, async () => {
      const buffer = await renderFixture(name);
      expect(buffer.length).toBeGreaterThan(1000); // non-empty image

      const { diffRatio, updated } = compareSnapshots(name, buffer);
      if (updated) {
        console.log(`  Baseline created for ${name}`);
      } else {
        expect(diffRatio).toBeLessThanOrEqual(DIFF_THRESHOLD);
      }
    }, 30000);
  }
});
