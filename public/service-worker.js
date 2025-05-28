const CACHE_NAME = 'kkuk-kuki-cache-v2';

// 캐시할 파일 목록
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  // 자산 파일도 캐시 (패턴 매칭 사용)
  './assets/'
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

  // 자산 파일(JS, CSS 등)에 대한 요청인지 확인
  const isAssetRequest = event.request.url.includes('/assets/');

  if (isAssetRequest) {
    // 자산 파일은 네트워크 우선, 캐시 폴백 전략 사용
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 응답 복제
          const responseToCache = response.clone();
          
          // 캐시에 저장
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // 네트워크 실패 시 캐시에서 시도
          return caches.match(event.request);
        })
    );
  } else {
    // 일반 파일은 캐시 우선, 네트워크 폴백 전략 사용
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // 캐시에 있으면 캐시된 응답 반환
          if (response) {
            // 백그라운드에서 네트워크 요청으로 캐시 업데이트
            fetch(event.request)
              .then(networkResponse => {
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, networkResponse.clone());
                  });
              })
              .catch(error => {
                console.log('백그라운드 캐시 업데이트 실패:', error);
              });
              
            return response;
          }
          
          // 캐시에 없으면 네트워크 요청
          return fetch(event.request)
            .then(response => {
              // 응답이 유효하지 않으면 그대로 반환
              if (!response || response.status !== 200) {
                return response;
              }
              
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
  }
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
            console.log('이전 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        }).filter(Boolean)
      );
    })
  );
  
  // 활성화 후 모든 클라이언트에 메시지 전송
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'CACHE_UPDATED',
        message: '새 버전이 설치되었습니다.'
      });
    });
  });
});
