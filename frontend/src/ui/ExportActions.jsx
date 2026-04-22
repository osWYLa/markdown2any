import { useTranslation } from 'react-i18next';

export default function ExportActions({ loading, copying, curlCopying, isOverLimit, onDownload, onCopy, onCopyCurl }) {
  const { t } = useTranslation();
  const disabled = loading || copying || curlCopying || isOverLimit;
  return (
    <div className="preview-actions">
      <button className="btn btn-success" onClick={onDownload} disabled={disabled}>
        {loading ? t('generating') : t('downloadImage')}
      </button>
      <button className="btn btn-primary" onClick={onCopy} disabled={disabled}>
        {copying ? t('copying') : t('copyImage')}
      </button>
      <button className="btn btn-secondary" onClick={onCopyCurl} disabled={disabled}>
        {curlCopying ? t('curlCopying') : t('copyCurl')}
      </button>
    </div>
  );
}
