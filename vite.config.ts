import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// vite.config.js
export default defineConfig({
  base: "/frontendrip/",
  plugins: [react()],
  server: {
    proxy: {
      // Перенаправляем все запросы, начинающиеся на '/api', на локальный сервер на порту 8888
      '/api/': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        // Убираем префикс '/api', когда перенаправляем на бэкенд
        rewrite: path => path.replace(/^\/api/, '')
      },
      // Здесь вы можете добавлять другие прокси правила для различных путей
    },
  },
});