/**
 * @file src/components/layout/Sidebar.jsx
 * @description Desktop side navigation rail and responsive slide-out mobile drawer
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, ExternalLink, Github, Globe } from 'lucide-react';
import { useLayout } from '../../context/LayoutContext.jsx';
import { NAVIGATION_ITEMS } from './sidebar.types.js';

export const Sidebar = () => {
  const { sidebarOpen, closeSidebar } = useLayout();

  const renderNavLinks = (isMobile = false) => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
      {NAVIGATION_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={isMobile ? closeSidebar : undefined}
            className={({ isActive }) =>
              `relative w-full flex items-center gap-3 px-3 py-2.5 rounded-input text-xs font-medium transition-all ${
                isActive
                  ? 'bg-paper3 text-ink shadow-xs border border-rule/50'
                  : 'text-muted hover:text-ink hover:bg-paper3/40'
              }`
            }
          >
            <Icon size={17} className="shrink-0" />
            <span className="truncate">{item.label}</span>
            
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-60 bg-paper2 border-r border-rule flex-col h-full shrink-0 select-none">
        {/* Brand Header */}
        <div className="h-16 border-b border-rule flex items-center px-5 gap-3">
          <div className="w-8 h-8 rounded-lg bg-paper3 border border-rule flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
            <img src="/logo-openshorts.png" alt="OpenShorts" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-display lowercase text-base text-ink font-semibold tracking-tight">
              openshorts
            </span>
            <span className="text-[10px] text-muted font-mono tracking-wider uppercase">AI Video Clipper</span>
          </div>
        </div>

        {/* Links */}
        {renderNavLinks(false)}

        
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={closeSidebar}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[80vw] bg-paper2 border-r border-rule h-full flex flex-col z-10 shadow-2xl">
            <div className="h-16 border-b border-rule flex items-center justify-between px-5">
              <div className="flex items-center gap-2.5">
                <img src="/logo-openshorts.png" alt="Logo" className="w-7 h-7 rounded object-cover" />
                <span className="font-display lowercase text-base text-ink font-semibold">openshorts</span>
              </div>
              <button
                onClick={closeSidebar}
                className="p-1.5 text-muted hover:text-ink rounded-lg hover:bg-paper3"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>

            {renderNavLinks(true)}
          </div>
        </div>
      )}
    </>
  );
};
