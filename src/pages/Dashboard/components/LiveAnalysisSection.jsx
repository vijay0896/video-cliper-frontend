/**
 * @file src/pages/Dashboard/components/LiveAnalysisSection.jsx
 * @description Real-time pipeline processing monitor with video scanline animation and terminal logs
 */
import React, { useEffect, useRef } from 'react';
import { Terminal, RotateCcw, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { extractYouTubeId } from '../../../utils/formatters.js';

export const LiveAnalysisSection = ({
  status,
  progress,
  logs,
  sourceMedia,
  onReset,
}) => {
  const terminalRef = useRef(null);

  // Auto scroll logs
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const youtubeId = sourceMedia?.type === 'url' ? extractYouTubeId(sourceMedia.payload) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-paper2 border border-rule rounded-card p-5 space-y-4 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {status === 'processing' && <Loader2 size={16} className="text-amber-400 animate-spin" />}
            {status === 'completed' && <CheckCircle2 size={16} className="text-emerald-400" />}
            {status === 'failed' && <AlertTriangle size={16} className="text-rose-400" />}
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-ink">
              {status === 'processing' ? 'Live Analysis & Ingestion' : status}
            </span>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rule text-xs text-muted hover:text-ink hover:bg-paper3 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>New Video</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted font-mono">
            <span>Overall Pipeline</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-paper3 rounded-full overflow-hidden border border-rule/50">
            <div
              className={`h-full transition-all duration-500 ${
                status === 'failed' ? 'bg-rose-500' : 'bg-ink'
              }`}
              style={{ width: `${Math.max(5, progress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Video Preview or Radar Scanner */}
      <div className="relative aspect-video bg-black rounded-card overflow-hidden border border-rule shadow-2xl flex items-center justify-center">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1`}
            title="Source Video Preview"
            className="w-full h-full pointer-events-none opacity-60"
            allow="autoplay"
          />
        ) : (
          <div className="text-muted text-xs font-mono">Media Source Loaded</div>
        )}

        {/* Cyber Scanning Line Overlay */}
        {status === 'processing' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse" />
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/80 rounded border border-white/10 text-[10px] font-mono text-amber-300">
              AUDIO_ANALYSIS: ACTIVE
            </div>
          </div>
        )}
      </div>

      {/* Terminal Logs Window */}
      <div className="bg-black/90 border border-rule rounded-card p-4 space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2 text-muted pb-2 border-b border-white/10 text-[11px]">
          <Terminal size={13} />
          <span>System Pipeline Execution Logs</span>
        </div>
        <div
          ref={terminalRef}
          className="h-44 overflow-y-auto custom-scrollbar space-y-1.5 text-ink2 text-[11px] leading-relaxed select-text"
        >
          {logs && logs.length > 0 ? (
            logs.map((log, index) => (
              <div
                key={index}
                className={
                  log.toLowerCase().includes('error') || log.toLowerCase().includes('fail')
                    ? 'text-rose-400 font-semibold'
                    : log.includes('🔴') || log.includes('Live')
                    ? 'text-amber-300'
                    : log.includes('complete') || log.includes('success')
                    ? 'text-emerald-400'
                    : 'text-neutral-300'
                }
              >
                <span className="text-muted select-none mr-2">&gt;</span>
                {log}
              </div>
            ))
          ) : (
            <div className="text-muted">Waiting for pipeline logs...</div>
          )}
        </div>
      </div>
    </div>
  );
};

