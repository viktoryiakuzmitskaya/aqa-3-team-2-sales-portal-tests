import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  globalSetup: require.resolve('./src/config/global.setup'),
  globalTeardown: require.resolve('./src/config/global.teardown'),
  testDir: './src/',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 3 : 5,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['list'], ['allure-playwright']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
      testDir: 'src/ui/tests/',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'sales-portal-api',
      use: {
        ...devices['Desktop Chrome'],
      },
      testDir: './src/api/tests',
    },
    {
      name: 'sales-portal-ui',
      use: {
        ...devices['Desktop Chrome'],
        // storageState: 'src/.auth/user.json',
      },
      // dependencies: ['setup'],
      testDir: './src/ui/tests',
    },
  ],
});
