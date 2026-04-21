import { useTranslation } from 'react-i18next';

export default function ExportActions({ loading, copying, isOverLimit, onDownload, onCopy }) {
  const { t } = useTranslation();
  const disabled = loading || copying || isOverLimit;
  return (
    <div className="preview-actions">
      <button className="btn btn-success" onClick={onDownload} disabled={disabled}>
        {loading ? t('generating') : t('downloadImage')}
      </button>
      <button className="btn btn-primary" onClick={onCopy} disabled={disabled}>
        {copying ? t('copying') : t('copyImage')}
      </button>
    </div>
  );
}
