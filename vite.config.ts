import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// 개발 환경인지 프로덕션 환경인지 확인
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],

  // 개발 환경에서는 '/', 프로덕션 환경에서는 '/kkuk-kuki/' 사용
  base: isProduction ? '/kkuk-kuki/' : '/',

  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },

  server: {
    // 여기에 기존 서버 설정이 있다면 유지
  },
});