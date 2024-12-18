import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'src/content.ts'),
      },
      output: {
        format: 'esm', // 使用 esm 格式，支持代码拆分
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js', //添加chunk文件名配置，更好区分chunk
        assetFileNames: '[name].[ext]', //添加hash，更好使用缓存
        inlineDynamicImports: false, // 保持 false，允许代码拆分
      },
    },
    outDir: 'Tencent-form-Assistant',
    target: 'esnext',
    minify: true, //生产环境开启代码压缩
  },
});