/**
 * @file src/pages/Dashboard/components/MediaInputSection.jsx
 * @description Hero input component for YouTube URL, live stream, or local video file upload
 */
import React, { useState } from 'react';
import {
  Link2,
  UploadCloud,
  Sparkles,
  Sliders,
  Radio,
  FileVideo,
  CheckCircle,
} from 'lucide-react';
import { extractYouTubeId } from '../../../utils/formatters.js';

export const MediaInputSection = ({ onSubmit, isSubmitting }) => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'upload'
  const [targetClips, setTargetClips] = useState(3);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch (_) {
      /* clipboard read not permitted */
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'url') {
      if (!url.trim()) return;
      onSubmit({ url: url.trim(), options: { targetClips } });
    } else {
      if (!file) return;
      onSubmit({ file, options: { targetClips } });
    }
  };

  const isYouTube = extractYouTubeId(url);

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      {/* Title & Tagline */}
      <div className="text-center space-y-2.5">
        <h2 className="font-display lowercase text-3xl sm:text-4xl text-ink font-semibold tracking-tight">
          Turn long videos into viral shorts
        </h2>
        <p className="text-sm text-muted max-w-lg mx-auto">
          AI detects top viral hooks, generates word-level captions, and crops to 9:16 vertical shorts in seconds.
        </p>
      </div>

      {/* Input Card Container */}
      <div className="bg-paper2 border border-rule rounded-card p-6 shadow-card space-y-6">
        {/* Source Toggle Segmented Control */}
        <div className="inline-flex bg-paper3 p-1 rounded-xl text-xs border border-rule/50">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'url' ? 'bg-paper text-ink shadow-xs' : 'text-muted hover:text-ink'
            }`}
          >
            YouTube / Live Stream
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'upload' ? 'bg-paper text-ink shadow-xs' : 'text-muted hover:text-ink'
            }`}
          >
            Upload Video File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === 'url' ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink2 block">
                YouTube Video or Live Stream URL
              </label>
              <div className="relative flex items-center">
                <input
                  type="url"
                  placeholder="Paste YouTube link (e.g. https://youtu.be/... or @channel/live)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full h-12 pl-4 pr-24 rounded-input border border-rule bg-paper text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-2.5 px-3 py-1.5 text-xs text-muted hover:text-ink bg-paper3 rounded-md hover:bg-paper3/80 transition-colors cursor-pointer"
                >
                  Paste
                </button>
              </div>
              {isYouTube && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <CheckCircle size={12} />
                  <span>Valid YouTube link detected</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink2 block">Upload Local Video File</label>
              <label className="border-2 border-dashed border-rule hover:border-ink/50 rounded-input p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-paper/50">
                <UploadCloud size={28} className="text-muted" />
                <span className="text-xs text-ink font-medium">
                  {file ? file.name : 'Click to select or drag and drop MP4, MOV, or MKV'}
                </span>
                <span className="text-[11px] text-muted">Supports up to 500 MB</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Quick Target Clips Options */}
          <div className="flex items-center justify-between pt-2 border-t border-rule/60 text-xs">
            <span className="text-muted">Target Shorts Count:</span>
            <div className="inline-flex gap-1.5">
              {[1, 3, 5].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setTargetClips(cnt)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium border transition-colors cursor-pointer ${
                    targetClips === cnt
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-paper text-muted border-rule hover:text-ink'
                  }`}
                >
                  {cnt} {cnt === 1 ? 'clip' : 'clips'}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || (activeTab === 'url' ? !url.trim() : !file)}
            className="w-full h-12 rounded-input bg-ink text-paper font-medium text-sm hover:bg-ink2 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
          >
            <Sparkles size={16} />
            <span>{isSubmitting ? 'Submitting Pipeline...' : 'Generate Viral Clips'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

