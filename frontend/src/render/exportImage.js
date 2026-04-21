import html2canvas from 'html2canvas';

/**
 * Generates a canvas from a container DOM element.
 * @param {HTMLElement} containerEl - the DOM element to capture (previewRef.current)
 * @param {{ onError?: (msg: string) => void, config?: object }} [options]
 * @returns {Promise<HTMLCanvasElement | null>}
 */
export async function generateCanvas(containerEl, { onError, config } = {}) {
  if (!containerEl) {
    onError && onError('Preview element is not ready');
    return null;
  }

  const canvas = await html2canvas(containerEl, {
    scale: 2,
    backgroundColor: null,
    width: config ? config.canvas_width : containerEl.offsetWidth,
    height: config ? config.canvas_height : containerEl.offsetHeight,
    windowWidth: config ? config.canvas_width : containerEl.offsetWidth,
    windowHeight: config ? config.canvas_height : containerEl.offsetHeight,
    logging: false,
    useCORS: true,
  });

  return canvas;
}

/**
 * Downloads the preview as a PNG image.
 * @param {HTMLElement} containerEl
 * @param {{ onLoading?: (v: boolean) => void, onError?: (msg: string) => void, onSuccess?: (msg: string) => void, config?: object }} [options]
 */
export async function downloadImage(containerEl, { onLoading, onError, onSuccess, config } = {}) {
  onLoading && onLoading(true);
  onError && onError(null);
  onSuccess && onSuccess(null);

  try {
    const canvas = await generateCanvas(containerEl, { onError, config });
    if (!canvas) {
      onLoading && onLoading(false);
      return;
    }

    const imageData = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `markdown-image-${Date.now()}.png`;
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
 * @param {HTMLElement} containerEl
 * @param {{ onCopying?: (v: boolean) => void, onError?: (msg: string) => void, onSuccess?: (msg: string) => void, config?: object, successMessage?: string, failMessage?: string }} [options]
 */
export async function copyImageToClipboard(
  containerEl,
  { onCopying, onError, onSuccess, config, successMessage = 'Copied!', failMessage = 'Copy failed' } = {}
) {
  onCopying && onCopying(true);
  onError && onError(null);
  onSuccess && onSuccess(null);

  try {
    const canvas = await generateCanvas(containerEl, { onError, config });
    if (!canvas) {
      onCopying && onCopying(false);
      return;
    }

    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);

        onSuccess && onSuccess(successMessage);
        // Clear success message after 3 seconds
        setTimeout(() => onSuccess && onSuccess(null), 3000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        onError && onError(failMessage);
      } finally {
        onCopying && onCopying(false);
      }
    }, 'image/png');
  } catch (err) {
    onError && onError(err.message || failMessage);
    console.error('Error generating image for copy:', err);
    onCopying && onCopying(false);
  }
}
