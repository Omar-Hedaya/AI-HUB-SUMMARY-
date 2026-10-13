// AI HUB SUMMARY - Production Service Worker
const CACHE_NAME = 'ai-hub-summary-v12';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192.svg',
  '/icon-512.svg',
  '/index.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-caching non-fatal warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && !key.startsWith('ai-hub-docs')) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip chrome-extension and non-http(s) schemes
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const response = await fetch(event.request);
        if (response && response.status === 200) {
          // Cache same-origin assets, CDN styles, and github raw content
          if (
            url.origin === self.location.origin ||
            url.hostname.includes('tailwind') ||
            url.hostname.includes('github') ||
            url.hostname.includes('raw.githubusercontent.com')
          ) {
            cache.put(event.request, response.clone()).catch(() => {});
          }
        }
        return response;
      } catch (networkError) {
        // Fallback to cache on network failure
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Navigation fallback for SPA/standalone mode
        if (event.request.mode === 'navigate') {
          const fallback = await cache.match('/') || await cache.match('/index.html');
          if (fallback) return fallback;
        }

        throw networkError;
      }
    })
  );
});
