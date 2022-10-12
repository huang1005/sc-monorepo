import { defineConfig } from 'vite'
import path from "path";
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'


// 设置别名
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueJsx()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@runafe/sc-style" as *;',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src"),
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
    host: '0.0.0.0',
  },
})
