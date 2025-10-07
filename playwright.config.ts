import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 30_000,
  globalTimeout: 10 * 60 * 1000,
  testDir: "./tests",

  // Consolidated list of files/folders to ignore from standard test runs
  // Note: Since 'base.ts' is at './tests/base.ts', it is not picked up by default.
  testIgnore: [
    // Ignore all snapshot directories created by visual tests
    "**/*-snapshots/**",
    // Ignore any boilerplate files in the old 'ui/playwright' folder
    "**/ui/playwright/**",
  ],

  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI 2 times and locally 1 time */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html"], ["list"]],

  /* Shared settings for all the projects below. */
  use: {
    baseURL: "https://practicesoftwaretesting.com",
    viewport: { width: 1280, height: 720 },
    testIdAttribute: "data-test",
    trace: "on",
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    headless: true,
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: "setup",
    //   testMatch: /.*\.setup\.ts/,
    // },

    // 1. SETUP PROJECT (Required for UI test authentication)
    {
      name: "setup",
      testDir: "./tests/setup",
      testMatch: /.*\.setup\.ts/,
    },

    // 2. UI TESTS PROJECT (Enabled the Play button for UI tests)
    {
      name: "ui",
      dependencies: ["setup"],
      // CRITICAL: Explicitly tells the VS Code extension where the UI files are.
      testDir: "./tests/ui",
      testMatch: "**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        permissions: ["clipboard-read"],
      },
    },

    // 3. API TESTS PROJECT (Enabled the Play button for API tests)
    {
      name: "api",
      // CRITICAL: Explicitly tells the VS Code extension where the API files are.
      testDir: "./tests/api",
      testMatch: "**/*.spec.ts",
      // No dependencies needed for API tests
      use: {
        // Required for API calls
        baseURL: "https://api.practicesoftwaretesting.com",
        extraHTTPHeaders: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    },

    // {
    //   name: "chromium",
    //   dependencies: ["setup"],
    //   use: { ...devices["Desktop Chrome"], permissions: ["clipboard-read"] },
    // },

    // {
    //   name: "firefox",
    //   dependencies: ["setup"],
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   dependencies: ["setup"],
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
