import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configure for GitHub Pages deployment
  base: '/personal-practice-exams/',
  build: {
    // Ensure proper asset paths
    assetsDir: 'assets',
    // Generate manifest for PWA
    manifest: true
  },
  // PWA and Service Worker support
  server: {
    // Enable HTTPS in development if needed for PWA testing
    // https: true
  }
})
