import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';

/**
 * Formats seconds into MM:SS
 */
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * AudioPlayer component:
 * play/pause/seek/volume for generated audio
 */
export const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);

  // Reset playback state when audioUrl changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      audioRef.current.currentTime = 0;
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Playback error:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      const restoreVol = previousVolume > 0 ? previousVolume : 1;
      setVolume(restoreVol);
      audioRef.current.volume = restoreVol;
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player-card" id="tts-audio-player">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="player-top-row">
        <div className="track-info">
          <span className="track-title">Generated Speech</span>
          <div className="equalizer-waves">
            <span className={`bar bar-1 ${isPlaying ? 'animating' : ''}`}></span>
            <span className={`bar bar-2 ${isPlaying ? 'animating' : ''}`}></span>
            <span className={`bar bar-3 ${isPlaying ? 'animating' : ''}`}></span>
            <span className={`bar bar-4 ${isPlaying ? 'animating' : ''}`}></span>
          </div>
        </div>

        <div className="time-display">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="time-separator">/</span>
          <span className="total-duration">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Progress Bar / Seek Slider */}
      <div className="seek-container">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.05"
          value={currentTime}
          onChange={handleSeek}
          className="seek-slider"
          aria-label="Audio playback seek timeline"
          style={{
            background: `linear-gradient(to right, #6366f1 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`
          }}
        />
      </div>

      {/* Control Buttons and Volume Row */}
      <div className="player-controls-row">
        <div className="main-controls">
          <button
            type="button"
            className="play-pause-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            id="audio-play-pause-btn"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="play-icon-offset" />}
          </button>

          <button
            type="button"
            className="restart-btn"
            onClick={restartAudio}
            aria-label="Restart audio from beginning"
            title="Replay from start"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="volume-control-group">
          <button
            type="button"
            className="volume-toggle-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label="Audio volume"
            style={{
              background: `linear-gradient(to right, #6366f1 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.15) ${(isMuted ? 0 : volume) * 100}%)`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
