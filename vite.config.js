import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/MathLoop/', // Exact base URL for GitHub Pages repo
  server: {
    port: 3000,
    open: true
  }
})
