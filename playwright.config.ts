/**
 * Playwright config for PRAXIS E2E tests.
 *
 * Scope: these are UI-level flows that mock `/api/praxis/*` via
 * `page.route()` so they don't require live Supabase auth or an
 * OpenRouter key. The app server is booted by `webServer` below.
 */
import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PRAXIS_E2E_PORT ?? 3100);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_PRAXIS_E2E: '1',
    },
  },
});
