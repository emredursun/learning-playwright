import { test as setup, expect } from "@playwright/test";

// Define the setup test
setup("Create customer 02 auth", async ({ page, context }) => {
  const userEmail = "customer2@practicesoftwaretesting.com";
  const userPassword = "welcome01";
  const userAuthFile = ".auth/customer02.json"; 

  await page.goto("https://practicesoftwaretesting.com/auth/login");

  // 1. Fill in the credentials
  await page.getByTestId("email").fill(userEmail);
  await page.getByTestId("password").fill(userPassword);

  // 2. Click the submit button
  await page.getByTestId("login-submit").click();

  // 3. Wait for navigation and verify successful login
  // Wait until the URL changes to the expected post-login page (/account or /my-account)
  // or wait for a specific element that only appears after successful login.
  await page.waitForURL("**/account");

  // Optional: Add an expectation to confirm login was successful
  await expect(page.getByTestId("page-title")).toContainText("My account");

  // 4. Save the storage state (authentication cookies, local storage, etc.)
  // This is the most important step for a setup file.
  await context.storageState({ path: userAuthFile });
});
