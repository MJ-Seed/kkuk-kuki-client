const CACHE_NAME = 'kkuk-kuki-cache-v1';

// 캐시할 파일 목록 - 기본 파일만 캐시
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png'
];

// 서비스 워커 설치 시 캐시 생성
self.addEventListener('install', (event) => {
  // 즉시 활성화
  self.skipWaiting();
  
  // 기본 파일만 캐시
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('캐시 생성 완료');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('캐시 생성 실패:', error);
      })
  );
});

// 네트워크 요청 처리 - 가장 단순한 방식 사용
self.addEventListener('fetch', (event) => {
  // 네트워크 우선, 실패 시에만 캐시 사용
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// 이전 버전의 캐시 정리
self.addEventListener('activate', (event) => {
  self.clients.claim();
  
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        }).filter(Boolean)
      );
    })
  );
});
