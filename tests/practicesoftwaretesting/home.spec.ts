import { test, expect } from "@playwright/test";

// --- Constants & Reusable Logic ---

const HOME_PAGE_URL = "https://practicesoftwaretesting.com/";

// Reusable function to check signed-in status (since logic is repeated)
const checkUserStatus = async (page: any, expectedName: string) => {
  // Navigate to the page after authentication state is applied
  await page.goto(HOME_PAGE_URL);

  // Check 1: The "Sign in" link should be gone
  await expect(page.getByTestId("nav-sign-in")).not.toBeVisible();

  // Check 2: The navigation menu should contain the authenticated user's name
  await expect(page.getByTestId("nav-menu")).toContainText(expectedName);
};

// =========================================================================

// Runs before ALL tests in this file (equivalent to beforeAll for navigation)
test.beforeEach(async ({ page }) => {
  await page.goto(HOME_PAGE_URL);
});

// -------------------------------------------------------------------------

test.describe("Home Page with No Authentication", () => {
  test("Validate essential links and page title", async ({ page }) => {
    // Check 1: Ensure the sign-in link is present (no auth)
    await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");

    // Check 2: The page title is correct
    await expect(page).toHaveTitle(
      "Practice Software Testing - Toolshop - v5.0"
    );
  });

  test("Validate initial product count", async ({ page }) => {
    const productGrid = page.locator(".col-md-9");

    // Check the count of items displayed using the recommended Playwright assertion.
    // The second assertion 'expect(await productGrid.getByRole("link").count()).toBe(9);' is redundant.
    await expect(productGrid.getByRole("link")).toHaveCount(9, {
      timeout: 5000,
    });
  });

  test("Validate site search functionality", async ({ page }) => {
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

// -------------------------------------------------------------------------

test.describe("Authenticated Home Page Views", () => {
  test.describe("Customer 02 Auth", () => {
    // Apply authentication state for all tests in this block
    test.use({ storageState: ".auth/customer02.json" });

    test("Should be signed in as Customer 02 (Jack Howe)", async ({ page }) => {
      // Use the reusable function to perform navigation and checks
      await checkUserStatus(page, "Jack Howe");
    });
  });

  test.describe("Admin Auth", () => {
    // Apply authentication state for all tests in this block
    test.use({ storageState: ".auth/admin.json" });

    test("Should be signed in as Admin (John Doe)", async ({ page }) => {
      // Use the reusable function to perform navigation and checks
      await checkUserStatus(page, "John Doe");
    });
  });
});
