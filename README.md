# Text-to-Speech (TTS) Web Application — Level 1 (Basic)

A modern full-stack Text-to-Speech application built with a **React.js** frontend and **Node.js + Express.js** backend. Converts text into natural-sounding speech across multiple languages with zero subscription fees, featuring interactive audio playback and audio download.

---

## 🌟 Level 1 Core Features

- **Text Input**:
  - Multiline text area with placeholder.
  - Live character counter (`X / 500`) with visual threshold cues.
  - Live word counter.
  - Max limit enforcement (500 characters).
  - Empty text validation with helpful error feedback.
  - Clear text button.
- **Language Selection**:
  - Dropdown supporting **English (US, UK, India)**, **Hindi**, **Gujarati**, **Marathi**, **Spanish**, **French**, and **German**.
  - Dynamic voice filtering upon language change.
- **Voice Selection**:
  - Dropdown populated from `GET /api/voices`.
  - Filters voices matching the chosen language.
  - Shows voice names and gender badges (Female / Male).
- **Generate Speech**:
  - Primary button calling `POST /api/tts` with `{ text, language, voice }`.
  - Interactive loading spinner during speech synthesis.
- **Audio Player**:
  - Custom audio player with Play / Pause toggle.
  - Scrubbable progress bar / seek slider.
  - Volume slider and one-click mute/unmute.
  - Replay / restart button.
  - Animated equalizer soundwaves during playback.
- **Download Audio**:
  - One-click `.mp3` file download button with feedback animation.
- **Error Handling**:
  - Handles validation errors (empty text, > 500 characters).
  - Handles HTTP status codes (`400`, `401`, `404`, `429`, `500`, `503`).
  - Handles network/offline errors gracefully with dismissable alert banners.
- **TTS Engine Modes**:
  - **Backend REST API**: Synthesizes real `.mp3` audio files via the backend service with full playback and download capabilities.
  - **Browser Web Speech API**: Client-side speech synthesis using `window.speechSynthesis` for instant browser speech without network latency.

---

## 📁 Project Architecture

```
text-to-speech/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TextInput.jsx
│   │   │   ├── LanguageSelector.jsx
│   │   │   ├── VoiceSelector.jsx
│   │   │   ├── GenerateButton.jsx
│   │   │   ├── AudioPlayer.jsx
│   │   │   ├── DownloadButton.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── controllers/
│   │   └── ttsController.js
│   ├── routes/
│   │   └── ttsRoutes.js
│   ├── services/
│   │   └── ttsService.js
│   ├── middleware/
│   │   ├── validateRequest.js
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── public/
│   │   └── audio/
│   ├── server.js
│   └── package.json
├── .env
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Backend Setup (Server)
```bash
# Navigate to the server folder
cd text-to-speech/server

# Install dependencies
npm install

# Start the server (runs on http://localhost:5000)
npm start
# Or start in watch mode
npm run dev
```

### 2. Frontend Setup (Client)
```bash
# In a separate terminal, navigate to the client folder
cd text-to-speech/client

# Install dependencies
npm install

# Start the Vite development server (runs on http://localhost:5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 Backend API Endpoints

### 1. Health Check
- **Route:** `GET /api/health`
- **Response:**
```json
{
  "success": true,
  "status": "ok",
  "service": "Text-To-Speech API",
  "uptimeSeconds": 12,
  "timestamp": "2026-09-08T11:20:00.000Z"
}
```

### 2. Get Available Voices
- **Route:** `GET /api/voices`
- **Optional Query Param:** `?language=hi-IN`
- **Response:**
```json
{
  "success": true,
  "count": 18,
  "languages": [
    { "code": "en-US", "name": "English (US)", "flag": "🇺🇸" },
    { "code": "hi-IN", "name": "Hindi", "flag": "🇮🇳" }
  ],
  "voices": [
    {
      "id": "en-US-female-1",
      "name": "English (US) - Sarah",
      "language": "en-US",
      "gender": "Female"
    }
  ]
}
```

### 3. Convert Text to Speech
- **Route:** `POST /api/tts`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "text": "Hello! Welcome to the Text-to-Speech application.",
  "language": "en-US",
  "voice": "en-US-female-1"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "audioUrl": "http://localhost:5000/audio/speech-1725801234567-abc123.mp3",
  "relativeUrl": "/audio/speech-1725801234567-abc123.mp3",
  "format": "mp3",
  "filename": "speech-1725801234567-abc123.mp3"
}
```

---

## 🛡️ HTTP Error Status Codes

| Code | Meaning | Condition |
| :--- | :--- | :--- |
| `200` | OK | Speech generated successfully |
| `400` | Bad Request | Empty text, text > 500 characters, unsupported language/voice |
| `401` | Unauthorized | Missing or invalid authentication (prepared for Level 2/3) |
| `404` | Not Found | Route does not exist |
| `429` | Too Many Requests | Rate limit exceeded (> 60 requests / 15 minutes) |
| `500` | Internal Server Error | Unhandled server error |
| `503` | Service Unavailable | External TTS provider connection failure |

---

## 🧪 Testing with cURL / Postman

### Check Health:
```bash
curl -i http://localhost:5000/api/health
```

### Get Voices:
```bash
curl -i http://localhost:5000/api/voices
```

### Generate Speech (Valid):
```bash
curl -i -X POST http://localhost:5000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world! Testing our TTS application.","language":"en-US","voice":"en-US-female-1"}'
```

### Test Validation Error (Empty Text):
```bash
curl -i -X POST http://localhost:5000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"","language":"en-US"}'
```
*(Returns `400 Bad Request` with `{"success":false,"error":{"message":"Text cannot be empty","status":400,"code":"EMPTY_TEXT"}}`)*
