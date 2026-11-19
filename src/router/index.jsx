/**
 * @file src/router/index.jsx
 * @description Central routing configuration with AppLayout shell and code-split routes
 */
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout.jsx';
import { TableSkeleton } from '../components/common/TableSkeleton.jsx';

// Code-split Lazy Loaded Pages
const DashboardPage = lazy(() => import('../pages/Dashboard/index.jsx'));
const ThumbnailStudioPage = lazy(() => import('../pages/ThumbnailStudio/index.jsx'));
const SettingsPage = lazy(() => import('../pages/Settings/index.jsx'));
const LegalPage = lazy(() => import('../pages/Legal/index.jsx'));

const PageFallback = () => (
  <div className="p-8 max-w-4xl mx-auto">
    <TableSkeleton rows={4} />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'ai-agent',
        element: <Navigate to="/" replace />,
      },
      {
        path: 'thumbnails',
        element: (
          <Suspense fallback={<PageFallback />}>
            <ThumbnailStudioPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageFallback />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'legal',
        element: (
          <Suspense fallback={<PageFallback />}>
            <LegalPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

