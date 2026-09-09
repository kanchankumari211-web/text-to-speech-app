const fs = require('fs');
const path = require('path');
const googleTTS = require('google-tts-api');
const { cleanupOldAudioFiles } = require('../utils/helpers');

const AUDIO_DIR = path.join(__dirname, '../public/audio');

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

/**
 * Maps language code to google-tts-api supported language code
 * @param {string} langCode e.g. 'en-US', 'hi-IN'
 * @returns {string} e.g. 'en', 'hi', 'gu', 'mr'
 */
const mapLanguageCode = (langCode) => {
  if (!langCode) return 'en';
  const prefix = langCode.split('-')[0].toLowerCase();
  
  // Specific mappings supported by free TTS
  const map = {
    'en': 'en',
    'hi': 'hi',
    'gu': 'gu',
    'mr': 'mr',
    'es': 'es',
    'fr': 'fr',
    'de': 'de'
  };

  return map[prefix] || prefix || 'en';
};

/**
 * Generates an MP3 audio file from text using free Google TTS engine
 * @param {Object} options
 * @param {string} options.text - Input text to speak
 * @param {string} options.language - Language code (e.g., 'en-US', 'hi-IN')
 * @param {string} [options.voice] - Voice identifier
 * @param {string} options.baseUrl - Server base URL (e.g. 'http://localhost:5000')
 * @returns {Promise<{ filename: string, audioUrl: string, relativeUrl: string }>}
 */
const synthesizeSpeech = async ({ text, language, voice, baseUrl }) => {
  try {
    // Run cleanup for audio files older than 30 minutes
    cleanupOldAudioFiles(AUDIO_DIR, 30);

    const lang = mapLanguageCode(language);
    
    // Check if voice specifies slow speed or standard
    const isSlow = voice && voice.includes('slow');

    // Generate base64 audio chunks (supports text up to 500 chars seamlessly)
    const audioChunks = await googleTTS.getAllAudioBase64(text, {
      lang,
      slow: isSlow,
      host: 'https://translate.google.com',
      timeout: 15000,
      splitPunct: ',.?!;:'
    });

    if (!audioChunks || audioChunks.length === 0) {
      const err = new Error('No audio data received from text-to-speech engine');
      err.status = 503;
      err.code = 'TTS_SYNTHESIS_FAILED';
      throw err;
    }

    // Combine base64 buffers
    const buffers = audioChunks.map(chunk => Buffer.from(chunk.base64, 'base64'));
    const combinedBuffer = Buffer.concat(buffers);

    // Unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const filename = `speech-${timestamp}-${randomSuffix}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);

    // Save MP3 file
    fs.writeFileSync(filePath, combinedBuffer);

    const relativeUrl = `/audio/${filename}`;
    const audioUrl = baseUrl ? `${baseUrl}${relativeUrl}` : relativeUrl;

    return {
      filename,
      relativeUrl,
      audioUrl,
      format: 'mp3',
      sizeBytes: combinedBuffer.length
    };
  } catch (error) {
    console.error('Error in synthesizeSpeech service:', error);
    if (!error.status) {
      error.status = 503;
      error.code = 'TTS_SERVICE_UNAVAILABLE';
      error.message = 'Unable to generate audio at this time. Please check your internet connection or try again later.';
    }
    throw error;
  }
};

module.exports = {
  synthesizeSpeech
};
