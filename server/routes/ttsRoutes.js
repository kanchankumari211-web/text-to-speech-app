const express = require('express');
const router = express.Router();
const { getHealth, getVoices, generateTTS } = require('../controllers/ttsController');
const { validateTtsRequest } = require('../middleware/validateRequest');
const { apiRateLimiter } = require('../middleware/rateLimiter');

// GET /api/health
router.get('/health', getHealth);

// GET /api/voices
router.get('/voices', getVoices);

// POST /api/tts
router.post('/tts', apiRateLimiter, validateTtsRequest, generateTTS);

module.exports = router;
