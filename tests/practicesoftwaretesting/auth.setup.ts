import { test as setup, expect, BrowserContext } from "@playwright/test";

// --- Reusable Login Function ---

/**
 * Logs in a user, verifies the redirect, and saves the authentication state.
 * @param page The Playwright page object.
 * @param context The Playwright context object.
 * @param userEmail The email address to use.
 * @param userPassword The password to use.
 * @param userAuthFile The path to save the auth state to.
 * @param expectedUrl The URL to wait for after login (e.g., '/account' or '/admin/dashboard').
 * @param expectedTitle The title text expected on the destination page.
 */

async function loginAndSaveAuth(
  page: any,
  context: BrowserContext,
  userEmail: string,
  userPassword: string,
  userAuthFile: string,
  expectedUrl: string,
  expectedTitle: string
) {
  // Navigate to the login page
  await page.goto("https://practicesoftwaretesting.com/auth/login");

  // 1. Fill in the credentials
  await page.getByTestId("email").fill(userEmail);
  await page.getByTestId("password").fill(userPassword);

  // 2. Click the submit button
  await page.getByTestId("login-submit").click();

  // 3. Wait for navigation and verify successful login
  await page.waitForURL(expectedUrl);
  await expect(page.getByTestId("page-title")).toContainText(expectedTitle);

  // 4. Save the storage state
  await context.storageState({ path: userAuthFile });
}

// =========================================================================

// Define the setup for customer 02
setup("Create customer 02 auth", async ({ page, context }) => {
  await loginAndSaveAuth(
    page,
    context,
    "customer2@practicesoftwaretesting.com",
    "welcome01",
    ".auth/customer02.json",
    "**/account",
    "My account"
  );
});

// Define the setup for admin
setup("Create admin auth", async ({ page, context }) => {
  await loginAndSaveAuth(
    page,
    context,
    "admin@practicesoftwaretesting.com",
    "welcome01",
    ".auth/admin.json",
    "**/admin/dashboard",
    "Sales over the years"
  );
});