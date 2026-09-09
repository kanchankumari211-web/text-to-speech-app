import React from 'react';
import { AlertTriangle, XCircle, WifiOff, X } from 'lucide-react';

/**
 * ErrorMessage component: shows validation, API, and network errors
 */
export const ErrorMessage = ({ error, onDismiss }) => {
  if (!error) return null;

  const isNetwork = error.status === 0 || error.code === 'NETWORK_ERROR';
  const isValidation = error.status === 400;

  return (
    <div 
      className={`error-banner ${isNetwork ? 'network-error' : isValidation ? 'validation-error' : 'server-error'}`}
      role="alert"
      id="error-message-banner"
    >
      <div className="error-icon">
        {isNetwork ? (
          <WifiOff size={20} />
        ) : isValidation ? (
          <AlertTriangle size={20} />
        ) : (
          <XCircle size={20} />
        )}
      </div>

      <div className="error-content">
        <div className="error-header">
          <span className="error-title">
            {isNetwork ? 'Connection Error' : isValidation ? 'Validation Notice' : 'Request Error'}
          </span>
          {error.status > 0 && (
            <span className="status-badge">HTTP {error.status}</span>
          )}
        </div>
        <p className="error-description">{error.message || 'An error occurred.'}</p>
      </div>

      {onDismiss && (
        <button 
          type="button"
          onClick={onDismiss} 
          className="error-dismiss-btn"
          aria-label="Dismiss error"
          id="error-dismiss-button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
