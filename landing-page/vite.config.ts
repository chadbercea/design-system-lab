import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/design-system-lab/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    cssCodeSplit: false,
  },
})
