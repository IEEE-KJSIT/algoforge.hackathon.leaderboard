import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/algoforge.leaderboard/',
  server: {
    port: 5175 // Different from the main application port
  }
}) 