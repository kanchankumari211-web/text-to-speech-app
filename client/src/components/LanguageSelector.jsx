import React from 'react';
import { Globe } from 'lucide-react';

/**
 * Supported Languages according to project requirements:
 * English, Hindi, Gujarati, Marathi, Spanish, French, German
 */
const DEFAULT_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi (मराठी)', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German (Deutsch)', flag: '🇩🇪' }
];

/**
 * LanguageSelector component:
 * Dropdown showing languages (English, Hindi, Gujarati, Marathi, Spanish, French, German)
 */
export const LanguageSelector = ({ 
  selectedLanguage, 
  onChange, 
  languages = DEFAULT_LANGUAGES 
}) => {
  const list = languages && languages.length > 0 ? languages : DEFAULT_LANGUAGES;

  return (
    <div className="selector-group">
      <label htmlFor="language-select" className="input-label">
        <Globe size={16} className="label-icon" />
        <span>Language</span>
      </label>

      <div className="select-wrapper">
        <select
          id="language-select"
          className="custom-select"
          value={selectedLanguage}
          onChange={(e) => onChange(e.target.value)}
        >
          {list.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag ? `${lang.flag} ` : ''}{lang.name}
            </option>
          ))}
        </select>
        <span className="select-arrow" aria-hidden="true">▼</span>
      </div>
    </div>
  );
};

export default LanguageSelector;
