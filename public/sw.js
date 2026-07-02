/* eslint-disable no-restricted-globals */
/**
 * RAD Vision Academy — Service Worker
 * -----------------------------------
 * Multi-layer caching for instant repeat loads (Phase 6 of the enterprise
 * performance brief).
 *
 * Strategies:
 *   - Static assets (_next/static, fonts, images):  Cache-first, long TTL.
 *   - Next.js RSC / HTML navigations:               Stale-while-revalidate.
 *   - Supabase API / auth:                          Network-only (never cache).
 *
 * Safe + self-healing: every response is cached only after a 200 OK, and a
 * `SKIP_SERVICE_WORKER` header on the request bypasses entirely (useful for
 * debugging). Stale caches are evicted via `activate` to avoid bloat.
 */

const CACHE_VERSION = "rad-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

// Max entries per cache to prevent unbounded growth.
const MAX_STATIC_ENTRIES = 200;
const MAX_PAGE_ENTRIES = 30;

// Asset extensions that go into the static cache.
const STATIC_ASSET_RE = /\.(?:js|css|woff2?|ttf|otf|svg|png|jpg|jpeg|webp|avif|gif|ico)$/i;

// Supabase host — never cache API/auth/realtime traffic.
const SUPABASE_HOST = "yjjbiofujzrfpfmyrddy.supabase.co";

self.addEventListener("install", (event) => {
  // Skip waiting so the new SW activates immediately on the next load.
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Evict caches from previous versions.
      const keys = await self.caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => self.caches.delete(k)),
      );
      // Take control of all open clients.
      await self.clients.claim();
    })(),
  );
});

/** Trim a cache to its max size, evicting oldest entries first. */
async function trimCache(cacheName: string, max: number) {
  const cache = await self.caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > max) {
    for (let i = 0; i < keys.length - max; i++) {
      await cache.delete(keys[i]);
    }
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests.
  if (request.method !== "GET") return;

  // Bypass if the request opts out.
  if (request.headers.get("X-Skip-Service-Worker") === "1") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Never intercept Supabase API / auth / realtime traffic.
  if (url.hostname === SUPABASE_HOST) return;

  // Never intercept cross-origin requests (analytics, fonts host, etc. are
  // handled by the browser cache + CDN, not by us).
  if (url.origin !== self.location.origin) return;

  // Chrome extension & non-http(s) requests — ignore.
  if (!url.protocol.startsWith("http")) return;

  // ── Static assets: cache-first ──────────────────────────────
  if (
    url.pathname.startsWith("/_next/static/") ||
    STATIC_ASSET_RE.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, MAX_STATIC_ENTRIES));
    return;
  }

  // ── Navigation (HTML) requests: stale-while-revalidate ──────
  if (request.mode === "navigate") {
    event.respondWith(staleWhileRevalidate(request, PAGE_CACHE, MAX_PAGE_ENTRIES));
    return;
  }

  // Everything else: fall through to the network.
});

async function cacheFirst(request: Request, cacheName: string, max: number) {
  const cache = await self.caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    // Refresh in the background without blocking.
    fetch(request)
      .then((res) => {
        if (res && res.status === 200) cache.put(request, res.clone());
      })
      .catch(() => {});
    return cached;
  }
  const networkResponse = await fetch(request);
  if (networkResponse && networkResponse.status === 200) {
    cache.put(request, networkResponse.clone());
    trimCache(cacheName, max);
  }
  return networkResponse;
}

async function staleWhileRevalidate(request: Request, cacheName: string, max: number) {
  const cache = await self.caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
        trimCache(cacheName, max);
      }
      return networkResponse;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}
