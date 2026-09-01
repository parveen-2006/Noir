import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Noir] Unhandled rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-900">
          <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-6 shadow-xl">
            <h1 className="text-xl font-bold text-red-700">The application could not load</h1>
            <p className="mt-3 text-sm text-slate-700">{this.state.error.message || 'An unexpected rendering error occurred.'}</p>
            <p className="mt-3 text-xs text-slate-500">Open the browser console for the full error details.</p>
            <button className="mt-5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold" onClick={() => window.location.reload()}>
              Reload application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
