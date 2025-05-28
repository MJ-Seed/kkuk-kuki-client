const VERSION = 'v2';
const CACHE_NAME = `kkuk-kuki-cache-${VERSION}`;

// 현재 SW scope (= /kkuk-kuki/)를 베이스 경로로 계산
const BASE = self.registration.scope;   // 항상 슬래시로 끝남

const PRECACHE = [
  '',                // BASE 자체
  'index.html',
  'manifest.json',
  'favicon.png',
  'assets/main.js',  // vite build 결과 – 해시를 없앴으니 예측 가능
  'assets/vendor.js' // React 등 공통 번들
].map((p) => BASE + p);

self.addEventListener('install', (evt) => {
  self.skipWaiting();
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
});

self.addEventListener('fetch', (evt) => {
  // 네트워크 우선, 실패 시 캐시
  evt.respondWith(
    fetch(evt.request).catch(() => caches.match(evt.request))
  );
});

self.addEventListener('activate', (evt) => {
  self.clients.claim();
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
});
