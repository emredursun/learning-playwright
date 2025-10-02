import { test as setup, expect, BrowserContext } from "@playwright/test";

// --- Reusable Login Function ---

/**
 * Logs in a user, verifies the redirect, and saves the authentication state.
 * @param page The Playwright page object.
 * @param context The Playwright context object.
 * @param userEmail The email address to use.
 * @param userPassword The password to use.
 * @param userName The name of the user to verify in the UI.
 * @param expectedTitle The title text expected on the destination page.
 * @param expectedUrl The URL to wait for after login (e.g., '/account' or '/admin/dashboard').
 * @param userAuthFile The path to save the auth state to.
 */

async function loginAndSaveAuth(
  page: any,
  context: BrowserContext,
  userEmail: string,
  userPassword: string,
  userName: string,
  expectedTitle: string,
  expectedUrl: string,
  userAuthFile: string
) {
  // Navigate to the login page
  await page.goto("https://practicesoftwaretesting.com/auth/login");

  // 1. Fill in the credentials
  await page.getByTestId("email").fill(userEmail);
  await page.getByTestId("password").fill(userPassword);

  // 2. Click the submit button
  await page.getByTestId("login-submit").click();

  // 3. Wait for navigation and verify successful login
  await expect(page.getByTestId("nav-menu")).toContainText(userName);
  await expect(page.getByTestId("page-title")).toContainText(expectedTitle);
  await page.waitForURL(expectedUrl);

  // 4. Save the storage state
  await context.storageState({ path: userAuthFile });
}

// =========================================================================

// Define the setup for admin
setup("Create admin auth", async ({ page, context }) => {
  await loginAndSaveAuth(
    page,
    context,
    process.env.ADMIN_EMAIL!,
    process.env.ADMIN_PASSWORD!,
    "John Doe",
    "Sales over the years",
    "**/admin/dashboard",
    ".auth/admin.json"
  );
});

// Define the setup for customer2
setup("Create customer2 auth", async ({ page, context }) => {
  await loginAndSaveAuth(
    page,
    context,
    process.env.CUSTOMER2_EMAIL!,
    process.env.CUSTOMER2_PASSWORD!,
    "Jack Howe",
    "My account",
    "**/account",
    ".auth/customer2.json"
  );
});

// Define the setup for customer3
setup("Create customer3 auth", async ({ page, context }) => {
  await loginAndSaveAuth(
    page,
    context,
    process.env.CUSTOMER3_EMAIL!,
    process.env.CUSTOMER3_PASSWORD!,
    "Bob Smith",
    "My account",
    "**/account",
    ".auth/customer3.json"
  );
});
