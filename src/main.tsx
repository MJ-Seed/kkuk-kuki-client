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
      })
      .catch(error => {
        console.log('서비스 워커 등록 실패:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
