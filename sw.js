// =============================================
// Subjects Online — Service Worker (PWA)
// =============================================

const CACHE_NAME = 'subjects-online-v1';
const DYNAMIC_CACHE = 'subjects-online-dynamic-v1';

// الملفات اللي هتتحفظ في الـ cache من أول مرة
const STATIC_ASSETS = [
  '/welcome.html',
  '/index.html',
  '/login.html',
  '/dashboard.html',
  '/browse.html',
  '/profile.html',
  '/favorites.html',
  '/player.html',
  '/quizzes.html',
  '/chapters.html',
  '/sections.html',
  '/subject.html',
  '/essays.html',
  '/manifest.json',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/js/page-transition.js',
  '/js/auth.js',
  '/js/shared-nav.js',
  '/js/firebase-config.js',
  '/js/premium-effects.js',
  '/js/splash.js',
];

// ========================
// INSTALL — تحميل الـ cache
// ========================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      // نحفظ كل ملف بشكل منفصل عشان لو ملف فشل ما يوقفش الباقي
      return Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] Failed to cache:', url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// ========================
// ACTIVATE — مسح الـ caches القديمة
// ========================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ========================
// FETCH — استراتيجية Cache First مع Network Fallback
// ========================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل الـ requests غير HTTP/HTTPS
  if (!request.url.startsWith('http')) return;

  // تجاهل Firebase وخدمات خارجية — دايماً من النت
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('google') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('gstatic') ||
    url.hostname.includes('firestore') ||
    url.hostname.includes('tailwindcss') ||
    url.hostname.includes('fonts')
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // موجود في الـ cache — رجّعه فوراً
        return cachedResponse;
      }

      // مش موجود — اجيبه من النت واحفظه
      return fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type !== 'opaque'
          ) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // offline fallback
          if (request.destination === 'document') {
            return caches.match('/welcome.html');
          }
        });
    })
  );
});

// ========================
// BACKGROUND SYNC (optional)
// ========================
self.addEventListener('sync', (event) => {
  console.log('[SW] Background Sync:', event.tag);
});

// ========================
// PUSH NOTIFICATIONS (placeholder)
// ========================
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Subjects Online';
  const options = {
    body: data.body || 'لديك إشعار جديد',
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/welcome.html' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data.url || '/welcome.html';
  event.waitUntil(clients.openWindow(url));
});
