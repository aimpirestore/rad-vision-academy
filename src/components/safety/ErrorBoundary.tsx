"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Error Boundary — isolates failures so a single broken component (e.g. the
 * 3D scene) never takes down the whole page.
 *
 * Phase 9 of the enterprise hardening brief: "Component isolation, error
 * recovery, safe fallback UI."
 *
 * Usage:
 *   <ErrorBoundary fallback={<StaticHero />}>
 *     <HeroScene />
 *   </ErrorBoundary>
 */
interface Props {
  children: ReactNode;
  /** What to render when the child throws. */
  fallback?: ReactNode;
  /** Called with the error — useful for telemetry / Sentry. */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** Optional label for logging. */
  name?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { onError, name } = this.props;
    if (onError) {
      onError(error, info);
    }
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(`[ErrorBoundary${name ? `: ${name}` : ""}]`, error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
