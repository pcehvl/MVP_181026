import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // US-007: unit/component tests always run the signed-out (unconfigured)
    // journey, whatever a developer has in .env.local — the configured path
    // needs a real Supabase project and is covered by App.account.test.tsx
    // with a mocked sync layer plus the documented manual checks.
    env: {
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
    },
    // Unit and component tests live under src/. Playwright specs under e2e/
    // are owned by the Playwright runner, not Vitest.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
})
