import React from 'react';
import { Type, RotateCcw, AlertCircle } from 'lucide-react';

const MAX_CHARS = 500;

/**
 * TextInput component:
 * textarea, live character count, word count, max character limit (500), validation for empty text
 */
export const TextInput = ({ 
  text, 
  onChange, 
  onClear,
  hasAttemptedSubmit 
}) => {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount >= MAX_CHARS - 50;
  const isEmpty = charCount === 0;
  const showError = hasAttemptedSubmit && isEmpty;

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      onChange(val);
    }
  };

  return (
    <div className="text-input-container">
      <div className="text-input-header">
        <label htmlFor="tts-text-input" className="input-label">
          <Type size={16} className="label-icon" />
          <span>Enter Text to Convert</span>
        </label>
        
        {charCount > 0 && (
          <button 
            type="button" 
            onClick={onClear} 
            className="clear-btn"
            title="Clear text"
            id="clear-text-button"
          >
            <RotateCcw size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className={`textarea-wrapper ${showError ? 'has-error' : ''} ${isNearLimit ? 'near-limit' : ''}`}>
        <textarea
          id="tts-text-input"
          className="text-area"
          rows={4}
          placeholder="Type or paste text here (up to 500 characters)... E.g., 'Hello! Welcome to our Text-to-Speech application.'"
          value={text}
          onChange={handleChange}
          maxLength={MAX_CHARS}
          aria-invalid={showError}
          aria-describedby={showError ? "text-error-desc" : "char-counter"}
        />
      </div>

      {showError && (
        <div className="input-validation-msg" id="text-error-desc">
          <AlertCircle size={14} />
          <span>Please enter some text before generating speech.</span>
        </div>
      )}

      <div className="text-input-footer" id="char-counter">
        <div className="word-count-badge">
          Words: <strong id="word-count-value">{wordCount}</strong>
        </div>
        
        <div className={`char-count-badge ${isNearLimit ? 'warning' : ''} ${isOverLimit ? 'danger' : ''}`}>
          <span id="char-count-value">{charCount}</span>
          <span className="char-max"> / {MAX_CHARS}</span>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
