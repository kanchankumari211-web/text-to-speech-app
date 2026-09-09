import React from 'react';
import { UserCheck } from 'lucide-react';

/**
 * VoiceSelector component:
 * Dropdown showing available voices for the selected language, fetched from GET /api/voices
 */
export const VoiceSelector = ({ 
  voices = [], 
  selectedVoice, 
  onChange, 
  selectedLanguage,
  isLoading = false 
}) => {
  // Filter voices matching current selected language
  const availableVoices = voices.filter(
    (v) => v.language.toLowerCase() === selectedLanguage.toLowerCase() || 
           v.langCode === selectedLanguage.split('-')[0].toLowerCase()
  );

  return (
    <div className="selector-group">
      <div className="label-row">
        <label htmlFor="voice-select" className="input-label">
          <UserCheck size={16} className="label-icon" />
          <span>Voice</span>
        </label>
        <span className="count-tag">
          {isLoading ? 'Loading...' : `${availableVoices.length} available`}
        </span>
      </div>

      <div className="select-wrapper">
        <select
          id="voice-select"
          className="custom-select"
          value={selectedVoice}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading || availableVoices.length === 0}
        >
          {availableVoices.length === 0 ? (
            <option value="">No voices available</option>
          ) : (
            availableVoices.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} ({voice.gender})
              </option>
            ))
          )}
        </select>
        <span className="select-arrow" aria-hidden="true">▼</span>
      </div>
    </div>
  );
};

export default VoiceSelector;
