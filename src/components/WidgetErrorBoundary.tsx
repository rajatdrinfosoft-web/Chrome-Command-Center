import React from 'react';

interface WidgetErrorBoundaryProps {
  widgetId: string;
  children: React.ReactNode;
}

interface WidgetErrorBoundaryState {
  hasError: boolean;
}

export class WidgetErrorBoundary extends React.Component<WidgetErrorBoundaryProps, WidgetErrorBoundaryState> {
  state: WidgetErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): WidgetErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(`Widget failed: ${this.props.widgetId}`, error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-32 flex-col items-start justify-center gap-2 text-sm text-[var(--page-muted)]" role="alert">
        <strong className="text-[var(--page-ink)]">This widget is unavailable</strong>
        <span>{this.props.widgetId} failed to render.</span>
        <button
          type="button"
          onClick={() => this.setState({ hasError: false })}
          className="rounded-lg border border-[var(--surface-line)] px-3 py-1.5 text-xs text-[var(--page-ink)] hover:border-[var(--accent-color)]"
        >
          Try again
        </button>
      </div>
    );
  }
}
