const { SUPPORTED_LANGUAGES, AVAILABLE_VOICES } = require('../utils/constants');
const { synthesizeSpeech } = require('../services/ttsService');

/**
 * Health check handler
 * GET /api/health
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'Text-To-Speech API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
};

/**
 * Get available voices and supported languages
 * GET /api/voices
 */
const getVoices = (req, res) => {
  const { language } = req.query;

  let filteredVoices = AVAILABLE_VOICES;
  if (language) {
    filteredVoices = AVAILABLE_VOICES.filter(
      v => v.language.toLowerCase() === language.toLowerCase() || v.langCode === language.toLowerCase()
    );
  }

  res.status(200).json({
    success: true,
    count: filteredVoices.length,
    languages: SUPPORTED_LANGUAGES,
    voices: filteredVoices
  });
};

/**
 * Convert text to speech
 * POST /api/tts
 */
const generateTTS = async (req, res, next) => {
  try {
    const { text, language, voice } = req.sanitizedBody;
    
    // Construct base URL for static file serving
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    const audioResult = await synthesizeSpeech({
      text,
      language,
      voice,
      baseUrl
    });

    res.status(200).json({
      success: true,
      audioUrl: audioResult.audioUrl,
      relativeUrl: audioResult.relativeUrl,
      format: audioResult.format,
      filename: audioResult.filename,
      meta: {
        textLength: text.length,
        language,
        voice: voice || 'default'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHealth,
  getVoices,
  generateTTS
};
