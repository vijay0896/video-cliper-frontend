/**
 * @file src/context/LayoutContext.jsx
 * @description Layout drawer and sidebar navigation context
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const LayoutContext = createContext({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export const LayoutProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Close on Escape
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  return (
    <LayoutContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);

