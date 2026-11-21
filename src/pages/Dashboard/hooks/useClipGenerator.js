/**
 * @file src/pages/Dashboard/hooks/useClipGenerator.js
 * @description Domain hook orchestrating video ingestion, polling, and clip rendering state
 */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.js';
import {
  setJobStarted,
  setJobStatus,
  setJobFailed,
  resetJob,
} from '../../../store/slices/appSlice.js';
import { useProcessVideoMutation, useGetJobStatusQuery } from '../clipsApi.js';
import { toast } from 'react-toastify';

export function useClipGenerator() {
  const dispatch = useAppDispatch();
  const { activeJobId, status, progress, logs, sourceMedia, result } = useAppSelector(
    (state) => state.app
  );
  const { geminiApiKey } = useAppSelector((state) => state.auth);

  const [processVideo, { isLoading: isSubmitting }] = useProcessVideoMutation();

  // Native RTK Query Polling without stale cache
  const { data: statusData, error: statusError } = useGetJobStatusQuery(activeJobId, {
    skip: !activeJobId || status === 'completed',
    pollingInterval: status === 'processing' ? 2000 : 0,
    refetchOnMountOrArgChange: true,
  });

  // Synchronize incoming status with Redux store
  useEffect(() => {
    if (!statusData) return;

    if (statusData.status === 'completed') {
      dispatch(
        setJobStatus({
          status: 'completed',
          progress: 100,
          logs: statusData.logs || [],
          result: statusData.result,
        })
      );
      toast.success('Clips successfully generated!');
    } else if (statusData.status === 'failed') {
      dispatch(
        setJobFailed({
          error: statusData.error || 'Pipeline execution failed',
        })
      );
      toast.error(statusData.error || 'Generation failed');
    } else if (statusData.status === 'processing') {
      dispatch(
        setJobStatus({
          status: 'processing',
          progress: statusData.progress || 20,
          logs: statusData.logs || [],
          result: statusData.result,
        })
      );
    }
  }, [statusData, dispatch]);

  // Handle Form Submission - accepts both { url, file, options } and { type, payload, ... }
  const handleStartGeneration = async (input) => {
    try {
      let body;
      let media;
      const url = input.url || (input.type === 'url' ? input.payload : null);
      const file = input.file || (input.type === 'file' ? input.payload : null);
      const targetClips = parseInt(input.targetClips || input.options?.targetClips || 3, 10);
      const clipMinSeconds = parseInt(input.clipMinSeconds || input.options?.clipMinSeconds || 15, 10);
      const clipMaxSeconds = parseInt(input.clipMaxSeconds || input.options?.clipMaxSeconds || 60, 10);
      const liveCaptureSeconds = parseInt(input.liveCaptureSeconds || input.options?.liveCaptureSeconds || 300, 10);
      const outputFormat = input.outputFormat || input.options?.outputFormat || 'vertical';
      const startTime = input.startTime || input.sourceStart || input.options?.startTime || undefined;
      const endTime = input.endTime || input.sourceEnd || input.options?.endTime || undefined;

      if (url) {
        body = {
          url,
          targetClips,
          target_clips: targetClips,
          clipMinSeconds,
          clipMaxSeconds,
          liveCaptureSeconds,
          outputFormat,
          ...(startTime ? { startTime, sourceStart: startTime } : {}),
          ...(endTime ? { endTime, sourceEnd: endTime } : {}),
        };
        media = { type: 'url', payload: url };
      } else if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetClips', String(targetClips));
        formData.append('target_clips', String(targetClips));
        formData.append('clipMinSeconds', String(clipMinSeconds));
        formData.append('clipMaxSeconds', String(clipMaxSeconds));
        formData.append('outputFormat', outputFormat);
        if (startTime) {
          formData.append('startTime', startTime);
          formData.append('sourceStart', startTime);
        }
        if (endTime) {
          formData.append('endTime', endTime);
          formData.append('sourceEnd', endTime);
        }
        body = formData;
        media = { type: 'file', payload: file };
      } else {
        toast.error('Please provide a YouTube URL or upload a video file');
        return;
      }

      const res = await processVideo(body).unwrap();
      const jobId = res.job_id || res.data?.id;

      if (!jobId) {
        throw new Error('Server did not return a valid job ID');
      }

      dispatch(setJobStarted({ jobId, media }));
      toast.info('Video queued for processing...');
    } catch (err) {
      const errMsg = err?.data?.message || err?.message || 'Failed to submit video';
      toast.error(errMsg);
      dispatch(setJobFailed({ error: errMsg }));
    }
  };

  const handleReset = () => {
    dispatch(resetJob());
  };

  return {
    activeJobId,
    status,
    progress,
    logs,
    sourceMedia,
    result,
    isSubmitting,
    handleStartGeneration,
    handleReset,
  };
}

