/**
 * @file src/utils/formatters.js
 * @description Standardized formatting utilities for video timestamps, durations, and sizes
 */

/**
 * Format seconds to mm:ss or hh:mm:ss
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatDuration(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds === null) return '00:00';
  const sec = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const remainingSeconds = sec % 60;

  const paddedMin = String(minutes).padStart(2, '0');
  const paddedSec = String(remainingSeconds).padStart(2, '0');

  if (hours > 0) {
    const paddedHours = String(hours).padStart(2, '0');
    return `${paddedHours}:${paddedMin}:${paddedSec}`;
  }
  return `${paddedMin}:${paddedSec}`;
}

/**
 * Format bytes to readable string (KB, MB, GB)
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Extract YouTube Video ID from any standard URL
 * @param {string} url
 * @returns {string|null}
 */
export function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

