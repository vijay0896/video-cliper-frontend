/**
 * @file src/components/layout/Header.jsx
 * @description Application top navigation bar with status badges, desktop sidebar toggle, and mobile menu button
 */
import React from 'react';
import { Menu, Key, Sparkles, CheckCircle2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useLayout } from '../../context/LayoutContext.jsx';
import { useAppSelector } from '../../store/hooks.js';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from './sidebar.types.js';

export const Header = () => {
  const { toggleSidebar, isCollapsed, toggleCollapse } = useLayout();
  const location = useLocation();
  const { geminiApiKey } = useAppSelector((state) => state.auth);

  const activeNav = NAVIGATION_ITEMS.find((n) => n.path === location.pathname) || NAVIGATION_ITEMS[0];

  return (
    <header className="h-14 sm:h-16 border-b border-rule bg-paper/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 text-muted hover:text-ink rounded-lg hover:bg-paper2 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted hidden sm:inline">{activeNav.ord} ·</span>
          <h1 className="font-display lowercase text-base sm:text-lg text-ink font-medium">
            {activeNav.label}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Gemini API Key Status Badge */}
        <Link
          to="/settings"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer bg-paper2 hover:bg-paper3 text-ink2 border-rule"
          title="Manage API Keys in Settings"
        >
          {geminiApiKey ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-emerald-400">Gemini: Ready</span>
            </>
          ) : (
            <>
              <Key size={13} className="text-amber-500" />
              <span className="font-mono text-[11px] text-amber-400">Set API Key</span>
            </>
          )}
        </Link>
      </div>
    </header>
  );
};
