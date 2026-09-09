import React from 'react';
import { PlayCircle, Loader2 } from 'lucide-react';

/**
 * GenerateButton component:
 * calls POST /api/tts with { text, language, voice }, shows loading state
 */
export const GenerateButton = ({ 
  onClick, 
  isLoading = false, 
  disabled = false 
}) => {
  return (
    <button
      type="button"
      className={`generate-btn ${isLoading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      id="generate-speech-button"
    >
      {isLoading ? (
        <>
          <Loader2 size={20} className="spinner-icon" />
          <span>Generating Speech...</span>
        </>
      ) : (
        <>
          <PlayCircle size={20} />
          <span>Generate Speech</span>
        </>
      )}
    </button>
  );
};

export default GenerateButton;
