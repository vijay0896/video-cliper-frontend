/**
 * @file src/context/LayoutContext.jsx
 * @description Layout drawer and sidebar navigation context with desktop collapse support
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LayoutContext = createContext({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
  isCollapsed: false,
  toggleCollapse: () => {},
  setIsCollapsed: () => {},
});

const STORAGE_KEY = 'openshorts_sidebar_collapsed';

export const LayoutProvider = ({ children }) => {
  // Mobile drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Desktop sidebar collapse state (persisted to localStorage)
  const [isCollapsed, setIsCollapsedState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const setIsCollapsed = useCallback((value) => {
    setIsCollapsedState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, [setIsCollapsed]);

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle desktop sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        const active = document.activeElement;
        const isInput =
          active &&
          (active.tagName === 'INPUT' ||
            active.tagName === 'TEXTAREA' ||
            active.isContentEditable);
        if (!isInput) {
          e.preventDefault();
          toggleCollapse();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCollapse]);

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        closeSidebar,
        isCollapsed,
        toggleCollapse,
        setIsCollapsed,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLayout = () => useContext(LayoutContext);


