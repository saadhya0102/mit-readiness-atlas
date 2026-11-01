import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Forked workers exceed the startup timeout on slower Windows machines.
    pool: 'threads',
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
