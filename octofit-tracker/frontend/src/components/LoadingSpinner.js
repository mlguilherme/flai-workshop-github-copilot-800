import React from 'react';

function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="octo-spinner-wrap">
      <div className="octo-spinner" role="status" aria-label={label}>
        <span className="visually-hidden">{label}</span>
      </div>
      <p className="octo-spinner-label">{label}</p>
    </div>
  );
}

export default LoadingSpinner;
