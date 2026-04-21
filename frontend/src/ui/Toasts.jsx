export default function Toasts({ error, successMessage, isOverflowing }) {
  return (
    <>
      {isOverflowing && (
        <div style={{
          padding: '10px 16px',
          marginTop: '8px',
          backgroundColor: '#fff3cd',
          color: '#856404',
          borderRadius: '4px',
          border: '1px solid #ffc107',
          fontSize: '13px',
        }}>
          ⚠️ Content exceeds canvas height — enable "Auto height" in export settings to avoid cropping.
        </div>
      )}
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
      {successMessage && (
        <div className="success-message" style={{
          padding: '12px 20px',
          marginTop: '10px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          border: '1px solid #c3e6cb',
          fontSize: '14px',
        }}>
          {successMessage}
        </div>
      )}
    </>
  );
}
