import { test, expect } from "@playwright/test";

// Use test.beforeEach to ensure the page navigates to the URL before every test
test.beforeEach(async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
});

test.describe("Home page with no auth", () => {
  // --- Test 1: Check essential links and navigation ---
  test("Check sign-in link and page title", async ({ page }) => {
    // Ensure the sign-in link is present
    await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");

    // Check that the page title is correct
    await expect(page).toHaveTitle(
      "Practice Software Testing - Toolshop - v5.0"
    );
  });

  // --- Test 2: Validate the initial product count on the home page ---
  test("Validate initial product count", async ({ page }) => {
    // The main product display area
    const productGrid = page.locator(".col-md-9");

    // Check the count of items displayed using the recommended assertion
    await expect(productGrid.getByRole("link")).toHaveCount(9, {
      timeout: 5000,
    });
    // The second way to check the count of items displayed
    expect(await productGrid.getByRole("link").count()).toBe(9);
  });

  // --- Test 3: Validate the site search functionality ---
  test("Validate product search functionality", async ({ page }) => {
    const productGrid = page.locator(".col-md-9");

    // Search for Thor Hammer
    await page.getByTestId("search-query").fill("Thor Hammer");
    await page.getByTestId("search-submit").click();

    // Check that only one item is displayed after the search
    await expect(productGrid.getByRole("link")).toHaveCount(1);

    // Check that the correct product image is visible
    await expect(page.getByAltText("Thor Hammer")).toBeVisible();
  });
});

test.describe("Home page customer 02 auth", () => {
  // Use test.use to set the authenticated state for all tests in this describe block
  test.use({
    // IMPORTANT: Ensure this file exists from your setup test!
    storageState: ".auth/customer02.json",
  });

  test("Check customer 02 signed in", async ({ page }) => {
    // Check 1: The "Sign in" link should not be visible after login
    await expect(page.getByTestId("nav-sign-in")).not.toBeVisible();

    // Check 2: The navigation menu should contain the authenticated user's name
    await expect(page.getByTestId("nav-menu")).toContainText("Jack Howe");
  });
});
