import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'md2img-content';

export function usePersistentMarkdown() {
  const { t } = useTranslation();

  // Initialize once: from localStorage if present, else seed with default sample
  const [markdownContent, setMarkdownContent] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? saved : t('defaultMarkdown');
  });

  // Persist every change to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, markdownContent);
  }, [markdownContent]);

  // Explicit reset button — uses current locale's sample
  const resetToSample = useCallback(() => {
    const sample = t('defaultMarkdown');
    setMarkdownContent(sample);
    localStorage.setItem(STORAGE_KEY, sample);
  }, [t]);

  return { markdownContent, setMarkdownContent, resetToSample };
}
