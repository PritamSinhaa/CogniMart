import { Component } from "react";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    /*
     * Keep detailed logs in development.
     * Later this can be connected to an
     * error-monitoring service.
     */
    if (import.meta.env.DEV) {
      console.error("Unhandled React error:", error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
            <AlertTriangle size={26} />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-red-500">
            Application error
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            CogniMart encountered an unexpected problem. Your account and saved
            data have not been removed.
          </p>

          {import.meta.env.DEV && this.state.error?.message && (
            <div className="mt-4 overflow-x-auto rounded-xl bg-slate-100 px-3 py-2 text-left dark:bg-slate-950">
              <code className="text-xs text-red-600 dark:text-red-400">
                {this.state.error.message}
              </code>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <RefreshCw size={16} />
              Reload page
            </button>

            <button
              type="button"
              onClick={this.handleGoHome}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <Home size={16} />
              Go to home
            </button>
          </div>
        </div>
      </main>
    );
  }
}
