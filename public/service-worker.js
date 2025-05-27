const CACHE_NAME = 'kkuk-kuki-cache-v1';

// 캐시할 파일 목록
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
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('캐시 생성 완료');
        return cache.addAll(urlsToCache);
      })
  );
});

// 네트워크 요청 가로채서 캐시된 응답 반환
self.addEventListener('fetch', (event) => {
  // 안전한 요청만 처리
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  // 요청 방식이 GET이 아닌 경우 무시
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시된 응답 반환
        if (response) {
          return response;
        }
        
        // 캐시에 없으면 네트워크 요청
        return fetch(event.request.url, {
          headers: event.request.headers,
          mode: 'no-cors' // CORS 오류 방지
        })
        .then(response => {
          // 응답이 유효하지 않으면 그대로 반환
          if (!response || response.status !== 200) {
            return response;
          }
          
          // 현재 요청이 캐시 가능한 요청인지 확인
          if (event.request.url.startsWith('http')) {
            // 응답 복제
            const responseToCache = response.clone();
            
            // 비동기적으로 캐시에 저장
            caches.open(CACHE_NAME)
              .then(cache => {
                // 안전하게 캐시 저장 시도
                try {
                  cache.put(event.request, responseToCache);
                } catch (e) {
                  console.log('캐시 저장 오류:', e);
                }
              });
          }
          
          return response;
        })
        .catch(error => {
          console.log('페치 오류:', error);
          // 오류 발생 시 기본 응답 반환
          return new Response('Network error occurred', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});

// 이전 버전의 캐시 정리
self.addEventListener('activate', (event) => {
  // 즉시 활성화
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
