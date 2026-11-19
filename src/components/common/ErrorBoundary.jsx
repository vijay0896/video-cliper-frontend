/**
 * @file src/components/common/ErrorBoundary.jsx
 * @description Enterprise Error Boundary with fallback recovery UI
 */
import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught runtime error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-paper2 border border-rule rounded-card p-6 text-center space-y-4 shadow-card">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="font-display text-lg text-ink font-semibold">Something went wrong</h2>
              <p className="text-xs text-muted mt-1">
                {this.state.error?.message || 'An unexpected error occurred while rendering this view.'}
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper rounded-input text-xs font-medium hover:bg-ink2 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

