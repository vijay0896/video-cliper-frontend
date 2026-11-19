/**
 * @file src/api/apiTags.js
 * @description Centralized cache tags for RTK Query caching & live zero-reload updates
 */

export const API_TAGS = {
  JOBS: 'JOBS',
  CLIPS: 'CLIPS',
  CONFIG: 'CONFIG',
  THUMBNAILS: 'THUMBNAILS',
  SOCIAL: 'SOCIAL',
  USER: 'USER',
};

export const ALL_API_TAGS = Object.values(API_TAGS);

