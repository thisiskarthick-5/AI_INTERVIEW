/**
 * Format seconds into MM:SS string
 * @param {number} seconds 
 * @returns {string}
 */
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * Format a Firebase Timestamp or Date into a readable string
 * @param {any} timestamp 
 * @returns {string}
 */
export const formatDate = (timestamp) => {
  const date = timestamp?.toMillis ? new Date(timestamp.toMillis()) : new Date(timestamp || Date.now());
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};
