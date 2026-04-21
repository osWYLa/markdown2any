import { useTranslation } from 'react-i18next';

export default function ExportConfig({ config, setConfig }) {
  const { t } = useTranslation();
  const update = (key, val) => setConfig({ ...config, [key]: val });

  return (
    <>
      <div className="config-section-divider"></div>
      <div className="config-group">
        <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <input
            type="checkbox" id="auto_height"
            checked={config.auto_height}
            onChange={(e) => update('auto_height', e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="auto_height" style={{ marginBottom: 0, cursor: 'pointer', userSelect: 'none' }}>
            {t('autoHeight', 'Auto height (no crop)')}
          </label>
        </div>
      </div>
      <div className="config-group">
        <label>{t('exportFormat', 'Export format')}</label>
        <select value={config.export_format} onChange={(e) => update('export_format', e.target.value)}>
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WebP</option>
        </select>
      </div>
      <div className="config-group">
        <label>{t('exportScale', 'Scale')} ({config.export_scale}x)</label>
        <select value={config.export_scale} onChange={(e) => update('export_scale', parseInt(e.target.value))}>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={3}>3x</option>
        </select>
      </div>
      {config.export_format !== 'png' && (
        <div className="config-group">
          <label>{t('exportQuality', 'Quality')} ({Math.round(config.export_quality * 100)}%)</label>
          <input
            type="range" min="0.1" max="1" step="0.05"
            value={config.export_quality}
            onChange={(e) => update('export_quality', parseFloat(e.target.value))}
          />
        </div>
      )}
    </>
  );
}
