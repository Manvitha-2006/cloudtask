import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const ErrorAlert = ({ message, type = 'error', onClose }) => {
  if (!message) return null;

  const isError = type === 'error';
  const Icon = isError ? AlertCircle : CheckCircle2;
  const alertClass = isError ? 'alert-error' : 'alert-success';

  return (
    <div className={`alert ${alertClass}`}>
      <Icon size={18} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, fontWeight: 500 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          style={{ color: 'inherit', display: 'flex', opacity: 0.8 }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
