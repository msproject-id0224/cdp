const CACHE_VERSION = 'cdp-v2';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const IMAGE_CACHE   = `${CACHE_VERSION}-images`;
const ALL_CACHES    = [STATIC_CACHE, IMAGE_CACHE];

const PRECACHE_ASSETS = [
    '/assets/img/logo-rmd.png',
    '/assets/img/background.webp',
    '/manifest.json',
];

// ─── Install: pre-cache static assets ─────────────────────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// ─── Activate: remove old caches ──────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((k) => !ALL_CACHES.includes(k))
                    .map((k) => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// ─── Fetch strategy ───────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;
    if (!request.url.startsWith(self.location.origin)) return;

    const url = new URL(request.url);

    // 1. Vite-built JS/CSS (hashed filenames) → cache-first, very long TTL
    if (url.pathname.startsWith('/build/')) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }

    // 2. Static image assets → cache-first with network fallback
    if (/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname)) {
        event.respondWith(cacheFirst(request, IMAGE_CACHE));
        return;
    }

    // 3. Fonts & manifest → cache-first
    if (/\.(woff2?|ttf|otf)$/i.test(url.pathname) || url.pathname === '/manifest.json') {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }

    // 4. HTML / Inertia page navigation → network-first, fall back to cache
    if (request.headers.get('Accept')?.includes('text/html')) {
        event.respondWith(networkFirst(request, STATIC_CACHE));
        return;
    }

    // 5. Everything else (API, XHR) → network only, no caching
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('Offline', { status: 503 });
    }
}

async function networkFirst(request, cacheName) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        return cached ?? caches.match('/');
    }
}
