import axios from 'axios';

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000 // 20 seconds timeout
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
    // Request made but no response received (Network error / backend down)
    return {
      message: 'Cannot connect to backend server. Please make sure the server is running on port 5000.',
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
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

export default apiClient;
