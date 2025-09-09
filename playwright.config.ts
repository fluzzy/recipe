import { loadEnvConfig } from '@next/env';
import { defineConfig, devices } from '@playwright/test';

// Load .env into process.env so tests can read credentials (e.g., CYPRESS_TEST_EMAIL)
loadEnvConfig(process.cwd());

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // ✅ UI(Page) 레벨
  projects: [
    // UI - Guest + Common
    {
      name: 'ui-guest-chromium',
      testMatch: [
        '**/pages/guest/**/*.guest.spec.ts',
        '**/pages/common/**/*.common.spec.ts',
      ],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'ui-guest-webkit',
      testMatch: [
        '**/pages/guest/**/*.guest.spec.ts',
        '**/pages/common/**/*.common.spec.ts',
      ],
      use: { ...devices['Desktop Safari'] },
    },

    // UI - Auth + Common
    {
      name: 'ui-auth-chromium',
      testMatch: [
        '**/pages/auth/**/*.auth.spec.ts',
        '**/pages/common/**/*.common.spec.ts',
      ],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/fixtures/auth/storage-state.json',
      },
    },
    {
      name: 'ui-auth-webkit',
      testMatch: [
        '**/pages/auth/**/*.auth.spec.ts',
        '**/pages/common/**/*.common.spec.ts',
      ],
      use: {
        ...devices['Desktop Safari'],
        storageState: 'e2e/fixtures/auth/storage-state.json',
      },
    },

    // ✅ Scenarios 레벨
    // Scenarios - Guest + Common
    {
      name: 'scen-guest-chromium',
      testMatch: [
        '**/scenarios/guest/**/*.guest.spec.ts',
        '**/scenarios/common/**/*.common.spec.ts',
      ],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'scen-guest-webkit',
      testMatch: [
        '**/scenarios/guest/**/*.guest.spec.ts',
        '**/scenarios/common/**/*.common.spec.ts',
      ],
      use: { ...devices['Desktop Safari'] },
    },

    // Scenarios - Auth + Common
    {
      name: 'scen-auth-chromium',
      testMatch: [
        '**/scenarios/auth/**/*.auth.spec.ts',
        '**/scenarios/common/**/*.common.spec.ts',
      ],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/fixtures/auth/storage-state.json',
      },
    },
    {
      name: 'scen-auth-webkit',
      testMatch: [
        '**/scenarios/auth/**/*.auth.spec.ts',
        '**/scenarios/common/**/*.common.spec.ts',
      ],
      use: {
        ...devices['Desktop Safari'],
        storageState: 'e2e/fixtures/auth/storage-state.json',
      },
    },
  ],
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
