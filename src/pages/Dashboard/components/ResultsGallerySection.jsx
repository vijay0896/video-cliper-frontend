/**
 * @file src/pages/Dashboard/components/ResultsGallerySection.jsx
 * @description Gallery container for generated 9:16 vertical shorts with download and editing tools
 */
import React from 'react';
import { RotateCcw, Download, Sparkles } from 'lucide-react';
import ResultCard from '../../../components/ResultCard.jsx';
import { useAppDispatch } from '../../../store/hooks.js';
import { updateClipResult } from '../../../store/slices/appSlice.js';

export const ResultsGallerySection = ({
  jobId,
  clips = [],
  onReset,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Gallery Header Strip */}
      <div className="flex items-center justify-between pb-4 border-b border-rule">
        <div className="flex items-center gap-2.5">
          <Sparkles size={18} className="text-amber-400" />
          <h2 className="font-display text-lg text-ink font-semibold">Generated Shorts ({clips.length})</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-rule text-xs text-muted hover:text-ink hover:bg-paper3 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>New Video</span>
          </button>
        </div>
      </div>

      {/* Grid of Generated Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clips.map((clip, index) => (
          <ResultCard
            key={clip.id || `${jobId}-${index}`}
            jobId={jobId}
            clip={clip}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

