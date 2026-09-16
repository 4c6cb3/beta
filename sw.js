/**
 * =====================================================================
 * memoly - サービスワーカー (sw.js)
 * ===================================================================== */

// v6に更新してキャッシュを完全にリセット
const CACHE_NAME = 'memoly-cache-v6';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css?v=6',
  './app.js?v=6'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // 古いキャッシュを確実に削除
          }
        })
      );
    })
  );
  self.clientsClaim();
});

self.addEventListener('fetch', (event) => {
  // ブラウザの拡張機能など（HTTP/HTTPS以外・GET以外）の通信は無視してエラーを防ぐ
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // ネットワーク通信が成功したら、常に最新をキャッシュに保存して返す
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // オフラインなどで通信に失敗した場合のみ、キャッシュから返す
        return caches.match(event.request);
      })
  );
});