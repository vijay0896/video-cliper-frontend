/**
 * @file src/components/layout/AppLayout.jsx
 * @description Central Application Shell wrapping Header, Sidebar, and Viewport Outlet
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';
import { MobileTabBar } from './MobileTabBar.jsx';
import { ErrorBoundary } from '../common/ErrorBoundary.jsx';

export const AppLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-paper text-ink2 font-sans antialiased">
      {/* Desktop Sidebar Rail */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>

        {/* Mobile Tab Bar */}
        <MobileTabBar />
      </div>
    </div>
  );
};

