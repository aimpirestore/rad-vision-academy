"use client";

import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/safety/ErrorBoundary";
import { shouldRender3D } from "@/lib/performance/detect";

/**
 * Dynamically import the 3D scene so it never blocks first paint or SSR.
 * Only loaded for tier 1–2 devices.
 */
const HeroScene = lazy(() =>
  import("@/components/three/HeroScene").then((m) => ({ default: m.HeroScene })),
);

/** Lightweight pulsing-ring placeholder shown while loading or as fallback. */
function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="relative h-40 w-40">
        <div className="absolute inset-0 animate-pulse-ring rounded-full border border-brand-red/30" />
        <div
          className="absolute inset-0 animate-pulse-ring rounded-full border border-brand-red/30"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute inset-0 m-auto h-24 w-24 rounded-full border-2 border-brand-red/40" />
      </div>
    </div>
  );
}

export function HeroSceneLoader() {
  // Gate the heavy import behind the device profile. Low-end devices and
  // those without WebGL never download the ~600KB Three.js bundle.
  const render3D = shouldRender3D();

  if (!render3D) {
    return <SceneFallback />;
  }

  return (
    <ErrorBoundary
      name="Hero3D"
      fallback={<SceneFallback />}
      onError={(err) => {
        // If the 3D scene ever fails at runtime, the user still sees the
        // animated ring placeholder instead of a broken hero.
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn("[HeroScene] 3D render failed, using fallback:", err.message);
        }
      }}
    >
      <Suspense fallback={<SceneFallback />}>
        <HeroScene />
      </Suspense>
    </ErrorBoundary>
  );
}
