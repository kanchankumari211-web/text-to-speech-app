/**
 * Supported Languages and Voices for Text-To-Speech
 */

const MAX_TEXT_LENGTH = 500;

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' }
];

const AVAILABLE_VOICES = [
  // English (US)
  { id: 'en-US-female-1', name: 'English (US) - Sarah', language: 'en-US', langCode: 'en', gender: 'Female' },
  { id: 'en-US-male-1', name: 'English (US) - Michael', language: 'en-US', langCode: 'en', gender: 'Male' },
  
  // English (UK)
  { id: 'en-GB-female-1', name: 'English (UK) - Emma', language: 'en-GB', langCode: 'en', gender: 'Female' },
  { id: 'en-GB-male-1', name: 'English (UK) - Oliver', language: 'en-GB', langCode: 'en', gender: 'Male' },

  // English (India)
  { id: 'en-IN-female-1', name: 'English (India) - Priya', language: 'en-IN', langCode: 'en', gender: 'Female' },
  { id: 'en-IN-male-1', name: 'English (India) - Aarav', language: 'en-IN', langCode: 'en', gender: 'Male' },

  // Hindi
  { id: 'hi-IN-female-1', name: 'Hindi - Kavya', language: 'hi-IN', langCode: 'hi', gender: 'Female' },
  { id: 'hi-IN-male-1', name: 'Hindi - Rohan', language: 'hi-IN', langCode: 'hi', gender: 'Male' },

  // Gujarati
  { id: 'gu-IN-female-1', name: 'Gujarati - Diya', language: 'gu-IN', langCode: 'gu', gender: 'Female' },
  { id: 'gu-IN-male-1', name: 'Gujarati - Harsh', language: 'gu-IN', langCode: 'gu', gender: 'Male' },

  // Marathi
  { id: 'mr-IN-female-1', name: 'Marathi - Ananya', language: 'mr-IN', langCode: 'mr', gender: 'Female' },
  { id: 'mr-IN-male-1', name: 'Marathi - Sai', language: 'mr-IN', langCode: 'mr', gender: 'Male' },

  // Spanish
  { id: 'es-ES-female-1', name: 'Spanish - Lucia', language: 'es-ES', langCode: 'es', gender: 'Female' },
  { id: 'es-ES-male-1', name: 'Spanish - Mateo', language: 'es-ES', langCode: 'es', gender: 'Male' },

  // French
  { id: 'fr-FR-female-1', name: 'French - Camille', language: 'fr-FR', langCode: 'fr', gender: 'Female' },
  { id: 'fr-FR-male-1', name: 'French - Lucas', language: 'fr-FR', langCode: 'fr', gender: 'Male' },

  // German
  { id: 'de-DE-female-1', name: 'German - Hannah', language: 'de-DE', langCode: 'de', gender: 'Female' },
  { id: 'de-DE-male-1', name: 'German - Felix', language: 'de-DE', langCode: 'de', gender: 'Male' }
];

module.exports = {
  MAX_TEXT_LENGTH,
  SUPPORTED_LANGUAGES,
  AVAILABLE_VOICES
};
