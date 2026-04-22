import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

import { DEFAULT_CONFIG } from './render/defaultConfig.js';
import { getThemes } from './render/themes.js';
import { getPresetSizes } from './render/presetSizes.js';
import PreviewCanvas from './render/PreviewCanvas.jsx';

import { usePersistentMarkdown } from './hooks/usePersistentMarkdown.js';
import { useResizablePanels } from './hooks/useResizablePanels.js';
import { useExportImage } from './hooks/useExportImage.js';

import ConfigPanel from './ui/ConfigPanel.jsx';
import Editor from './ui/Editor.jsx';
import ExportActions from './ui/ExportActions.jsx';
import LanguageSwitcher from './ui/LanguageSwitcher.jsx';
import Resizer from './ui/Resizer.jsx';
import Toasts from './ui/Toasts.jsx';

function App() {
  const { t } = useTranslation();
  const THEMES = getThemes(t);
  const PRESET_SIZES = getPresetSizes(t);

  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [selectedTheme, setSelectedTheme] = useState('plain');

  const { markdownContent, setMarkdownContent, resetToSample } = usePersistentMarkdown();
  const { leftWidth, middleWidth, isResizingLeft, isResizingRight, startResizeLeft, startResizeRight } = useResizablePanels();
  const { previewRef, loading, copying, curlCopying, error, successMessage, isOverflowing, downloadImage, copyImageToClipboard, copyCurlCommand } = useExportImage(markdownContent, config, t, selectedTheme);
  const isOverLimit = markdownContent.length >= 10000;

  const applyTheme = (themeId) => {
    const theme = THEMES[themeId];
    if (theme) {
      setSelectedTheme(themeId);
      setConfig(prev => ({ ...prev, is_gradient: false, ...theme.config }));
    }
  };

  const applyPresetSize = (preset) => {
    setConfig(prev => ({ ...prev, canvas_width: preset.width, canvas_height: preset.height }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    setSelectedTheme('plain');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1>{t('title')}</h1>
            <p>{t('subtitle')}</p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="app-content">
        <ConfigPanel
          config={config}
          setConfig={setConfig}
          selectedTheme={selectedTheme}
          THEMES={THEMES}
          PRESET_SIZES={PRESET_SIZES}
          onApplyTheme={applyTheme}
          onApplyPreset={applyPresetSize}
          onReset={resetConfig}
          leftWidth={leftWidth}
        />
        <Resizer onMouseDown={startResizeLeft} active={isResizingLeft} />
        <Editor
          markdownContent={markdownContent}
          setMarkdownContent={setMarkdownContent}
          middleWidth={middleWidth}
          onResetToSample={resetToSample}
        />
        <Resizer onMouseDown={startResizeRight} active={isResizingRight} />
        <div className="panel preview-panel">
          <div className="preview-section">
            <h2>{t('preview')}</h2>
            <ExportActions
              loading={loading}
              copying={copying}
              curlCopying={curlCopying}
              isOverLimit={isOverLimit}
              isOverflowing={isOverflowing}
              onDownload={downloadImage}
              onCopy={copyImageToClipboard}
              onCopyCurl={copyCurlCommand}
            />
            <div className="preview-scroll-container">
              <PreviewCanvas ref={previewRef} markdown={markdownContent} config={config} />
            </div>
          </div>
        </div>
      </div>
      <Toasts error={error} successMessage={successMessage} />
    </div>
  );
}

export default App;
