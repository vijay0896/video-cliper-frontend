/**
 * @file src/router/ProtectedRoute.jsx
 * @description Route security gate checking required credentials
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks.js';

export const ProtectedRoute = () => {
  const { geminiApiKey } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!geminiApiKey) {
    return <Navigate to="/settings" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

