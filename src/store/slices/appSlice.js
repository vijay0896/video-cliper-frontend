/**
 * @file src/store/slices/appSlice.js
 * @description Central Redux slice for active clip generator state, active jobs, and modals
 */
import { createSlice } from '@reduxjs/toolkit';
import { StorageService } from '../../utils/storage.js';

const SESSION_KEY = 'os_active_session';
const savedSession = StorageService.getItem(SESSION_KEY, null);

const initialState = {
  activeJobId: savedSession?.activeJobId || null,
  status: savedSession?.status || 'idle', // 'idle' | 'processing' | 'completed' | 'failed'
  progress: savedSession?.progress || 0,
  logs: savedSession?.logs || [],
  sourceMedia: savedSession?.sourceMedia || null, // { type: 'url' | 'file', payload: string | File }
  result: savedSession?.result || null, // { clips: [], video_path: '' }
  activeModal: null, // 'hook' | 'subtitle' | 'reframe' | 'translate' | 'schedule' | null
  activeClipIndex: 0,
};

const persistSession = (state) => {
  StorageService.setItem(SESSION_KEY, {
    activeJobId: state.activeJobId,
    status: state.status,
    progress: state.progress,
    logs: state.logs,
    sourceMedia: state.sourceMedia,
    result: state.result,
  });
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setJobStarted: (state, action) => {
      state.activeJobId = action.payload.jobId;
      state.sourceMedia = action.payload.media || null;
      state.status = 'processing';
      state.progress = 5;
      state.logs = ['Job queued for processing'];
      state.result = null;
      persistSession(state);
    },
    setJobStatus: (state, action) => {
      const { status, progress, logs, result } = action.payload;
      if (status) state.status = status;
      if (typeof progress === 'number') state.progress = progress;
      if (logs) state.logs = logs;
      if (result) state.result = result;
      persistSession(state);
    },
    setJobFailed: (state, action) => {
      state.status = 'failed';
      if (action.payload?.error) {
        state.logs = [...state.logs, `Error: ${action.payload.error}`];
      }
      persistSession(state);
    },
    resetJob: (state) => {
      state.activeJobId = null;
      state.status = 'idle';
      state.progress = 0;
      state.logs = [];
      state.sourceMedia = null;
      state.result = null;
      state.activeModal = null;
      StorageService.removeItem(SESSION_KEY);
    },
    openModal: (state, action) => {
      state.activeModal = action.payload.modal;
      state.activeClipIndex = action.payload.clipIndex ?? state.activeClipIndex;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    updateClipResult: (state, action) => {
      const { index, updatedClip } = action.payload;
      if (state.result?.clips?.[index]) {
        state.result.clips[index] = { ...state.result.clips[index], ...updatedClip };
        persistSession(state);
      }
    },
  },
});

export const {
  setJobStarted,
  setJobStatus,
  setJobFailed,
  resetJob,
  openModal,
  closeModal,
  updateClipResult,
} = appSlice.actions;

export default appSlice.reducer;

