/**
 * =====================================================================
 * memoly - サービスワーカー (sw.js)
 * ===================================================================== */

const CACHE_NAME = 'memoly-cache-v2.1.0-202609161915';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css?v=3',
  './app.js?v=3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // すぐに新しいService Workerを起動
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
  // HTTP/HTTPS 以外のリクエスト（拡張機能など）やGET以外の通信はキャッシュを通さない（エラー防止）
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // ネットワークから取得成功したら、それをキャッシュに保存して返す（常に最新を保つ）
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // オフライン時のみキャッシュから返す
        return caches.match(event.request);
      })
  );
});