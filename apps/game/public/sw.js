// Bump when Pyodide changes: its files have no content hash and are served cache-first.
const CACHE_VERSION = 'v3';
const STATIC_CACHE = `venomous-snake-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `venomous-snake-dynamic-${CACHE_VERSION}`;
const PYODIDE_CACHE = `venomous-snake-pyodide-${CACHE_VERSION}`;

// Shell assets cached on install (relative to SW scope)
const SHELL_ASSETS = ['./', './index.html', './manifest.json', './sw.js'];

// Pyodide assets cached on first use
const PYODIDE_PATTERNS = [/pyodide/, /\.whl$/, /\.wasm$/];

function remember(event, cacheName, response) {
  if (!response.ok) return;
  const clone = response.clone();
  event.waitUntil(caches.open(cacheName).then((cache) => cache.put(event.request, clone)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(async (cache) => {
        await cache.addAll(SHELL_ASSETS);
        const manifest = await fetch(new URL('precache-manifest.json', self.registration.scope));
        const files = manifest.ok ? await manifest.json() : [];
        // One failed file must not cost the player the whole install.
        await Promise.allSettled(
          files.map((file) => cache.add(new URL(file, self.registration.scope))),
        );
      })
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
          remember(event, STATIC_CACHE, response);
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
          remember(event, PYODIDE_CACHE, response);
          return response;
        });
      }),
    );
    return;
  }

  // Static assets (JS/CSS with content hash): cache-first
  if (/[.-][A-Za-z0-9_-]{8,}\.(js|css|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          remember(event, STATIC_CACHE, response);
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
        remember(event, DYNAMIC_CACHE, response);
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
