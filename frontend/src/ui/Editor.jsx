import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Toolbar from './Toolbar.jsx';

export default function Editor({ markdownContent, setMarkdownContent, middleWidth }) {
  const { t } = useTranslation();
  const editorRef = useRef(null);

  return (
    <div className="panel editor-panel" style={{ width: `${middleWidth}px`, flex: 'none' }}>
      <div className="editor-section">
        <div className="section-header">
          <h2>{t('editor')}</h2>
          <span className="char-count">{t('charCount', { count: markdownContent.length })}</span>
        </div>
        <Toolbar
          markdownContent={markdownContent}
          setMarkdownContent={setMarkdownContent}
          editorRef={editorRef}
        />
        <textarea
          ref={editorRef}
          className="markdown-editor"
          value={markdownContent}
          onChange={(e) => setMarkdownContent(e.target.value)}
          placeholder={t('editorPlaceholder')}
        />
      </div>
    </div>
  );
}
