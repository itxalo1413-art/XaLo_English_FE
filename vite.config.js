import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Code splitting strategy for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'utils': ['axios', 'react-helmet-async'],
        }
      }
    },
    // Warn only if chunk is bigger than 1000KB
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      '/api': {
        // backend/.env uses PORT=5001 (5000 is often taken by macOS AirPlay)
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap.xml': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})

