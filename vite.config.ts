import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/strategy-framework-generation/',
  define: {
    global: 'window',
  },
})
