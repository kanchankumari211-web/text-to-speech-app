const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from text-to-speech root or local server folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const ttsRoutes = require('./routes/ttsRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins in dev mode or specify CLIENT_URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static audio files
const audioDir = path.join(__dirname, 'public/audio');
app.use('/audio', express.static(audioDir, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp3')) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
}));

// API Routes
app.use('/api', ttsRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Text-To-Speech Backend API is running',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      voices: 'GET /api/voices',
      tts: 'POST /api/tts'
    }
  });
});

// 404 handler for unknown routes
app.use(notFoundHandler);

// Centralized error handler
app.use(globalErrorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`TTS Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Voices list:  http://localhost:${PORT}/api/voices`);
    console.log(`===========================================`);
  });
}

module.exports = app;
