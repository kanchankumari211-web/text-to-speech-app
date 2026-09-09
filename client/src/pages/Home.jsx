import React, { useState, useEffect } from 'react';
import TextInput from '../components/TextInput';
import LanguageSelector from '../components/LanguageSelector';
import VoiceSelector from '../components/VoiceSelector';
import GenerateButton from '../components/GenerateButton';
import AudioPlayer from '../components/AudioPlayer';
import DownloadButton from '../components/DownloadButton';
import ErrorMessage from '../components/ErrorMessage';
import { fetchVoices, generateSpeech } from '../services/api';
import { Sparkles, Radio, CheckCircle2, Mic2 } from 'lucide-react';

export const Home = () => {
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [voices, setVoices] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingVoices, setIsFetchingVoices] = useState(true);
  const [audioResult, setAudioResult] = useState(null);
  const [error, setError] = useState(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [speechMode, setSpeechMode] = useState('backend'); // 'backend' or 'browser'

  // Load voices from GET /api/voices
  useEffect(() => {
    const loadVoices = async () => {
      try {
        setIsFetchingVoices(true);
        const data = await fetchVoices();
        if (data.voices && data.voices.length > 0) {
          setVoices(data.voices);
          if (data.languages) setLanguages(data.languages);

          // Select default voice for current language
          const defaultVoice = data.voices.find(
            (v) => v.language.toLowerCase() === selectedLanguage.toLowerCase()
          );
          if (defaultVoice) {
            setSelectedVoice(defaultVoice.id);
          } else {
            setSelectedVoice(data.voices[0].id);
          }
        }
      } catch (err) {
        console.warn('Backend voices fetch failed; falling back to offline defaults:', err);
        setError({
          message: 'Could not load voices from backend server. Using local defaults.',
          status: err.status || 0,
          code: err.code || 'VOICES_FETCH_FAILED'
        });
      } finally {
        setIsFetchingVoices(false);
      }
    };

    loadVoices();
  }, []);

  // When language changes, update voice to matching language voice
  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    setError(null);

    const matchingVoice = voices.find(
      (v) => v.language.toLowerCase() === newLang.toLowerCase() ||
             v.langCode === newLang.split('-')[0].toLowerCase()
    );

    if (matchingVoice) {
      setSelectedVoice(matchingVoice.id);
    }
  };

  // Handle Clear
  const handleClearText = () => {
    setText('');
    setHasAttemptedSubmit(false);
    setError(null);
  };

  // Handle Generate Speech
  const handleGenerate = async () => {
    setHasAttemptedSubmit(true);
    setError(null);

    const trimmed = text.trim();
    if (!trimmed) {
      setError({
        message: 'Text cannot be empty. Please enter some text to generate speech.',
        status: 400,
        code: 'EMPTY_TEXT'
      });
      return;
    }

    if (trimmed.length > 500) {
      setError({
        message: 'Text exceeds maximum character limit of 500 characters.',
        status: 400,
        code: 'TEXT_TOO_LONG'
      });
      return;
    }

    // Optional Browser Web Speech API Mode
    if (speechMode === 'browser') {
      if (!('speechSynthesis' in window)) {
        setError({
          message: 'Your browser does not support the Web Speech API. Switching to backend mode.',
          status: 400,
          code: 'WEB_SPEECH_UNSUPPORTED'
        });
        setSpeechMode('backend');
        return;
      }

      setIsLoading(true);
      window.speechSynthesis.cancel(); // Stop ongoing speech

      const utterance = new SpeechSynthesisUtterance(trimmed);
      utterance.lang = selectedLanguage;

      // Find matching browser voice if available
      const browserVoices = window.speechSynthesis.getVoices();
      const matchedVoice = browserVoices.find(v => v.lang.startsWith(selectedLanguage.slice(0, 2)));
      if (matchedVoice) utterance.voice = matchedVoice;

      utterance.onend = () => {
        setIsLoading(false);
      };
      utterance.onerror = (e) => {
        setIsLoading(false);
        setError({
          message: `Browser speech synthesis error: ${e.error}`,
          status: 500,
          code: 'WEB_SPEECH_ERROR'
        });
      };

      window.speechSynthesis.speak(utterance);
      return;
    }

    // Backend Mode (Primary: POST /api/tts)
    try {
      setIsLoading(true);
      const result = await generateSpeech({
        text: trimmed,
        language: selectedLanguage,
        voice: selectedVoice
      });

      if (result.success && result.audioUrl) {
        setAudioResult({
          audioUrl: result.audioUrl,
          filename: result.filename || `speech-${Date.now()}.mp3`
        });
      } else {
        throw new Error('No audio URL returned from server.');
      }
    } catch (err) {
      console.error('TTS Generation failed:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      {/* App Header */}
      <header className="app-header">
        <div className="header-badge">
          <Sparkles size={14} className="badge-icon" />
          <span>Level 1 Basic Version</span>
        </div>
        <h1 className="app-title">Text-to-Speech Studio</h1>
        <p className="app-subtitle">
          Transform written text into crystal-clear speech across multiple languages with zero subscription fees.
        </p>
      </header>

      {/* Main TTS Workspace */}
      <main className="tts-card">
        {/* Error Notification */}
        {error && (
          <ErrorMessage 
            error={error} 
            onDismiss={() => setError(null)} 
          />
        )}

        {/* Mode Toggle Switch: Backend REST API vs Browser Native Web Speech */}
        <div className="mode-toggle-bar">
          <span className="mode-label">TTS Engine:</span>
          <div className="mode-options">
            <button
              type="button"
              className={`mode-btn ${speechMode === 'backend' ? 'active' : ''}`}
              onClick={() => setSpeechMode('backend')}
              id="mode-backend-btn"
            >
              <Radio size={14} />
              <span>Backend REST API (MP3 Download)</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${speechMode === 'browser' ? 'active' : ''}`}
              onClick={() => setSpeechMode('browser')}
              id="mode-browser-btn"
            >
              <Mic2 size={14} />
              <span>Browser Web Speech API</span>
            </button>
          </div>
        </div>

        {/* Text Input Component */}
        <TextInput
          text={text}
          onChange={setText}
          onClear={handleClearText}
          hasAttemptedSubmit={hasAttemptedSubmit}
        />

        {/* Language and Voice Selection Row */}
        <div className="selectors-grid">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onChange={handleLanguageChange}
            languages={languages}
          />

          <VoiceSelector
            voices={voices}
            selectedVoice={selectedVoice}
            onChange={setSelectedVoice}
            selectedLanguage={selectedLanguage}
            isLoading={isFetchingVoices}
          />
        </div>

        {/* Generate Button Component */}
        <div className="action-row">
          <GenerateButton
            onClick={handleGenerate}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>

        {/* Audio Output Section (AudioPlayer & DownloadButton) */}
        {audioResult && speechMode === 'backend' && (
          <section className="audio-output-section" aria-label="Generated Audio Output">
            <div className="output-header">
              <div className="output-status">
                <CheckCircle2 size={18} className="success-icon" />
                <span className="output-title">Audio Ready</span>
              </div>
              <DownloadButton
                audioUrl={audioResult.audioUrl}
                filename={audioResult.filename}
              />
            </div>

            <AudioPlayer audioUrl={audioResult.audioUrl} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Text-to-Speech Web Application • Built with React.js & Node.js Express</p>
      </footer>
    </div>
  );
};

export default Home;
