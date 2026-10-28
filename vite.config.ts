import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 让构建产物既能跑在 Vercel/Cloudflare 的根路径，也能直接用 file:// 打开预览
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173, open: false },
  build: { outDir: 'dist', sourcemap: false },
});
