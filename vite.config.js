import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://your-vps-domain.com', // VPS sunucunuzun domain adresini buraya yazın
        changeOrigin: true,
        secure: false,
      }
    }
  }
}) 