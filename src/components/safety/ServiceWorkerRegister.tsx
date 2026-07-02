"use client";

import { useEffect } from "react";

/**
 * Registers the service worker on the client after first paint.
 * Enabled only in production to avoid caching headaches during dev.
 *
 * This powers the offline / instant-repeat-load layer (Phase 6).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => {
          // Non-fatal: site still works without SW caching.
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.warn("[sw] registration failed:", err.message);
          }
        });
    };

    // Wait for the page to be idle so SW registration never blocks first load.
    if ("requestIdleCallback" in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(register);
    } else {
      setTimeout(register, 2000);
    }
  }, []);

  return null;
}
