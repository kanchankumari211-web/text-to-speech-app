import React, { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';

/**
 * DownloadButton component:
 * download generated audio
 */
export const DownloadButton = ({ audioUrl, filename = 'generated-speech.mp3' }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!audioUrl) return;

    try {
      setIsDownloading(true);
      
      // Fetch audio blob
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Failed to fetch audio stream for download');
      const blob = await response.blob();
      
      // Create object URL for anchor download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename.endsWith('.mp3') ? filename : `${filename}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback: direct anchor trigger
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = filename;
      link.target = '_blank';
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      className={`download-btn ${downloaded ? 'success' : ''}`}
      onClick={handleDownload}
      disabled={isDownloading || !audioUrl}
      id="download-audio-button"
    >
      {isDownloading ? (
        <>
          <Loader2 size={16} className="spinner-icon" />
          <span>Preparing Download...</span>
        </>
      ) : downloaded ? (
        <>
          <Check size={16} />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <Download size={16} />
          <span>Download Audio</span>
        </>
      )}
    </button>
  );
};

export default DownloadButton;
