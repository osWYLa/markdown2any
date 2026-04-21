import { useTranslation } from 'react-i18next';

export default function WatermarkConfig({ config, setConfig }) {
  const { t } = useTranslation();
  const update = (key, val) => setConfig({ ...config, [key]: val });

  return (
    <>
      <div className="config-section-divider"></div>
      <div className="config-group">
        <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <input
            type="checkbox" id="watermark_enable"
            checked={config.watermark_enable}
            onChange={(e) => update('watermark_enable', e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="watermark_enable" style={{ marginBottom: 0, cursor: 'pointer', userSelect: 'none' }}>
            {t('enableWatermark')}
          </label>
        </div>
      </div>

      {config.watermark_enable && (
        <>
          <div className="config-group">
            <label>{t('watermarkContent')}</label>
            <input
              type="text" value={config.watermark_text}
              onChange={(e) => update('watermark_text', e.target.value)}
              placeholder={t('watermarkPlaceholder')}
            />
          </div>
          <div className="config-group">
            <label>{t('watermarkColor')}</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="color" value={config.watermark_color} onChange={(e) => update('watermark_color', e.target.value)} />
              <input type="text" value={config.watermark_color} onChange={(e) => update('watermark_color', e.target.value)} className="color-input" />
            </div>
          </div>
          <div className="config-group">
            <label>{t('watermarkOpacity', { opacity: Math.round(config.watermark_opacity * 100) })}</label>
            <input
              type="range" min="0.05" max="1" step="0.05"
              value={config.watermark_opacity}
              onChange={(e) => update('watermark_opacity', parseFloat(e.target.value))}
            />
          </div>
          <div className="config-group">
            <label>{t('watermarkSize', { size: config.watermark_size })}</label>
            <input
              type="range" min="10" max="100"
              value={config.watermark_size}
              onChange={(e) => update('watermark_size', parseInt(e.target.value))}
            />
          </div>
          <div className="config-group">
            <label>{t('watermarkAngle', { angle: config.watermark_angle })}</label>
            <input
              type="range" min="-180" max="180"
              value={config.watermark_angle}
              onChange={(e) => update('watermark_angle', parseInt(e.target.value))}
            />
          </div>
          <div className="config-group">
            <label>{t('watermarkGap', { gap: config.watermark_gap })}</label>
            <input
              type="range" min="50" max="400"
              value={config.watermark_gap}
              onChange={(e) => update('watermark_gap', parseInt(e.target.value))}
            />
          </div>
        </>
      )}
    </>
  );
}
