/**
 * @file src/pages/ThumbnailStudio/index.jsx
 * @description YouTube Studio & Thumbnail generation domain page view
 */
import React from 'react';
import ThumbnailStudio from '../../components/ThumbnailStudio.jsx';

export default function ThumbnailStudioPage() {
  const geminiApiKey = localStorage.getItem('gemini_key') || '';
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ThumbnailStudio geminiApiKey={geminiApiKey} />
    </div>
  );
}

