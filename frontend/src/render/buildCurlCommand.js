export function buildCurlCommand(markdown, config, selectedTheme, apiUrl = window.location.origin) {
  const { export_format, export_scale, export_quality, ...renderConfig } = config;

  const body = {
    markdown,
    theme: selectedTheme,
    format: export_format || 'png',
    scale: export_scale || 2,
    ...(export_format === 'jpeg' || export_format === 'webp'
      ? { quality: export_quality ?? 0.92 }
      : {}),
    config: renderConfig,
  };

  const json = JSON.stringify(body);
  const escaped = json.replace(/'/g, "'\\''");

  return (
    `curl -X POST '${apiUrl}/api/render' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '${escaped}' \\\n` +
    `  --output image.${export_format || 'png'}`
  );
}
