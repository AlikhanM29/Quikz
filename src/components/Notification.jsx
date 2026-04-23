import React from "react";

export default function Notification({ msg }) {
  if (!msg) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'var(--green)',
      color: '#000',
      padding: '12px 24px',
      borderRadius: '10px',
      fontWeight: 'bold',
      boxShadow: '0 4px 15px rgba(57, 255, 20, 0.3)',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out'
    }}>
      {msg}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}