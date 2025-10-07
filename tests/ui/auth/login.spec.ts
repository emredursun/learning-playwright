import { test, expect } from "@playwright/test";

// - Navigates to the sign-in page.
// - Fills in credentials for the default customer (Jack Howe).
// - Verifies successful navigation to the 'My account' page and checks for the user's name "Jack Howe" in the navigation menu.

test("login test", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.getByTestId("nav-sign-in").click();
  // await page.locator('button:has-text("Sign in"), button:has-text("Log in")').click();
  await page.getByLabel("email").fill("customer3@practicesoftwaretesting.com");
  await page.getByTestId("password").fill("pass123");
  await page.locator('[data-test="login-submit"]').click();
  await expect(page.locator('[data-test="nav-menu"]')).toContainText(
    "Bob Smith"
  );
  // await expect(page.getByText("Jack Howe")).toBeVisible();
  await expect(page.locator('[data-test="page-title"]')).toContainText(
    "My account"
  );
});
