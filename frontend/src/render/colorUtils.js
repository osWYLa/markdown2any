// Color utility functions for the render layer.
// No imports from ui/, hooks/, or i18n/ modules.

/**
 * Converts a hex color string to an RGB object.
 * @param {string} hex - e.g. '#FFFFFF' or '#FFF'
 * @returns {{ r: number, g: number, b: number } | null}
 */
export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null;

  // Expand shorthand form (e.g. '#03F') to full form (e.g. '#0033FF')
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const full = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Computes the WCAG relative luminance of an sRGB colour.
 * @param {number} r - 0-255
 * @param {number} g - 0-255
 * @param {number} b - 0-255
 * @returns {number} luminance in [0, 1]
 */
export function relativeLuminance(r, g, b) {
  const toLinear = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Returns true if the background colour in a config is considered dark
 * (WCAG luminance < 0.35).
 * @param {object} config
 * @returns {boolean}
 */
export function isDarkBackground(config) {
  if (!config) return false;

  // Gradient — use the start colour as the representative value
  const colorHex = config.is_gradient ? config.gradient_start : config.background_color;
  const rgb = hexToRgb(colorHex);
  if (!rgb) return false;

  return relativeLuminance(rgb.r, rgb.g, rgb.b) < 0.35;
}
