import { useTranslation } from 'react-i18next';

export default function Typography({ config, setConfig }) {
  const { t } = useTranslation();
  return (
    <>
      <div className="config-group">
        <label>{t('fontSize')}</label>
        <input
          type="range" min="12" max="32"
          value={config.font_size}
          onChange={(e) => setConfig({ ...config, font_size: parseInt(e.target.value) })}
        />
        <span className="value-display">{config.font_size}px</span>
      </div>
      <div className="config-group">
        <label>{t('lineHeight')}</label>
        <input
          type="range" min="1.2" max="2.5" step="0.1"
          value={config.line_height}
          onChange={(e) => setConfig({ ...config, line_height: parseFloat(e.target.value) })}
        />
        <span className="value-display">{config.line_height}</span>
      </div>
      <div className="config-group">
        <label>{t('paragraphSpacing')}</label>
        <input
          type="range" min="10" max="40"
          value={config.paragraph_spacing}
          onChange={(e) => setConfig({ ...config, paragraph_spacing: parseInt(e.target.value) })}
        />
        <span className="value-display">{config.paragraph_spacing}px</span>
      </div>
      <div className="config-group">
        <label>{t('padding')}</label>
        <input
          type="range" min="20" max="80"
          value={config.padding}
          onChange={(e) => setConfig({ ...config, padding: parseInt(e.target.value) })}
        />
        <span className="value-display">{config.padding}px</span>
      </div>
    </>
  );
}
