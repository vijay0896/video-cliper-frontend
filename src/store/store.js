/**
 * @file src/store/store.js
 * @description Centralized Redux Store with RTK Query baseApi middleware
 */
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '../api/baseApi.js';
import appReducer from './slices/appSlice.js';
import authReducer from './slices/authSlice.js';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    app: appReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // allows File instances in sourceMedia for local preview
    }).concat(baseApi.middleware),
});

setupListeners(store.dispatch);

