const { MAX_TEXT_LENGTH, SUPPORTED_LANGUAGES, AVAILABLE_VOICES } = require('../utils/constants');

/**
 * Middleware to validate TTS generation requests
 */
const validateTtsRequest = (req, res, next) => {
  // 1. Content-Type check
  if (!req.is('application/json')) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Content-Type must be application/json',
        status: 400,
        code: 'INVALID_CONTENT_TYPE'
      }
    });
  }

  const { text, language, voice } = req.body;

  // 2. Validate Text existence & type
  if (text === undefined || text === null || typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Text is required and must be a string',
        status: 400,
        code: 'MISSING_TEXT'
      }
    });
  }

  const trimmedText = text.trim();

  // 3. Validate non-empty text
  if (trimmedText.length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Text cannot be empty',
        status: 400,
        code: 'EMPTY_TEXT'
      }
    });
  }

  // 4. Validate max text length
  if (trimmedText.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({
      success: false,
      error: {
        message: `Text exceeds maximum allowed limit of ${MAX_TEXT_LENGTH} characters. Current length: ${trimmedText.length}`,
        status: 400,
        code: 'TEXT_TOO_LONG'
      }
    });
  }

  // 5. Validate language
  if (!language || typeof language !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Language is required and must be a valid language code',
        status: 400,
        code: 'MISSING_LANGUAGE'
      }
    });
  }

  const supportedLang = SUPPORTED_LANGUAGES.find(l => l.code.toLowerCase() === language.toLowerCase());
  if (!supportedLang) {
    return res.status(400).json({
      success: false,
      error: {
        message: `Invalid language '${language}'. Supported languages: ${SUPPORTED_LANGUAGES.map(l => l.code).join(', ')}`,
        status: 400,
        code: 'UNSUPPORTED_LANGUAGE'
      }
    });
  }

  // 6. Validate voice (optional or matching language)
  if (voice) {
    const validVoice = AVAILABLE_VOICES.find(
      v => (v.id === voice || v.name === voice) && v.language.toLowerCase() === supportedLang.code.toLowerCase()
    );
    if (!validVoice) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Voice '${voice}' is not valid for language '${supportedLang.code}'.`,
          status: 400,
          code: 'INVALID_VOICE'
        }
      });
    }
  }

  // Attach sanitized fields to req
  req.sanitizedBody = {
    text: trimmedText,
    language: supportedLang.code,
    voice: voice || AVAILABLE_VOICES.find(v => v.language === supportedLang.code)?.id
  };

  next();
};

module.exports = {
  validateTtsRequest
};
