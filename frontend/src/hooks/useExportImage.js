import { useState, useRef, useEffect } from 'react';
import { validateMarkdown } from '../render/validators.js';
import {
  downloadImage as exportDownloadImage,
  copyImageToClipboard as exportCopyImage,
} from '../render/exportImage.js';
import { buildCurlCommand } from '../render/buildCurlCommand.js';

export function useExportImage(markdownContent, config, t, selectedTheme) {
  const previewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [curlCopying, setCurlCopying] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Bug #6: detect live content overflow so user can see it before export
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    setIsOverflowing(!config.auto_height && el.scrollHeight > config.canvas_height);
  });

  const downloadImage = async () => {
    const { ok, errors } = validateMarkdown(markdownContent, 10000);
    if (!ok) { setError(t(errors[0])); return; }
    await exportDownloadImage(previewRef.current, {
      onLoading: setLoading,
      onError: setError,
      onSuccess: setSuccessMessage,
      config,
    });
  };

  const copyImageToClipboard = async () => {
    const { ok, errors } = validateMarkdown(markdownContent, 10000);
    if (!ok) { setError(t(errors[0])); return; }
    await exportCopyImage(previewRef.current, {
      onCopying: setCopying,
      onError: setError,
      onSuccess: setSuccessMessage,
      config,
      successMessage: t('copySuccess'),
      failMessage: t('copyFailed'),
    });
  };

  const copyCurlCommand = async () => {
    const { ok, errors } = validateMarkdown(markdownContent, 10000);
    if (!ok) { setError(t(errors[0])); return; }
    setCurlCopying(true);
    try {
      const cmd = buildCurlCommand(markdownContent, config, selectedTheme);
      await navigator.clipboard.writeText(cmd);
      setSuccessMessage(t('curlCopySuccess'));
    } catch {
      setError(t('curlCopyFailed'));
    } finally {
      setCurlCopying(false);
    }
  };

  return { previewRef, loading, copying, curlCopying, error, successMessage, isOverflowing, downloadImage, copyImageToClipboard, copyCurlCommand };
}
