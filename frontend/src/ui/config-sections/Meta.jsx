import { useTranslation } from 'react-i18next';

export default function Meta({ config, setConfig }) {
  const { t } = useTranslation();
  const update = (key, val) => setConfig({ ...config, [key]: val });
  return (
    <>
      <div className="config-group">
        <label>{t('author')}</label>
        <input
          type="text" value={config.author}
          onChange={(e) => update('author', e.target.value)}
          placeholder={t('authorPlaceholder')}
        />
      </div>
      <div className="config-group">
        <label>{t('timestamp')}</label>
        <input
          type="text" value={config.timestamp}
          onChange={(e) => update('timestamp', e.target.value)}
          placeholder={t('timestampPlaceholder')}
        />
      </div>
      <div className="config-group">
        <label>{t('metaPosition')}</label>
        <select value={config.meta_position} onChange={(e) => update('meta_position', e.target.value)}>
          <option value="top">{t('metaTop')}</option>
          <option value="bottom">{t('metaBottom')}</option>
        </select>
      </div>
    </>
  );
}
