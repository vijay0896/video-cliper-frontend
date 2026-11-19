/**
 * @file src/main.jsx
 * @description Application entry point with Redux Provider, RouterProvider, and Toast notifications
 */
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';
import { store } from './store/store.js';
import { router } from './router/index.jsx';
import { LayoutProvider } from './context/LayoutContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <LayoutProvider>
            <RouterProvider router={router} />
            <ToastContainer
              position="bottom-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              theme="dark"
            />
          </LayoutProvider>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
