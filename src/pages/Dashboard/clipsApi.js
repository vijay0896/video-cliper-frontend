/**
 * @file src/pages/Dashboard/clipsApi.js
 * @description RTK Query domain API injection for video processing and clip generation
 */
import { baseApi } from '../../api/baseApi.js';
import { API_TAGS } from '../../api/apiTags.js';

export const clipsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Process Video / Create Job
    processVideo: builder.mutation({
      query: (payload) => {
        const isFormData = payload instanceof FormData;
        return {
          url: '/api/process',
          method: 'POST',
          body: payload,
          headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: [{ type: API_TAGS.JOBS, id: 'LIST' }],
    }),

    // 2. Poll Job Status
    getJobStatus: builder.query({
      query: (jobId) => `/api/status/${jobId}`,
      providesTags: (_result, _error, jobId) => [{ type: API_TAGS.JOBS, id: jobId }],
    }),

    // 3. System Config
    getSystemConfig: builder.query({
      query: () => '/api/config',
      providesTags: [API_TAGS.CONFIG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useProcessVideoMutation,
  useGetJobStatusQuery,
  useLazyGetJobStatusQuery,
  useGetSystemConfigQuery,
} = clipsApi;

