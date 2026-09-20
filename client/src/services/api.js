import axios from 'axios';

// Base backend URL: prefer environment variable, fallback to localhost for local development
const rawBackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '');

// Ensure base URL routes to /api
export const API_BASE_URL = BACKEND_URL.endsWith('/api')
  ? BACKEND_URL
  : `${BACKEND_URL}/api`;

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 25000 // 25 seconds timeout (accounts for cold starts on free hosting like Render)
});

/**
 * Parses axios or network error into a consistent user-friendly error object
 * @param {Error} error
 * @returns {{ message: string, status: number, code: string }}
 */
export const parseApiError = (error) => {
  if (error.response) {
    // Backend returned HTTP error code (400, 401, 404, 429, 500, 503)
    const status = error.response.status;
    const data = error.response.data;
    const message = data?.error?.message || data?.message || getDefaultStatusMessage(status);
    const code = data?.error?.code || `HTTP_${status}`;
    return { message, status, code };
  } else if (error.request) {
    // Request made but no response received (Network error / backend down / cold start)
    const isLocal = BACKEND_URL.includes('localhost') || BACKEND_URL.includes('127.0.0.1');
    const message = isLocal
      ? 'Cannot connect to backend server. Please make sure the local server is running on port 5000.'
      : `Cannot connect to backend server at ${BACKEND_URL}. The service might be starting up (Render cold start may take 30-60s) or temporarily unavailable.`;

    return {
      message,
      status: 0,
      code: 'NETWORK_ERROR'
    };
  } else {
    // Client-side setup error
    return {
      message: error.message || 'An unexpected error occurred.',
      status: -1,
      code: 'CLIENT_ERROR'
    };
  }
};

const getDefaultStatusMessage = (status) => {
  switch (status) {
    case 400: return 'Invalid request parameters.';
    case 401: return 'Unauthorized request.';
    case 403: return 'Access forbidden.';
    case 404: return 'API endpoint not found.';
    case 429: return 'Too many requests. Please wait a moment before trying again.';
    case 500: return 'Internal server error occurred.';
    case 503: return 'Text-to-speech service is temporarily unavailable.';
    default: return `Request failed with status code ${status}.`;
  }
};

/**
 * Check backend health
 * @returns {Promise<Object>}
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Fetch available voices and languages
 * @param {string} [language]
 * @returns {Promise<{ voices: Array, languages: Array }>}
 */
export const fetchVoices = async (language) => {
  try {
    const response = await apiClient.get('/voices', {
      params: language ? { language } : {}
    });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Generate speech audio from text
 * @param {{ text: string, language: string, voice: string }} payload
 * @returns {Promise<{ success: boolean, audioUrl: string, relativeUrl: string, filename: string }>}
 */
export const generateSpeech = async ({ text, language, voice }) => {
  try {
    const response = await apiClient.post('/tts', {
      text,
      language,
      voice
    });
    const data = response.data;

    // Ensure audioUrl is fully qualified and respects production protocol (https)
    if (data) {
      if (data.audioUrl && data.audioUrl.startsWith('/')) {
        data.audioUrl = `${BACKEND_URL}${data.audioUrl}`;
      } else if (data.relativeUrl && (!data.audioUrl || (data.audioUrl.includes('localhost') && !BACKEND_URL.includes('localhost')))) {
        data.audioUrl = `${BACKEND_URL}${data.relativeUrl}`;
      } else if (data.audioUrl && BACKEND_URL.startsWith('https://') && data.audioUrl.startsWith('http://')) {
        data.audioUrl = data.audioUrl.replace(/^http:\/\//, 'https://');
      }
    }

    return data;
  } catch (error) {
    throw parseApiError(error);
  }
};

export default apiClient;
