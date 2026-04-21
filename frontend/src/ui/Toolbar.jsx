import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { handleEditorAction } from './insertText.js';

export default function Toolbar({ markdownContent, setMarkdownContent, editorRef }) {
  const { t } = useTranslation();

  const action = (type) => handleEditorAction(type, markdownContent, setMarkdownContent, editorRef, t);

  return (
    <div className="markdown-toolbar">
      <button onClick={() => action('h1')} title={t('toolbar.h1')}>H1</button>
      <button onClick={() => action('h2')} title={t('toolbar.h2')}>H2</button>
      <button onClick={() => action('h3')} title={t('toolbar.h3')}>H3</button>
      <div className="toolbar-divider"></div>
      <button onClick={() => action('bold')} title={t('toolbar.bold')}><strong>B</strong></button>
      <button onClick={() => action('italic')} title={t('toolbar.italic')}><em>I</em></button>
      <button onClick={() => action('underline')} title={t('toolbar.underline')} style={{ textDecoration: 'underline' }}>U</button>
      <button onClick={() => action('strikethrough')} title={t('toolbar.strikethrough')} style={{ textDecoration: 'line-through' }}>S</button>
      <div className="toolbar-divider"></div>
      <button onClick={() => action('quote')} title={t('toolbar.quote')}>"</button>
      <button onClick={() => action('code')} title={t('toolbar.code')}>{'<>'}</button>
      <button onClick={() => action('codeblock')} title={t('toolbar.codeblock')}>Code</button>
      <div className="toolbar-divider"></div>
      <button onClick={() => action('link')} title={t('toolbar.link')}>🔗</button>
      <button onClick={() => action('image')} title={t('toolbar.image')}>🖼️</button>
      <button onClick={() => action('table')} title={t('toolbar.table')}>📊</button>
      <div className="toolbar-divider"></div>
      <button onClick={() => action('ul')} title={t('toolbar.ul')}>•</button>
      <button onClick={() => action('ol')} title={t('toolbar.ol')}>1.</button>
    </div>
  );
}
