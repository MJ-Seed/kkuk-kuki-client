import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // GitHub Pages 하위 경로 배포
  base: '/kkuk-kuki/',

  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },

  server: {
    open: true,
    hmr: { overlay: true },
  },

  build: {
    assetsDir: 'assets',
  },
});
