export default function Toasts({ error, successMessage }) {
  return (
    <>
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
          fontSize: '14px'
        }}>
          {successMessage}
        </div>
      )}
    </>
  );
}
