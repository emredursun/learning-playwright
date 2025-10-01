import { test, expect } from "@playwright/test";

// - Navigates to the sign-in page.
// - Fills in credentials for the default customer (Jane Doe).
// - Verifies successful navigation to the 'My account' page and checks for the user's name "Jane Doe" in the navigation menu.

test("login test", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.locator('[data-test="nav-sign-in"]').click();
  await page
    .locator('[data-test="email"]')
    .fill("customer@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("welcome01");
  await page.locator('[data-test="login-submit"]').click();
  await expect(page.locator('[data-test="nav-menu"]')).toContainText(
    "Jane Doe"
  );
  await expect(page.locator('[data-test="page-title"]')).toContainText(
    "My account"
  );
});
