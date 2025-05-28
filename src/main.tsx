import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 서비스 워커 등록하기
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('서비스 워커 등록 성공:', registration.scope);
        
        // 서비스 워커 업데이트 확인
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('새 버전이 설치되었습니다. 페이지를 새로고침합니다.');
                // 사용자에게 알림 후 새로고침
                if (confirm('새 버전이 설치되었습니다. 페이지를 새로고침하시겠습니까?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch(error => {
        console.log('서비스 워커 등록 실패:', error);
      });
    
    // 서비스 워커로부터 메시지 수신
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        console.log('서비스 워커 메시지:', event.data.message);
        // 사용자에게 알림 후 새로고침
        if (confirm('새 버전이 설치되었습니다. 페이지를 새로고침하시겠습니까?')) {
          window.location.reload();
        }
      }
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
