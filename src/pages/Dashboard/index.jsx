/**
 * @file src/pages/Dashboard/index.jsx
 * @description Main Dashboard & Clip Generator domain page view
 */
import React from 'react';
import { useClipGenerator } from './hooks/useClipGenerator.js';
import { MediaInputSection } from './components/MediaInputSection.jsx';
import { LiveAnalysisSection } from './components/LiveAnalysisSection.jsx';
import { ResultsGallerySection } from './components/ResultsGallerySection.jsx';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { openModal, closeModal } from '../../store/slices/appSlice.js';

// Lazy or direct modal imports
import HookModal from '../../components/HookModal.jsx';
import SubtitleModal from '../../components/SubtitleModal.jsx';
import ClipEditor from '../../components/ClipEditor.jsx';

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

  const activeClip = result?.clips?.[activeClipIndex] || null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full">
      {status === 'idle' && (
        <MediaInputSection
          onSubmit={handleStartGeneration}
          isSubmitting={isSubmitting}
        />
      )}

      {(status === 'processing' || status === 'failed') && (
        <LiveAnalysisSection
          status={status}
          progress={progress}
          logs={logs}
          sourceMedia={sourceMedia}
          onReset={handleReset}
        />
      )}

      {status === 'completed' && (
        <ResultsGallerySection
          jobId={activeJobId}
          clips={result?.clips || []}
          onReset={handleReset}
          onOpenHookModal={(index) => dispatch(openModal({ modal: 'hook', clipIndex: index }))}
          onOpenSubtitleModal={(index) => dispatch(openModal({ modal: 'subtitle', clipIndex: index }))}
          onOpenReframeModal={(index) => dispatch(openModal({ modal: 'reframe', clipIndex: index }))}
        />
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

