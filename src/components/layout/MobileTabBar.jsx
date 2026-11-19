/**
 * @file src/components/layout/MobileTabBar.jsx
 * @description Mobile bottom tab bar for quick switching between main primary views
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from './sidebar.types.js';

export const MobileTabBar = () => {
  const primaryTabs = NAVIGATION_ITEMS.filter((t) => t.primary || t.id === 'settings');

  return (
    <nav className="md:hidden shrink-0 border-t border-rule bg-paper2/95 backdrop-blur-md safe-bottom z-30">
      <div className="flex items-stretch justify-around">
        {primaryTabs.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex-1 py-2.5 flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-ink' : 'text-muted'
                }`
              }
            >
              <Icon size={18} />
              <span className="leading-none">{item.short}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

