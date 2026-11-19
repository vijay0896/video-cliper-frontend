/**
 * @file src/config/env.config.js
 * @description Single source of truth for environment variables and API URLs
 */

export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_URL || '',
  MODE: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'openshorts_auth',
  GEMINI_API_KEY: 'gemini_api_key',
  THEME: 'theme',
  ADVANCED_OPTS: 'advanced_options',
};

