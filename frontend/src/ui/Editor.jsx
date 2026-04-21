import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Toolbar from './Toolbar.jsx';

const MAX_CHARS = 10000;

export default function Editor({ markdownContent, setMarkdownContent, middleWidth, onResetToSample }) {
  const { t } = useTranslation();
  const editorRef = useRef(null);

  const charCount = markdownContent.length;
  const ratio = charCount / MAX_CHARS;
  const counterStyle = ratio >= 1
    ? { color: '#dc3545', fontWeight: '600' }
    : ratio >= 0.8
      ? { color: '#fd7e14', fontWeight: '500' }
      : {};

  return (
    <div className="panel editor-panel" style={{ width: `${middleWidth}px`, flex: 'none' }}>
      <div className="editor-section">
        <div className="section-header">
          <h2>{t('editor')}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="char-count" style={counterStyle}>
              {t('charCount', { count: charCount })} / {MAX_CHARS}
            </span>
            {onResetToSample && (
              <button
                className="btn btn-secondary"
                style={{ padding: '2px 8px', fontSize: '12px' }}
                onClick={onResetToSample}
              >
                {t('resetToSample', 'Reset sample')}
              </button>
            )}
          </div>
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
