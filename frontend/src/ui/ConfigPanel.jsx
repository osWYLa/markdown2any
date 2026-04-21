import { useTranslation } from 'react-i18next';
import ThemeSelector from './ThemeSelector.jsx';
import CanvasSize from './config-sections/CanvasSize.jsx';
import Typography from './config-sections/Typography.jsx';
import Color from './config-sections/Color.jsx';
import Meta from './config-sections/Meta.jsx';
import WatermarkConfig from './config-sections/Watermark.jsx';
import ExportConfig from './config-sections/Export.jsx';

export default function ConfigPanel({
  config, setConfig, selectedTheme, THEMES, PRESET_SIZES,
  onApplyTheme, onApplyPreset, onReset, leftWidth,
}) {
  const { t } = useTranslation();
  return (
    <div className="panel config-panel" style={{ width: `${leftWidth}px`, flex: 'none' }}>
      <div className="config-section">
        <h2>{t('configPanel')}</h2>
        <ThemeSelector THEMES={THEMES} selectedTheme={selectedTheme} onApplyTheme={onApplyTheme} />
        <CanvasSize config={config} setConfig={setConfig} PRESET_SIZES={PRESET_SIZES} onApplyPreset={onApplyPreset} />
        <Typography config={config} setConfig={setConfig} />
        <Color config={config} setConfig={setConfig} />
        <Meta config={config} setConfig={setConfig} />
        <WatermarkConfig config={config} setConfig={setConfig} />
        <ExportConfig config={config} setConfig={setConfig} />
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={onReset}>
            {t('resetConfig')}
          </button>
        </div>
      </div>
    </div>
  );
}
