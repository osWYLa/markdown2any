// Validators for render input.
// No imports from ui/, hooks/, or i18n/ modules.

/**
 * Validates a render config object.
 * @param {object} config
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateConfig(config) {
  const errors = [];

  if (!config || typeof config !== 'object') {
    errors.push('Config must be an object');
    return { ok: false, errors };
  }

  if (typeof config.canvas_width !== 'number' || config.canvas_width <= 0) {
    errors.push('canvas_width must be a positive number');
  }

  if (typeof config.canvas_height !== 'number' || config.canvas_height <= 0) {
    errors.push('canvas_height must be a positive number');
  }

  if (typeof config.font_size !== 'number' || config.font_size <= 0) {
    errors.push('font_size must be a positive number');
  }

  if (typeof config.padding !== 'number' || config.padding < 0) {
    errors.push('padding must be a non-negative number');
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Validates markdown content.
 * @param {string} md
 * @param {number} [maxLen=10000]
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateMarkdown(md, maxLen = 10000) {
  const errors = [];

  if (!md || typeof md !== 'string' || !md.trim()) {
    errors.push('errorEmptyContent');
  } else if (md.length > maxLen) {
    errors.push('errorContentTooLong');
  }

  return { ok: errors.length === 0, errors };
}
