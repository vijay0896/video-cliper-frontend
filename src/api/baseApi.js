/**
 * @file src/api/baseApi.js
 * @description Centralized RTK Query Base API with auth interceptors and Gemini API Key injection
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { StorageService } from '../utils/storage.js';
import { STORAGE_KEYS, ENV } from '../config/env.config.js';
import { ALL_API_TAGS } from './apiTags.js';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: ENV.API_BASE_URL,
  prepareHeaders: (headers) => {
    // 1. Bearer Token for Cloud / Account mode
    const token = StorageService.getString(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // 2. Self-hosted / BYOK Google Gemini API Key
    const geminiKey = StorageService.getString(STORAGE_KEYS.GEMINI_API_KEY);
    if (geminiKey) {
      headers.set('X-Gemini-Key', geminiKey);
    }

    headers.set('Accept', 'application/json');
    return headers;
  },
});

const baseQueryWithInterceptors = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    // Handle 401 Session Expiration
    if (result.error.status === 401) {
      console.warn('[BaseAPI] 401 Unauthorized encountered');
    }
    // Handle 402 Quota Exceeded (for Cloud deployments)
    if (result.error.status === 402) {
      window.dispatchEvent(
        new CustomEvent('os:quota-wall', {
          detail: result.error.data || { error: 'quota_exceeded' },
        })
      );
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithInterceptors,
  tagTypes: ALL_API_TAGS,
  endpoints: () => ({}),
});

