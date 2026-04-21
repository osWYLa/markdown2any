import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Serve index.html for all routes so /render works in dev mode too
  server: {
    historyApiFallback: true,
  },
})
