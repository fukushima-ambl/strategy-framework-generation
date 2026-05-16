import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-6 max-w-lg w-full">
            <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">
              表示中にエラーが発生しました
            </p>
            <p className="text-xs text-red-500 dark:text-red-400 mb-4 font-mono break-all">
              {this.state.error}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: '' })}
              className="text-sm px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 transition-colors"
            >
              再試行
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
