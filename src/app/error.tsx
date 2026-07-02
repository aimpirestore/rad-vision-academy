"use client";

/**
 * Route-level error boundary.
 * Catches errors thrown in any Server Component or route segment below this
 * file's location (src/app/). The user sees a friendly recovery UI instead
 * of a blank white page or a 500 stack trace.
 */

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console / telemetry. Wire up Sentry here in production.
    // eslint-disable-next-line no-console
    console.error("[route-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10">
          <svg className="h-8 w-8 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-brand-black">Something went wrong</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-dark-grey">
          An unexpected error occurred while loading this page. You can try again,
          or head back to the homepage.
        </p>
        {error.digest && (
          <p className="mt-4 text-xs text-slate-400">Error ID: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-red-deep hover:-translate-y-0.5"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-brand-black/10 px-6 py-3 text-sm font-semibold text-brand-black transition-all hover:border-brand-black/20"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
