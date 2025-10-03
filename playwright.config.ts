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

  // OPTIMIZATION: Consolidated list of files/folders to ignore from standard test runs
  // testIgnore: [
  //   "**/auth.setup.ts", // Prevents setup file from running during 'npx playwright test'
  //   "**/*-snapshots/**", // Excludes all snapshot folders
  //   "**/example.spec.ts", // Exclude boilerplate example tests
  //   "**/record-test-tool.spec.ts", // Exclude recorded boilerplate tests
  // ],

  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI 2 times and locally 1 time */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "https://practicesoftwaretesting.com",

    // VIEWPORT: Defined once globally
    viewport: { width: 1280, height: 720 },

    testIdAttribute: "data-test",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on",
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    headless: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },

    // {
    //   name: "setup",
    //   testMatch: /.*\.auth\.setup\.ts/,
    // },

    // // 2. UI TESTS PROJECT: Runs all UI tests and ensures authentication state is loaded
    // {
    //   name: "UI Tests (Chrome)",
    //   dependencies: ["setup"],
    //   // Restrict search to the main UI folder
    //   testDir: "./tests/ui",
    //   testMatch: "**/*.spec.ts",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     permissions: ["clipboard-read"],

    //     // OPTIMIZATION: If you want all UI tests to run as a specific user
    //     // by default (e.g., customer3), you can define it here.
    //     // If tests use custom fixtures (base.ts), this line is optional.
    //     // storageState: '.auth/customer3.json',
    //   },
    // },

    // // 3. API TESTS PROJECT: Runs API tests against the dedicated API URL
    // {
    //   name: "API Tests",
    //   // Restrict search to the API folder
    //   testDir: "./tests/api",
    //   testMatch: "**/*.spec.ts",
    //   // No 'dependencies: ["setup"]' needed, as API tests are independent
    //   use: {
    //     // REQUIRED: Override the baseURL for the API environment
    //     baseURL: "https://api.practicesoftwaretesting.com",

    //     // Define common API headers
    //     extraHTTPHeaders: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //   },
    // },

    {
      name: "chromium",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], permissions: ["clipboard-read"] },
    },

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