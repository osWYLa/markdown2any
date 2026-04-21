import { useTranslation } from 'react-i18next';

export default function ExportActions({ loading, copying, onDownload, onCopy }) {
  const { t } = useTranslation();
  return (
    <div className="preview-actions">
      <button
        className="btn btn-success"
        onClick={onDownload}
        disabled={loading || copying}
      >
        {loading ? t('generating') : t('downloadImage')}
      </button>
      <button
        className="btn btn-primary"
        onClick={onCopy}
        disabled={loading || copying}
      >
        {copying ? t('copying') : t('copyImage')}
      </button>
    </div>
  );
}
