import { defineConfig, devices } from '@playwright/test'

// US-007: the E2E suite exercises the signed-out journey deterministically,
// regardless of a developer's .env.local. Vite gives an existing process.env
// value priority over .env files, so forcing these empty keeps the app
// unconfigured for E2E. The configured (Supabase-linked) path needs a real
// project — documented manual checks in US-007's verification.md.
process.env.VITE_SUPABASE_URL = ''
process.env.VITE_SUPABASE_ANON_KEY = ''

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    // Local by default; point at a deployed environment for live verification:
    //   E2E_BASE_URL=https://<deployment> npx playwright test
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
