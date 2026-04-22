import html2canvas from 'html2canvas';

const MIME = { png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp' };

/**
 * Generates a canvas from a container DOM element.
 * When config.auto_height is true, uses scrollHeight to avoid silent content crop (bug #6).
 */
export async function generateCanvas(containerEl, { onError, config } = {}) {
  if (!containerEl) {
    onError && onError('Preview element is not ready');
    return null;
  }

  const format = config?.export_format || 'png';
  const scale = config?.export_scale || 2;
  const width = config ? config.canvas_width : containerEl.offsetWidth;
  const naturalHeight = config ? config.canvas_height : containerEl.offsetHeight;

  // Temporarily clear min-height so scrollHeight reflects real content height.
  // html2canvas clones the DOM and reads inline styles, so the clone also gets
  // the cleared min-height — this prevents blank space at the bottom when
  // auto_height is true and content is shorter than canvas_height.
  const prevMinHeight = containerEl.style.minHeight;
  if (config?.auto_height) containerEl.style.minHeight = '0px';
  const contentHeight = containerEl.scrollHeight;
  const height = config?.auto_height ? contentHeight : naturalHeight;

  const canvas = await html2canvas(containerEl, {
    scale,
    backgroundColor: null,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    logging: false,
    // Bug #13: enable CORS + allowTaint so cross-origin images don't taint the canvas
    useCORS: true,
    allowTaint: true,
    imageTimeout: 8000,
  });

  // Restore min-height after html2canvas has cloned the DOM
  containerEl.style.minHeight = prevMinHeight;

  return canvas;
}

/**
 * Downloads the preview as an image (format from config.export_format).
 */
export async function downloadImage(containerEl, { onLoading, onError, onSuccess, config } = {}) {
  onLoading && onLoading(true);
  onError && onError(null);
  onSuccess && onSuccess(null);

  try {
    const canvas = await generateCanvas(containerEl, { onError, config });
    if (!canvas) { onLoading && onLoading(false); return; }

    const format = config?.export_format || 'png';
    const quality = config?.export_quality ?? 0.92;
    const mime = MIME[format] || 'image/png';
    const imageData = canvas.toDataURL(mime, quality);

    const link = document.createElement('a');
    link.href = imageData;
    link.download = `markdown-image-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    onError && onError(err.message || 'Unknown error');
    console.error('Error generating image:', err);
  } finally {
    onLoading && onLoading(false);
  }
}

/**
 * Copies the preview as a PNG image to the clipboard.
 * Bug #7: ClipboardItem is constructed synchronously (required by Safari) with a Promise value.
 */
export async function copyImageToClipboard(
  containerEl,
  { onCopying, onError, onSuccess, config, successMessage = 'Copied!', failMessage = 'Copy failed' } = {}
) {
  onCopying && onCopying(true);
  onError && onError(null);
  onSuccess && onSuccess(null);

  try {
    // Construct ClipboardItem synchronously — Safari rejects async construction
    const blobPromise = generateCanvas(containerEl, { config }).then(
      (canvas) => new Promise((resolve, reject) => {
        if (!canvas) { reject(new Error('canvas generation failed')); return; }
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/png');
      })
    );

    const item = new ClipboardItem({ 'image/png': blobPromise });
    await navigator.clipboard.write([item]);
    onSuccess && onSuccess(successMessage);
    setTimeout(() => onSuccess && onSuccess(null), 3000);
  } catch (err) {
    console.error('Error copying to clipboard:', err);
    onError && onError(failMessage);
  } finally {
    onCopying && onCopying(false);
  }
}
