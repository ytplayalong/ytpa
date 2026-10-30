// Service worker of YTPA.
//
// - Makes the web app installable (together with site.webmanifest).
// - Keeps pages, scores and the app code in a cache, so that the pieces that
//   were opened before still work with a bad connection or offline.
//
// Only requests to the own site are handled. YouTube, Firebase etc. are not
// touched and never cached.

const VERSION = "v1";
const STATIC_CACHE = `ytpa-static-${VERSION}`; // hashed files of the app, never change
const PAGES_CACHE = `ytpa-pages-${VERSION}`; // pages, scores (musicxml), images
const MAX_PAGE_ENTRIES = 300;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Remove the caches of older versions
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith("ytpa-") && !name.endsWith(VERSION))
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

/** Files with a hash in the name: from the cache if there, else load and keep. */
const cacheFirst = async (request) => {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
};

/** Removes the oldest entries if the cache gets too big. */
const trim = async (cache) => {
  const keys = await cache.keys();
  const surplus = keys.length - MAX_PAGE_ENTRIES;
  for (let i = 0; i < surplus; i++) {
    await cache.delete(keys[i]);
  }
};

/** Everything else: the current version if online, the cached one if not. */
const networkFirst = async (request) => {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      await cache.put(request, response.clone());
      trim(cache);
    }
    return response;
  } catch (err) {
    // Offline: the exact page, or the same page without the query (the piece
    // page gets its content from the query "?scoreId=...").
    const cached =
      (await cache.match(request)) ||
      (request.mode === "navigate"
        ? await cache.match(request, { ignoreSearch: true })
        : undefined);
    if (cached) {
      return cached;
    }
    throw err;
  }
};

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("range")) {
    return;
  }
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});
