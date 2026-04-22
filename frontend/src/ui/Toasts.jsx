import { useEffect, useState } from 'react';

function Toast({ message, type }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const bg = type === 'error' ? '#1a1a1a' : '#1a1a1a';
  const border = type === 'error' ? '#ef4444' : '#22c55e';
  const icon = type === 'error' ? '✕' : '✓';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      background: bg,
      color: '#fff',
      borderRadius: '8px',
      borderLeft: `3px solid ${border}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontSize: '14px',
      fontWeight: 500,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-8px)',
      transition: 'opacity 0.2s ease, transform 0.2s ease',
      maxWidth: '320px',
      wordBreak: 'break-word',
    }}>
      <span style={{ color: border, fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>{icon}</span>
      {message}
    </div>
  );
}

export default function Toasts({ error, successMessage }) {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      pointerEvents: 'none',
    }}>
      {error && <Toast key={error} message={error} type="error" />}
      {successMessage && <Toast key={successMessage} message={successMessage} type="success" />}
    </div>
  );
}
