import { useState, useRef } from 'react';
import { validateMarkdown } from '../render/validators.js';
import {
  downloadImage as exportDownloadImage,
  copyImageToClipboard as exportCopyImage,
} from '../render/exportImage.js';

export function useExportImage(markdownContent, config, t) {
  const previewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  return { previewRef, loading, copying, error, successMessage, downloadImage, copyImageToClipboard };
}
