/**
 * @file src/store/slices/authSlice.js
 * @description Authentication and API Key credentials management slice
 */
import { createSlice } from '@reduxjs/toolkit';
import { StorageService } from '../../utils/storage.js';
import { STORAGE_KEYS } from '../../config/env.config.js';

const initialState = {
  geminiApiKey: StorageService.getString(STORAGE_KEYS.GEMINI_API_KEY, ''),
  authToken: StorageService.getString(STORAGE_KEYS.AUTH_TOKEN, ''),
  billingEnabled: false,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setGeminiApiKey: (state, action) => {
      state.geminiApiKey = action.payload;
      StorageService.setString(STORAGE_KEYS.GEMINI_API_KEY, action.payload);
    },
    removeGeminiApiKey: (state) => {
      state.geminiApiKey = '';
      StorageService.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
    },
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
      StorageService.setString(STORAGE_KEYS.AUTH_TOKEN, action.payload);
    },
    setBillingConfig: (state, action) => {
      state.billingEnabled = !!action.payload.billing_enabled;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  setGeminiApiKey,
  removeGeminiApiKey,
  setAuthToken,
  setBillingConfig,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;

