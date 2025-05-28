import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// 개발 환경인지 프로덕션 환경인지 확인
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  // 개발 환경에서는 기본 경로, 프로덕션(배포) 환경에서는 GitHub Pages 경로 사용
  base: isProduction ? '/kkuk-kuki/' : '/',
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  // HMR 설정 추가
  server: {
    hmr: {
      // 개발 서버의 WebSocket 연결 문제 해결
      overlay: true,
      clientPort: 5173,
    },
  },
  // 빌드 설정 - 해시 없는 파일명으로 변경
  build: {
    // 상대 경로로 자산 참조
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // 청크 파일 이름 패턴 설정 - 해시 제거
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
