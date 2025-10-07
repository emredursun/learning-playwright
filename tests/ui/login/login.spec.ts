import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/login/loginPage";

// - Navigates to the sign-in page.
// - Fills in credentials for the default customer (Jack Howe).
// - Verifies successful navigation to the 'My account' page and checks for the user's name "Jack Howe" in the navigation menu.

// --- Constants (Test Data) ---
// Best Practice: Define test data once for readability and maintenance
const TEST_CUSTOMER = {
  email: process.env.CUSTOMER3_EMAIL!,
  password: process.env.CUSTOMER3_PASSWORD!, // Assuming you use this env variable
  expectedName: "Bob Smith",
  expectedPageTitle: "My account",
};

// Best Practice: Focus the test file on validation, not creation logic
test.describe("UI Authentication Tests with/without Page Object Model", () => {
  test("Successful login with existing user should navigate to account page - without POM", async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
    await page.getByTestId("nav-sign-in").click();
    await page.getByLabel("email").fill("customer3@practicesoftwaretesting.com");
    await page.getByTestId("password").fill("pass123");
    await page.locator('[data-test="login-submit"]').click();
    await expect(page.getByTestId("nav-menu")).toContainText("Bob Smith");
    await expect(page.locator('[data-test="page-title"]')).toContainText("My account");
  });

  test("Successful login with existing user should navigate to account page - with POM", async ({ page }) => {
    
    // 1. Arrange: Initialize the Page Object
    const loginPage = new LoginPage(page);
    
    // 2. Act: Execute the actions
    await loginPage.goto();
    
    // Best Practice: Use the clean, centralized login method from the POM
    await loginPage.login(
        TEST_CUSTOMER.email,
        TEST_CUSTOMER.password
    );

    // 3. Assert: Verify the outcome
    
    // Best Practice: Wait for the final URL (or a key network event) for stability
    await page.waitForURL("**/account");

    // Assertion 1: Verify the welcome text in the navigation menu
    await expect(page.getByTestId("nav-menu")).toContainText(
      TEST_CUSTOMER.expectedName
    );
    
    // Assertion 2: Verify the page title (functional success check)
    await expect(page.getByTestId("page-title")).toContainText(
      TEST_CUSTOMER.expectedPageTitle
    );
  });
});