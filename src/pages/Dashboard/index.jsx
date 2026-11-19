/**
 * @file src/pages/Dashboard/index.jsx
 * @description Main Dashboard & Clip Generator domain page view matching reference screenshots
 */
import React, { useState } from 'react';
import { useClipGenerator } from './hooks/useClipGenerator.js';
import MediaInput from '../../components/MediaInput.jsx';
import ProcessingAnimation from '../../components/ProcessingAnimation.jsx';
import ResultCard from '../../components/ResultCard.jsx';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { openModal, closeModal, updateClipResult } from '../../store/slices/appSlice.js';
import { getApiUrl } from '../../config.js';

// Icons
import {
  Activity,
  Terminal,
  ChevronDown,
  Loader2,
  RotateCcw,
  Download,
  Plus,
  Youtube,
  Instagram,
  RefreshCw,
} from 'lucide-react';

// Modals
import HookModal from '../../components/HookModal.jsx';
import SubtitleModal from '../../components/SubtitleModal.jsx';
import ClipEditor from '../../components/ClipEditor.jsx';

// Custom TikTok Icon
const TikTokIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
  </svg>
);

export default function DashboardPage() {
  const {
    activeJobId,
    status,
    progress,
    logs,
    sourceMedia,
    result,
    isSubmitting,
    handleStartGeneration,
    handleReset,
  } = useClipGenerator();

  const dispatch = useAppDispatch();
  const { activeModal, activeClipIndex } = useAppSelector((state) => state.app);

  const [logsVisible, setLogsVisible] = useState(false);
  const [syncedTime, setSyncedTime] = useState(null);
  const [isSyncedPlaying, setIsSyncedPlaying] = useState(false);
  const [syncTrigger, setSyncTrigger] = useState(0);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const activeClip = result?.clips?.[activeClipIndex] || null;

  const handleClipRerendered = (index, data) => {
    dispatch(
      updateClipResult({
        index,
        updatedClip: {
          video_url: data.new_video_url,
          videoUrl: data.new_video_url,
        },
      })
    );
  };

  const handleDownloadAll = async () => {
    if (!result?.clips || result.clips.length === 0) return;
    setIsDownloadingAll(true);
    try {
      const res = await fetch(getApiUrl(`/api/jobs/${activeJobId}/download-all`));
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `openshorts_clips_${(activeJobId || '').slice(0, 8)}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else {
        // Fallback: trigger individual downloads
        result.clips.forEach((clip, idx) => {
          if (clip.video_url) {
            const a = document.createElement('a');
            a.href = getApiUrl(clip.video_url);
            a.download = `clip_${idx + 1}.mp4`;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            a.remove();
          }
        });
      }
    } catch (_) {
      result.clips.forEach((clip, idx) => {
        if (clip.video_url) {
          const a = document.createElement('a');
          a.href = getApiUrl(clip.video_url);
          a.download = `clip_${idx + 1}.mp4`;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      });
    } finally {
      setIsDownloadingAll(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 1. IDLE VIEW (Screenshots 2 & 3) */}
      {status === 'idle' && (
        <div className="h-full overflow-y-auto custom-scrollbar animate-fade">
          <div className="min-h-full flex flex-col items-center justify-center px-4 py-8 sm:p-6">
            <div className="max-w-xl w-full text-center space-y-5 sm:space-y-8">
              <div className="space-y-2.5 sm:space-y-4">
                <p className="eyebrow hidden sm:block">01 · CLIP GENERATOR</p>
                <h1 className="font-display lowercase text-3xl sm:text-4xl md:text-5xl text-ink font-semibold">
                  create viral shorts
                </h1>
                <p className="text-muted text-[15px] sm:text-lg leading-snug sm:leading-normal max-w-sm sm:max-w-none mx-auto">
                  Drop your long-form video below to instantly generate viral clips with AI.
                </p>
                <p className="text-xs text-muted">
                  Or let an agent do it:{' '}
                  <a
                    href="#app"
                    className="text-ink2 underline underline-offset-2 hover:text-brass transition-colors"
                  >
                    connect Claude, ChatGPT or n8n →
                  </a>
                </p>
              </div>

              {/* Media input form with Target Reels selector (1, 3, 5, 7, 9, 10) */}
              <MediaInput
                onProcess={handleStartGeneration}
                isProcessing={isSubmitting}
              />

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-muted text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <Youtube size={16} /> YouTube
                </span>
                <span className="flex items-center gap-2">
                  <Instagram size={16} /> Instagram
                </span>
                <span className="flex items-center gap-2">
                  <TikTokIcon size={16} /> TikTok
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROCESSING / COMPLETED / FAILED SPLIT VIEW (Screenshots 4 & 5) */}
      {(status === 'processing' || status === 'completed' || status === 'failed') && (
        <div className="flex-1 flex flex-col p-3 md:p-4 overflow-hidden animate-fade">
          {/* Top Bar with + new project button */}
          <div className="mb-3 shrink-0 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-rule text-xs font-mono text-muted hover:text-ink hover:border-brass/60 bg-paper2 hover:bg-paper3 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>new project</span>
            </button>

            {status === 'processing' && (
              <div className="flex items-center gap-2 text-xs font-mono text-muted">
                <span className="w-2 h-2 rounded-full bg-brass animate-ping" />
                <span>pipeline active</span>
              </div>
            )}
          </div>

          {/* Split Screen Container */}
          <div className="flex-1 flex flex-col md:flex-row gap-3 md:gap-4 overflow-y-auto md:overflow-y-hidden custom-scrollbar min-h-0">
            {/* Left Panel: Live Analysis & Logs */}
            <div
              className={`${
                status === 'completed' ? 'w-full md:w-[32%] lg:w-[28%]' : 'w-full md:w-[55%] lg:w-[58%]'
              } md:h-full flex flex-col shrink-0 md:shrink card p-3.5 sm:p-5 md:overflow-y-auto custom-scrollbar transition-all duration-700 ease-in-out`}
            >
              <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2 shrink-0">
                <h2 className="text-sm font-medium text-ink lowercase flex items-center gap-2">
                  <Activity
                    className={`text-brass ${status === 'processing' ? 'animate-pulse' : ''}`}
                    size={18}
                  />
                  <span>live analysis</span>
                </h2>
                <span
                  className={
                    status === 'processing'
                      ? 'badge-brass'
                      : status === 'completed'
                      ? 'badge-ok'
                      : 'badge-danger'
                  }
                >
                  {status === 'completed'
                    ? 'COMPLETE'
                    : status === 'failed'
                    ? 'ERROR'
                    : 'PROCESSING'}
                </span>
              </div>

              {/* Video Preview & Radar Scanner Animation */}
              {sourceMedia && (
                <div className="shrink-0 mb-3">
                  <ProcessingAnimation
                    media={sourceMedia}
                    isComplete={status === 'completed'}
                    syncedTime={syncedTime}
                    isSyncedPlaying={isSyncedPlaying}
                    syncTrigger={syncTrigger}
                  />
                </div>
              )}

              {/* System Logs Terminal Accordion */}
              <div
                className={`bg-paper rounded-card border border-rule overflow-hidden flex flex-col transition-all duration-500 ${
                  status === 'completed'
                    ? `min-h-0 opacity-60 hover:opacity-100 ${logsVisible ? 'h-48' : 'h-auto'}`
                    : `flex-1 ${logsVisible ? 'min-h-[160px] sm:min-h-[220px]' : 'min-h-[120px]'}`
                }`}
              >
                <button
                  type="button"
                  onClick={() => setLogsVisible((v) => !v)}
                  className="w-full px-3.5 sm:px-4 py-2 border-b border-rule flex items-center justify-between gap-2 bg-paper2 shrink-0 text-left cursor-pointer"
                >
                  <span className="readout flex items-center gap-2">
                    <Terminal size={12} /> System Logs
                  </span>
                  <span className="flex items-center gap-2 text-muted text-xs">
                    {logs && logs.length > 0 && (
                      <span className="readout normal-case">{logs.length}</span>
                    )}
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-300 ${
                        logsVisible ? 'rotate-180' : ''
                      }`}
                    />
                  </span>
                </button>

                <div
                  className={`flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-1.5 custom-scrollbar text-muted break-words bg-black/60 ${
                    !logsVisible && status === 'completed' ? 'hidden' : 'block'
                  }`}
                >
                  {logs && logs.length > 0 ? (
                    logs.map((log, i) => (
                      <div
                        key={i}
                        className={`flex gap-2 ${
                          log.toLowerCase().includes('error') || log.toLowerCase().includes('fail')
                            ? 'text-danger'
                            : log.includes('🔴') || log.includes('Live')
                            ? 'text-brass'
                            : 'text-muted'
                        }`}
                      >
                        <span className="min-w-0 break-words">{log}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted/60">No logs yet...</div>
                  )}
                  {status === 'processing' && (
                    <div className="animate-pulse text-brass">_</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel: Results / Waiting State */}
            <div
              className={`${
                status === 'completed' ? 'w-full md:w-[68%] lg:w-[72%]' : 'w-full md:w-[45%] lg:w-[42%]'
              } md:h-full flex flex-col shrink-0 md:shrink card p-3.5 sm:p-5 transition-all duration-700 ease-in-out`}
            >
              {/* Header Strip */}
              <div className="mb-3 sm:mb-4 shrink-0 flex items-center justify-between gap-2 border-b border-rule/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-display lowercase text-lg sm:text-xl text-ink font-medium">
                    generated shorts
                  </h2>
                  {result?.clips?.length > 0 && (
                    <span className="readout bg-paper3 px-2.5 py-0.5 rounded-full text-xs text-brass">
                      {result.clips.length} Clips
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {result?.clips?.length > 0 && status === 'completed' && (
                    <button
                      onClick={handleDownloadAll}
                      disabled={isDownloadingAll}
                      className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Download all generated clips"
                    >
                      {isDownloadingAll ? (
                        <>
                          <Loader2 size={13} className="animate-spin text-brass" />
                          <span>downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download size={13} />
                          <span>download all</span>
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1.5 text-muted hover:text-ink cursor-pointer"
                    title="Start over with a new video"
                  >
                    <RotateCcw size={12} />
                    <span>new video</span>
                  </button>
                </div>
              </div>

              {/* Body: Waiting Spinner OR Result Cards Grid */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                {result?.clips?.length > 0 ? (
                  <div className="grid gap-4 pb-10 grid-cols-[repeat(auto-fill,minmax(min(100%,580px),1fr))]">
                    {result.clips.map((clip, i) => (
                      <ResultCard
                        key={`${activeJobId}-${i}-${clip.video_url || ''}`}
                        clip={clip}
                        index={i}
                        jobId={activeJobId}
                        onEditClip={(idx) => dispatch(openModal({ modal: 'reframe', clipIndex: idx }))}
                        onReframeClip={(idx) => dispatch(openModal({ modal: 'reframe', clipIndex: idx }))}
                        onModeChanged={handleClipRerendered}
                        onPlay={(time) => {
                          setSyncedTime(time);
                          setIsSyncedPlaying(true);
                          setSyncTrigger((c) => c + 1);
                        }}
                        onPause={() => setIsSyncedPlaying(false)}
                        clipCount={result.clips.length}
                      />
                    ))}
                  </div>
                ) : status === 'processing' ? (
                  <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-muted space-y-3 text-center px-4">
                    <Loader2 size={30} className="animate-spin text-brass" />
                    <p className="text-sm lowercase font-medium text-ink2">waiting for clips...</p>
                    <p className="text-xs text-muted/80 max-w-[28ch] leading-snug">
                      They appear here one by one as each finishes rendering.
                    </p>
                  </div>
                ) : status === 'failed' ? (
                  <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-danger space-y-3">
                    <p className="text-sm font-medium">Generation failed.</p>
                    <button
                      onClick={handleReset}
                      className="btn-primary text-xs px-4 py-2"
                    >
                      Try Again
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editing Modals */}
      {activeModal === 'hook' && activeClip && (
        <HookModal
          jobId={activeJobId}
          clip={activeClip}
          index={activeClipIndex}
          onClose={() => dispatch(closeModal())}
        />
      )}

      {activeModal === 'subtitle' && activeClip && (
        <SubtitleModal
          jobId={activeJobId}
          clip={activeClip}
          clipIndex={activeClipIndex}
          onClose={() => dispatch(closeModal())}
        />
      )}

      {activeModal === 'reframe' && activeClip && (
        <ClipEditor
          jobId={activeJobId}
          clip={activeClip}
          clipIndex={activeClipIndex}
          onClose={() => dispatch(closeModal())}
        />
      )}
    </div>
  );
}
