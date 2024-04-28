import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {  // Assuming you call your backend API with "/api"
        target: 'http://localhost:5000', // The backend server URL
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional rewrite of paths
      },
      '/dns': {  // Proxy requests to /other-api to another service
        target: 'http://localhost:6611',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dns/, '') // Remove the /other-api prefix before passing the request
      }
    },
    port: 3333
  }
})
