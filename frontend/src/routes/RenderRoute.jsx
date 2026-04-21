import { useEffect } from 'react';
import { DEFAULT_CONFIG } from '../render/defaultConfig.js';
import { getThemes } from '../render/themes.js';
import PreviewCanvas from '../render/PreviewCanvas.jsx';
import '../render/preview.css';

// Headless render endpoint for Playwright.
// Playwright navigates to /render, injects window.__RENDER_PAYLOAD__ via addInitScript,
// then waits for window.__renderReady === true before taking a screenshot.
export default function RenderRoute() {
  const raw = typeof window !== 'undefined' ? window.__RENDER_PAYLOAD__ : null;

  // Merge: DEFAULT_CONFIG ← theme.config ← payload.config (same order as UI)
  let config = { ...DEFAULT_CONFIG };
  if (raw?.theme) {
    // i18n not loaded in headless context — pass identity function for theme names
    const themes = getThemes((k) => k);
    const theme = themes[raw.theme];
    if (theme) {
      config = { ...config, is_gradient: false, ...theme.config };
    }
  }
  if (raw?.config) {
    config = { ...config, ...raw.config };
  }

  const markdown = raw?.markdown ?? '# Hello\n\nNo payload provided.';

  // Signal to Playwright that the component has mounted and fonts are ready
  useEffect(() => {
    document.fonts.ready.then(() => {
      window.__renderReady = true;
    });
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, background: 'transparent' }}>
      <PreviewCanvas
        id="render-root"
        markdown={markdown}
        config={config}
      />
    </div>
  );
}
