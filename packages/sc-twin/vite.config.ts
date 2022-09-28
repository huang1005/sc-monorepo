import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'

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
  server: {
    hmr: {
      overlay: false,
    },
    host: '0.0.0.0',
  },
})
