// Service Worker for InstaGrowth Admin Panel
// Version 1.0.0 - Private Admin PWA

const CACHE_NAME = 'instagrowth-admin-v1';
const ADMIN_SCOPE = '/';

// Cache only essential admin static assets
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/orders.html',
    '/users.html',
    '/admin-auth.js',
    '/dashboard.js',
    '/orders.js',
    '/admin-styles.css',
    '/api-config.js'
];

// Install event - cache admin assets
self.addEventListener('install', (event) => {
    console.log('[Admin SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Admin SW] Caching admin assets');
                return cache.addAll(ASSETS_TO_CACHE.map(url => {
                    return new Request(url, { cache: 'reload' });
                })).catch(err => {
                    console.log('[Admin SW] Some assets failed to cache (this is OK)');
                });
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[Admin SW] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name.startsWith('instagrowth-admin-') && name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - network first for API, cache first for static assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Never cache API requests
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(fetch(request));
        return;
    }

    // Network first for HTML pages (always get fresh admin pages)
    if (request.mode === 'navigate' || request.destination === 'document') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone the response
                    const responseClone = response.clone();
                    // Update cache in background
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                    return response;
                })
                .catch(() => {
                    // Fallback to cache if offline
                    return caches.match(request).then((cached) => {
                        return cached || caches.match('/index.html');
                    });
                })
        );
        return;
    }

    // Cache first for static assets (JS, CSS, images)
    event.respondWith(
        caches.match(request)
            .then((cached) => {
                if (cached) {
                    // Return cached version and update in background
                    fetch(request).then((response) => {
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
                    }).catch(() => { }); // Ignore fetch errors in background
                    return cached;
                }

                // Not in cache, fetch from network
                return fetch(request)
                    .then((response) => {
                        // Don't cache if not a valid response
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clone and cache
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                        return response;
                    });
            })
    );
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[Admin SW] Service Worker loaded - Admin PWA ready');
