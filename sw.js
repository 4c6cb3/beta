/**
 * =====================================================================
 * memoly - サービスワーカー (sw.js)
 * オフライン動作のためのファイルキャッシュと自動更新を管理
 * ===================================================================== */

// キャッシュバージョンを上げて古いキャッシュを一掃
const CACHE_NAME = 'memoly-cache-v2.1.0-202609161905';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] 新しいキャッシュを保存しています:', CACHE_NAME);
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
            console.log('[Service Worker] 古いキャッシュを削除しました:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clientsClaim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // ネットワーク通信が成功したら、最新のデータをキャッシュに保存して返す
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // オフラインなどで通信に失敗した場合のみ、キャッシュを返す
        return caches.match(event.request);
      })
  );
});