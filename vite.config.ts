import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [react()],

    // GitHub Pages 하위 경로 배포
    base: isProd ? '/kkuk-kuki/' : '/',

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
      rollupOptions: {
        output: {
          // 해시 제거 – service-worker가 파일 이름 예측하기 편함
          chunkFileNames: 'assets/[name].js',
          entryFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
  };
});
