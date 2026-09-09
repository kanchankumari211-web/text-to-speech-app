const fs = require('fs');
const path = require('path');

/**
 * Counts words in a string
 * @param {string} text
 * @returns {number}
 */
const countWords = (text) => {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};

/**
 * Removes cached audio files older than maxAgeMinutes
 * @param {string} dirPath
 * @param {number} maxAgeMinutes
 */
const cleanupOldAudioFiles = (dirPath, maxAgeMinutes = 30) => {
  try {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    const now = Date.now();
    const maxAgeMs = maxAgeMinutes * 60 * 1000;

    for (const file of files) {
      if (file === '.gitkeep') continue;
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile() && (now - stats.mtimeMs > maxAgeMs)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (err) {
    console.error('Error during audio cleanup:', err.message);
  }
};

module.exports = {
  countWords,
  cleanupOldAudioFiles
};
