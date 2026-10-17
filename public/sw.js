// AI HUB SUMMARY - Production Service Worker
const CACHE_NAME = 'ai-hub-summary-v13';

// تم استبعاد index.html و '/' حتى لا تُحبس الواجهة القديمة داخل الجهاز
const PRECACHE_ASSETS = [
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

  // تخطي بروتوكولات الإضافات والمتصفح غير المدعومة
  if (!url.protocol.startsWith('http')) return;

  // 1. صفحات التنقل الرئيسية (HTML): نطلبها من الشبكة دائماً أولاً لرؤية آخر تحديث فوراً
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // تحديث النسخة المحفوظة أوفلاين في الخلفية بالنسخة الجديدة
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone).catch(() => {});
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // في حال انقطاع الإنترنت تماماً: الرجوع للنسخة المخزنة في الكاش
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(event.request);
          if (cached) return cached;
          return (await cache.match('/index.html')) || (await cache.match('/'));
        })
    );
    return;
  }

  // 2. باقي الملفات والمحتوى الدراسي
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const response = await fetch(event.request);
        if (response && response.status === 200) {
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
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        throw networkError;
      }
    })
  );
});
