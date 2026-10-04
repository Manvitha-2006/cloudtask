import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', fullPage = false }) => {
  const content = (
    <div className="loading-container">
      <div className="spinner spinner-primary spinner-lg" />
      <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
