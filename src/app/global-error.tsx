"use client";

/**
 * Global Error Boundary.
 * This catches errors that error.tsx cannot — specifically errors thrown
 * in the Root Layout itself. Must render its own <html> and <body>.
 * https://nextjs.org/docs/app/api-reference/file-conventions/error
 */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#FFFFFF",
          color: "#1A1A1A",
        }}
      >
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <div
              style={{
                width: "4rem",
                height: "4rem",
                margin: "0 auto 1.5rem",
                borderRadius: "9999px",
                background: "rgba(177, 18, 38, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#B11226",
              }}
            >
              !
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
              Application Error
            </h1>
            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: "#525252",
              }}
            >
              The application hit an unexpected error. Please try reloading the
              page. If the problem persists, the server may be restarting.
            </p>
            {error.digest && (
              <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#9ca3af" }}>
                Error ID: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                marginTop: "2rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "9999px",
                background: "#B11226",
                color: "#FFFFFF",
                border: "none",
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reload application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
