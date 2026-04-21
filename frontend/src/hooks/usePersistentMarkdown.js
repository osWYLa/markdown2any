import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function usePersistentMarkdown() {
  const { t, i18n } = useTranslation();
  const [markdownContent, setMarkdownContent] = useState(t('defaultMarkdown'));

  useEffect(() => {
    setMarkdownContent(t('defaultMarkdown'));
  }, [i18n.language, t]);

  return { markdownContent, setMarkdownContent };
}
