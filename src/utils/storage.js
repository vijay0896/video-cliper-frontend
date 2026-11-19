/**
 * @file src/utils/storage.js
 * @description Safe LocalStorage service with JSON parsing, error boundaries, and fallbacks
 */

export class StorageService {
  /**
   * Get raw string from localStorage
   * @param {string} key
   * @param {string} defaultValue
   * @returns {string}
   */
  static getString(key, defaultValue = '') {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : defaultValue;
    } catch (e) {
      console.warn(`[StorageService] Failed to read ${key}:`, e);
      return defaultValue;
    }
  }

  /**
   * Set raw string in localStorage
   * @param {string} key
   * @param {string} value
   */
  static setString(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[StorageService] Failed to write ${key}:`, e);
    }
  }

  /**
   * Get parsed JSON object from localStorage
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any}
   */
  static getItem(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      console.warn(`[StorageService] Failed to parse JSON for ${key}:`, e);
      return defaultValue;
    }
  }

  /**
   * Set JSON object in localStorage
   * @param {string} key
   * @param {any} value
   */
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[StorageService] Failed to serialize ${key}:`, e);
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key
   */
  static removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[StorageService] Failed to remove ${key}:`, e);
    }
  }

  /**
   * Clear all localStorage keys
   */
  static clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('[StorageService] Failed to clear storage:', e);
    }
  }
}

