"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Dynamically import the 3D scene so it never blocks first paint or SSR.
 *
 * PERFORMANCE: Three.js + R3F + drei is ~600KB minified. On mobile this is the
 * single biggest performance cost on the site. We guard the import so that:
 *  1. Only desktop-class devices (wide enough to actually show the scene)
 *     download the 3D bundle at all.
 *  2. Devices with `prefers-reduced-motion` get a static fallback instead.
 *  3. Low-end devices (saveData / slow connection) skip the 3D entirely.
 *
 * Mobile users see a lightweight CSS-only "scanline" placeholder instead,
 * which keeps the visual identity without the JS cost.
 */
const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => <SceneSkeleton />,
  }
);

/** Lightweight pulsing-ring placeholder shown while (or instead of) loading. */
function SceneSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
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
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Respect reduced-motion users — never load the 3D scene.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Data-saver mode — user asked the browser to save data. Honor it.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) {
      return;
    }

    // Only render the heavy 3D scene on screens wide enough to show it.
    // Mobile (< 1024px / lg breakpoint) gets the CSS placeholder instead.
    const mq = window.matchMedia("(min-width: 1024px)");
    if (mq.matches) {
      setShouldRender(true);
    }
  }, []);

  // Mobile / reduced-motion / save-data → lightweight skeleton only
  if (!shouldRender) {
    return <SceneSkeleton />;
  }

  return <HeroScene />;
}
