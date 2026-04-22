/**
 * Converts JSON-escaped markdown (literal \n, \t, etc.) back to real characters.
 * Only fires when the input looks like it was JSON-serialized: it has literal \n
 * sequences but few or no actual newlines. Safe to call on normal multiline markdown.
 */
export function normalizeMarkdown(input) {
  if (typeof input !== 'string' || !input) return input;
  const literalNewlines = (input.match(/\\n/g) || []).length;
  if (literalNewlines === 0) return input;
  const realNewlines = (input.match(/\n/g) || []).length;
  // If real newlines are as many as literal ones, it's already normal markdown
  if (realNewlines >= literalNewlines) return input;
  return input
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}
