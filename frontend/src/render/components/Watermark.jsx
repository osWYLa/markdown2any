import { useRef, useState, useLayoutEffect } from 'react';

// Real-DOM tiled watermark — captured reliably by html2canvas and Playwright.
// SVG background-image is silently dropped by html2canvas (bug #8).
// Rows are based on actual container height, not canvas_height, so auto_height works correctly.
export default function Watermark({ config }) {
  const containerRef = useRef(null);
  const [actualHeight, setActualHeight] = useState(config.canvas_height);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    setActualHeight(parent.scrollHeight);
    const observer = new ResizeObserver(() => setActualHeight(parent.scrollHeight));
    observer.observe(parent);
    return () => observer.disconnect();
  }, [config.watermark_enable, config.watermark_text]);

  if (!config.watermark_enable || !config.watermark_text) return null;

  const gap = config.watermark_gap || 120;
  const cols = Math.ceil(config.canvas_width / gap) + 2;
  const rows = Math.ceil(actualHeight / gap) + 2;

  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tiles.push(
        <span
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            left: `${c * gap}px`,
            top: `${r * gap}px`,
            fontSize: `${config.watermark_size}px`,
            color: config.watermark_color,
            opacity: config.watermark_opacity,
            transform: `rotate(${config.watermark_angle}deg)`,
            transformOrigin: 'center center',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {config.watermark_text}
        </span>
      );
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {tiles}
    </div>
  );
}
