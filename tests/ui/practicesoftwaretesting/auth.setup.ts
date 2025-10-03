import { test as setup, expect, BrowserContext } from "@playwright/test";

// --- Reusable Login Function ---

/**
 * Logs in a user, verifies the redirect, and saves the authentication state.
 * @param page The Playwright page object.
 * @param context The Playwright context object.
 * @param userEmail The email address to use.
 * @param userPassword The password to use.
 * @param expectedTitle The title text expected on the destination page.
 * @param expectedUrl The URL to wait for after login (e.g., '/account').
 * @param userAuthFile The path to save the auth state to.
 */
async function loginAndSaveAuth(
  page: any,
  context: BrowserContext,
  userEmail: string,
  userPassword: string,
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
  // Note: Wait for URL change *before* checking the page content.
  // This ensures the page is stable and loaded after the redirect.
  await page.waitForURL(expectedUrl);

  // Note: Use expect().toHaveText() or .toBeVisible() on the title element
  // as it is often more reliable than .toContainText() on dynamic elements.
  await expect(page.getByTestId("page-title")).toHaveText(expectedTitle);

  // 4. Save the storage state
  await context.storageState({ path: userAuthFile });
}

// =========================================================================

// Note: Use an array of users to reduce test definition repetition
const users = [
  {
    name: "admin",
    email: process.env.ADMIN_EMAIL!,
    password: process.env.ADMIN_PASSWORD!,
    title: "Sales over the years",
    url: "**/admin/dashboard",
    file: ".auth/admin.json",
  },
  {
    name: "customer1",
    email: process.env.CUSTOMER1_EMAIL!,
    password: process.env.CUSTOMER1_PASSWORD!,
    title: "My account",
    url: "**/account",
    file: ".auth/customer1.json",
  },
  {
    name: "customer2",
    email: process.env.CUSTOMER2_EMAIL!,
    password: process.env.CUSTOMER2_PASSWORD!,
    title: "My account",
    url: "**/account",
    file: ".auth/customer2.json",
  },
  {
    name: "customer3",
    email: process.env.CUSTOMER3_EMAIL!,
    password: process.env.CUSTOMER3_PASSWORD!,
    title: "My account",
    url: "**/account",
    file: ".auth/customer3.json",
  },
];

// Loop through the array to define all setup tests
for (const user of users) {
  setup(`Create ${user.name} auth`, async ({ page, context }) => {
    await loginAndSaveAuth(
      page,
      context,
      user.email,
      user.password,
      user.title,
      user.url,
      user.file
    );
  });
}
