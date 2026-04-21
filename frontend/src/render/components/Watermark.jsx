/**
 * Watermark overlay component.
 * Props: { config }
 * Uses SVG data-URL implementation (kept as-is from App.jsx).
 * No imports from ui/, hooks/, or i18n/.
 */
export default function Watermark({ config }) {
  if (!config.watermark_enable || !config.watermark_text) return null;

  return (
    <div
      className="watermark-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 10,
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="${config.watermark_gap}" height="${config.watermark_gap}">
            <text
              x="50%"
              y="50%"
              fill="${config.watermark_color}"
              font-size="${config.watermark_size}"
              font-family="sans-serif"
              text-anchor="middle"
              dominant-baseline="middle"
              opacity="${config.watermark_opacity}"
              transform="rotate(${config.watermark_angle}, ${config.watermark_gap/2}, ${config.watermark_gap/2})"
            >
              ${config.watermark_text}
            </text>
          </svg>
        `)}")`,
        backgroundRepeat: 'repeat'
      }}
    />
  );
}
