const CACHE_VERSION = 'v2';
const STATIC_CACHE = `venomous-snake-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `venomous-snake-dynamic-${CACHE_VERSION}`;
const PYODIDE_CACHE = `venomous-snake-pyodide-${CACHE_VERSION}`;

// Shell assets cached on install (relative to SW scope)
const SHELL_ASSETS = ['./', './index.html', './manifest.json'];

// Pyodide assets cached on first use
const PYODIDE_PATTERNS = [/pyodide/, /\.whl$/, /\.wasm$/];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  // Clean old caches
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => !key.includes(CACHE_VERSION)).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Navigation: network-first, fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(new URL('./index.html', self.registration.scope).href)),
    );
    return;
  }

  // Pyodide/WASM: cache-first (these are large and don't change)
  if (PYODIDE_PATTERNS.some((p) => p.test(url.pathname))) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(PYODIDE_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      }),
    );
    return;
  }

  // Static assets (JS/CSS with content hash): cache-first
  if (/\.[a-f0-9]{8,}\.(js|css|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      }),
    );
    return;
  }

  // Everything else: stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
      return cached || fetchPromise;
    }),
  );
});

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
