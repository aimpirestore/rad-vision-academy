"use client";

/**
 * Adaptive Performance Engine
 * ---------------------------
 * Detects the visitor's device capability at runtime and assigns a
 * performance tier (1–4). All heavy features (3D, animations, effects)
 * read this tier and scale themselves accordingly.
 *
 * This solves two of the biggest pain points:
 *   1. "3D models sometimes load and sometimes fail on mobile" — low-end
 *      devices now get a static fallback instead of a crash.
 *   2. "Mobile animations are slow and laggy" — heavy animations are
 *      disabled on tier-3/4 devices.
 *
 * Detection signals (most reliable first):
 *   - prefers-reduced-motion (accessibility)
 *   - navigator.hardwareConcurrency (CPU cores)
 *   - navigator.deviceMemory (RAM in GB)
 *   - navigator.connection (effective network type)
 *   - WebGL context loss / failure
 */

export type PerfTier = 1 | 2 | 3 | 4;

export interface DeviceProfile {
  /** 1 = flagship desktop, 4 = ultra-low / no-GPU device */
  tier: PerfTier;
  /** Browser advertises ≥ N CPU logical cores */
  cores: number;
  /** Browser advertises ≥ N GB RAM (0 if unknown) */
  memory: number;
  /** True if the user requested reduced motion */
  reducedMotion: boolean;
  /** True if WebGL could be initialised */
  webglSupported: boolean;
  /** True if connection is slow (2g/3g/slow-4g) or saveData is on */
  slowConnection: boolean;
  /** "high" | "medium" | "low" — coarse GPU verdict */
  gpu: "high" | "medium" | "low" | "unknown";
}

/** Tier labels for logging / debugging. */
export const TIER_LABELS: Record<PerfTier, string> = {
  1: "Flagship (full effects)",
  2: "Capable (medium effects)",
  3: "Low-end (lightweight)",
  4: "Ultra-low (static fallback)",
};

/**
 * Probe the WebGL renderer string to bucket GPU capability.
 * Done once, lazily, with full cleanup.
 */
function detectGpu(): "high" | "medium" | "low" | "unknown" {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ||
      (canvas.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return "unknown";

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string)
      : (gl.getParameter(gl.RENDERER) as string);

    // Free the context immediately — we only needed the probe.
    const loseExt = gl.getExtension("WEBGL_lose_context");
    loseExt?.loseContext();

    const r = (renderer || "").toLowerCase();

    // High-end GPU indicators
    if (
      /rtx|radeon rx|apple m[1-9]|quadro|tesla|iris xe|arc a[0-9]/i.test(r) ||
      (/adreno/i.test(r) && /[6-9][0-9][0-9]/.test(r)) // Adreno 600+
    ) {
      return "high";
    }
    // Mid-range
    if (
      /intel|adreno|mali|powervr|apple/i.test(r) &&
      !/rtx|radeon rx|arc a[0-9]/i.test(r)
    ) {
      return "medium";
    }
    // Everything else = low
    return "low";
  } catch {
    return "unknown";
  }
}

function detectWebglSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

let cachedProfile: DeviceProfile | null = null;

/**
 * Detect the device's capability profile. Runs all probes once and caches
 * the result for the session. Safe to call from any client component.
 */
export function detectDevice(): DeviceProfile {
  if (cachedProfile) return cachedProfile;
  if (typeof window === "undefined") {
    // SSR safety: assume a mid-range device so nothing is force-disabled
    // during hydration. The client re-runs after mount.
    return {
      tier: 2,
      cores: 4,
      memory: 4,
      reducedMotion: false,
      webglSupported: true,
      slowConnection: false,
      gpu: "unknown",
    };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 0;

  // Network: saveData OR effectiveType 2g/3g/slow-4g
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const slowConnection =
    !!conn?.saveData ||
    conn?.effectiveType === "2g" ||
    conn?.effectiveType === "slow-2g" ||
    conn?.effectiveType === "3g";

  const webglSupported = detectWebglSupport();
  const gpu = detectGpu();

  // ── Tier calculation ────────────────────────────────────────────
  // Start optimistic and downgrade based on each signal.
  let tier: PerfTier = 1;
  const bump = (t: PerfTier) => {
    tier = Math.max(tier, t) as PerfTier;
  };

  // Accessibility override — always honor reduced-motion
  if (reducedMotion) {
    tier = 4;
  } else if (!webglSupported) {
    // No WebGL at all → static fallback
    tier = 4;
  } else {
    // CPU
    if (cores <= 2) bump(3);
    else if (cores <= 4) bump(2);

    // RAM
    if (memory > 0 && memory <= 2) bump(4);
    else if (memory > 0 && memory <= 4) bump(3);

    // GPU
    if (gpu === "low") bump(3);
    else if (gpu === "unknown") bump(2); // cautious

    // Network — don't download a 600KB 3D bundle on 2g/3g
    if (slowConnection) bump(4);
  }

  cachedProfile = {
    tier,
    cores,
    memory,
    reducedMotion,
    webglSupported,
    slowConnection,
    gpu,
  };

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.info(
      `[perf] Device tier ${tier} (${TIER_LABELS[tier]}) — cores=${cores} ram=${memory || "?"}GB gpu=${gpu} webgl=${webglSupported} slow=${slowConnection}`,
    );
  }

  return cachedProfile;
}

/** Convenience: should we render the full 3D hero scene? */
export function shouldRender3D(): boolean {
  const p = detectDevice();
  // Tier 1–2 → 3D OK. Tier 3–4 → static fallback.
  return p.tier <= 2 && p.webglSupported;
}

/** Convenience: should we enable heavy entrance animations? */
export function shouldAnimate(): boolean {
  return detectDevice().tier <= 2;
}
