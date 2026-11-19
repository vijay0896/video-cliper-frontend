/**
 * @file src/components/layout/Sidebar.jsx
 * @description Desktop collapsible side navigation rail and responsive slide-out mobile drawer
 */
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useLayout } from '../../context/LayoutContext.jsx';
import { NAVIGATION_ITEMS } from './sidebar.types.js';

export const Sidebar = () => {
  const { sidebarOpen, closeSidebar, isCollapsed, toggleCollapse } = useLayout();

  return (
    <>
      {/* Desktop Persistent Collapsible Sidebar */}
      <aside
        className={`hidden md:flex ${
          isCollapsed ? 'w-16 overflow-visible' : 'w-60 overflow-hidden'
        } bg-paper2 border-r border-rule flex-col h-full shrink-0 select-none transition-[width] duration-300 ease-in-out relative z-20`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 border-b border-rule flex items-center shrink-0 ${
            isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          } transition-all`}
        >
          {isCollapsed ? (
            <button
              type="button"
              onClick={toggleCollapse}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-paper3/60 transition-colors group cursor-pointer"
              title="Expand sidebar (⌘B)"
              aria-label="Expand sidebar"
            >
              <div className="w-8 h-8 rounded-lg bg-paper3 border border-rule flex items-center justify-center shrink-0 overflow-hidden shadow-xs group-hover:border-brass/50 transition-colors">
                <img src="/logo-openshorts.png" alt="OpenShorts" className="w-full h-full object-cover" />
              </div>
            </button>
          ) : (
            <>
              <Link to="/" className="flex items-center gap-3 min-w-0 overflow-hidden group">
                <div className="w-8 h-8 rounded-lg bg-paper3 border border-rule flex items-center justify-center shrink-0 overflow-hidden shadow-xs group-hover:border-brass/50 transition-colors">
                  <img src="/logo-openshorts.png" alt="OpenShorts" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-display lowercase text-base text-ink font-semibold tracking-tight truncate">
                    openshorts
                  </span>
                  <span className="text-[10px] text-muted font-mono tracking-wider uppercase truncate">
                    AI Video Clipper
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={toggleCollapse}
                className="p-1.5 text-muted hover:text-ink rounded-lg hover:bg-paper3 transition-colors shrink-0 cursor-pointer"
                title="Collapse sidebar (⌘B)"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={18} />
              </button>
            </>
          )}
        </div>

        {/* Desktop Nav Links */}
        {isCollapsed ? (
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-visible">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative group flex justify-center">
                  <NavLink
                    to={item.path}
                    title={`${item.label} (${item.byok ? `BYOK ${item.ord}` : item.ord})`}
                    className={({ isActive }) =>
                      `relative flex items-center justify-center w-10 h-10 rounded-input transition-all ${
                        isActive
                          ? 'bg-paper3 text-ink shadow-xs border border-rule/50'
                          : 'text-muted hover:text-ink hover:bg-paper3/40'
                      }`
                    }
                  >
                    <Icon size={18} className="shrink-0" />
                  </NavLink>

                  {/* Hover tooltip for collapsed mode */}
                  <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-paper3 border border-rule text-ink text-xs font-medium shadow-xl whitespace-nowrap">
                    <span>{item.label}</span>
                    <span className="text-[10px] font-mono text-muted/70">
                      {item.byok ? `BYOK ${item.ord}` : item.ord}
                    </span>
                  </div>
                </div>
              );
            })}
          </nav>
        ) : (
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative w-full flex items-center justify-between px-3 py-2.5 rounded-input text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-paper3 text-ink shadow-xs border border-rule/50'
                        : 'text-muted hover:text-ink hover:bg-paper3/40'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon size={17} className="shrink-0" />
                    <span className="truncate lowercase">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted/60 shrink-0">
                    {item.byok ? `BYOK ${item.ord}` : item.ord}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        )}

        {/* Desktop Sidebar Bottom Collapse/Expand Footer */}
        <div className={`p-2 sm:p-3 border-t border-rule mt-auto ${isCollapsed ? 'flex justify-center' : ''}`}>
          {isCollapsed ? (
            <div className="relative group flex justify-center">
              <button
                type="button"
                onClick={toggleCollapse}
                className="w-10 h-10 flex items-center justify-center rounded-input text-muted hover:text-ink hover:bg-paper3/40 transition-colors cursor-pointer"
                title="Expand sidebar (⌘B)"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen size={18} />
              </button>
              <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-paper3 border border-rule text-ink text-xs font-medium shadow-xl whitespace-nowrap">
                <span>Expand sidebar</span>
                <kbd className="text-[10px] font-mono text-muted/70 bg-paper/60 px-1 py-0.5 rounded border border-rule/50">
                  ⌘B
                </kbd>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={toggleCollapse}
              className="w-full flex items-center justify-between px-3 py-2 rounded-input text-xs font-medium text-muted hover:text-ink hover:bg-paper3/40 transition-colors cursor-pointer group"
              title="Collapse sidebar (⌘B)"
              aria-label="Collapse sidebar"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <PanelLeftClose size={16} className="shrink-0 text-muted group-hover:text-ink transition-colors" />
                <span className="truncate">Collapse sidebar</span>
              </div>
              <kbd className="text-[10px] font-mono text-muted/60 bg-paper3/80 px-1.5 py-0.5 rounded border border-rule/50">
                ⌘B
              </kbd>
            </button>
          )}
        </div>
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

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `relative w-full flex items-center justify-between px-3 py-2.5 rounded-input text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-paper3 text-ink shadow-xs border border-rule/50'
                          : 'text-muted hover:text-ink hover:bg-paper3/40'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon size={17} className="shrink-0" />
                      <span className="truncate lowercase">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted/60 shrink-0">
                      {item.byok ? `BYOK ${item.ord}` : item.ord}
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

