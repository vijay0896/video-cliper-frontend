import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import seo from './vite-plugin-seo'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backend = env.VITE_PROXY_TARGET || process.env.VITE_PROXY_TARGET || 'http://localhost:5060'
  const renderer = env.VITE_RENDER_TARGET || process.env.VITE_RENDER_TARGET || 'http://localhost:3100'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': { target: backend, changeOrigin: true },
        '/output': { target: backend, changeOrigin: true },
        '/uploads': { target: backend, changeOrigin: true },
        '/videos': { target: backend, changeOrigin: true },
        '/thumbnails': {
          target: backend,
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          },
        },
        '/gallery': { target: backend, changeOrigin: true },
        '/video': { target: backend, changeOrigin: true },
        '/render': { target: renderer, changeOrigin: true },
      }
    }
  }
})
