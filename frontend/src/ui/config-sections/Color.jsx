import { useTranslation } from 'react-i18next';

function ColorInput({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input type="color" value={value} onChange={onChange} />
      <input type="text" value={value} onChange={onChange} className="color-input" />
    </div>
  );
}

export default function Color({ config, setConfig }) {
  const { t } = useTranslation();
  const update = (key, val) => setConfig({ ...config, [key]: val });

  return (
    <>
      <div className="config-group">
        <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <input
            type="checkbox" id="is_gradient"
            checked={config.is_gradient}
            onChange={(e) => update('is_gradient', e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="is_gradient" style={{ marginBottom: 0, cursor: 'pointer', userSelect: 'none' }}>
            {t('gradientBackground')}
          </label>
        </div>
      </div>

      {!config.is_gradient ? (
        <div className="config-group">
          <label>{t('backgroundColor')}</label>
          <ColorInput
            value={config.background_color}
            onChange={(e) => update('background_color', e.target.value)}
          />
        </div>
      ) : (
        <>
          <div className="config-group">
            <label>{t('gradientStartColor')}</label>
            <ColorInput value={config.gradient_start} onChange={(e) => update('gradient_start', e.target.value)} />
          </div>
          <div className="config-group">
            <label>{t('gradientEndColor')}</label>
            <ColorInput value={config.gradient_end} onChange={(e) => update('gradient_end', e.target.value)} />
          </div>
          <div className="config-group">
            <label>{t('gradientAngle', { angle: config.gradient_angle })}</label>
            <input
              type="range" min="0" max="360"
              value={config.gradient_angle}
              onChange={(e) => update('gradient_angle', parseInt(e.target.value))}
            />
          </div>
        </>
      )}

      <div className="config-group">
        <label>{t('textColor')}</label>
        <ColorInput value={config.text_color} onChange={(e) => update('text_color', e.target.value)} />
      </div>
      <div className="config-group">
        <label>{t('accentColor')}</label>
        <ColorInput value={config.accent_color} onChange={(e) => update('accent_color', e.target.value)} />
      </div>
    </>
  );
}
