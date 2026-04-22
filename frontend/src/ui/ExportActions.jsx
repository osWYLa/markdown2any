import { useTranslation } from 'react-i18next';

export default function ExportActions({ loading, copying, curlCopying, isOverLimit, isOverflowing, onDownload, onCopy, onCopyCurl }) {
  const { t } = useTranslation();
  const disabled = loading || copying || curlCopying || isOverLimit;
  return (
    <div>
      {isOverflowing && (
        <div style={{
          padding: '8px 12px',
          marginBottom: '8px',
          backgroundColor: '#fefce8',
          color: '#854d0e',
          borderRadius: '6px',
          border: '1px solid #fde047',
          fontSize: '12px',
          lineHeight: 1.4,
        }}>
          ⚠ Content exceeds canvas height — enable "Auto height" to avoid cropping.
        </div>
      )}
      <div className="preview-actions">
        <button className="btn btn-primary" onClick={onDownload} disabled={disabled}>
          {loading ? t('generating') : t('downloadImage')}
        </button>
        <button className="btn btn-outline" onClick={onCopy} disabled={disabled}>
          {copying ? t('copying') : t('copyImage')}
        </button>
        <button className="btn btn-ghost" onClick={onCopyCurl} disabled={disabled}>
          {curlCopying ? t('curlCopying') : t('copyCurl')}
        </button>
      </div>
    </div>
  );
}
