import { test, expect } from "@playwright/test";
// IMPORT THE CUSTOM AUTH TEST OBJECT
import { authTest } from "../../base";

// --- Constants & Reusable Logic ---

const HOME_PAGE_URL = "https://practicesoftwaretesting.com/";
const VISUAL_VIEWPORT = { width: 1280, height: 720 };

/**
 * Checks for signed-in status and verifies the user's name.
 * @param page The Playwright page object (provided by a fixture).
 * @param expectedName The name expected in the navigation menu (e.g., "John Doe").
 */
const checkUserStatus = async (page: any, expectedName: string) => {
  // Check 1: The "Sign in" link should be gone
  await expect(page.getByTestId("nav-sign-in")).not.toBeVisible();

  // Check 2: The navigation menu should contain the authenticated user's name
  await expect(page.getByTestId("nav-menu")).toContainText(expectedName);
};

// =========================================================================

// --- UN-AUTHENTICATED TESTS (Uses standard 'test') ---
test.describe("Home Page with No Authentication", () => {
  // Use a beforeEach hook to navigate before each test in this unauthenticated block
  test.beforeEach(async ({ page }) => {
    await page.goto(HOME_PAGE_URL);
  });

  test.describe("Visual snapshot (No Auth)", () => {
    test.use({ viewport: VISUAL_VIEWPORT });

    test("Should match visual snapshot", async ({ page }) => {
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveScreenshot("home-page-no-auth.png", {
        mask: [page.getByTitle("Practice Software Testing - Toolshop")], // Mask dynamic content
      });
    });
  });

  // Functional tests
  test("Validate essential links and page title", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");
    await expect(page).toHaveTitle(
      "Practice Software Testing - Toolshop - v5.0"
    );
  });

  test("Validate initial product count", async ({ page }) => {
    await expect(page.locator(".col-md-9").getByRole("link")).toHaveCount(9);
  });

  test("Validate site search functionality", async ({ page }) => {
    const productGrid = page.locator(".col-md-9");
    await page.getByTestId("search-query").fill("Thor Hammer");
    await page.getByTestId("search-submit").click();
    await expect(productGrid.getByRole("link")).toHaveCount(1);
    await expect(page.getByAltText("Thor Hammer")).toBeVisible();
  });
});

// -------------------------------------------------------------------------

// --- AUTHENTICATED TESTS (Uses custom 'authTest') ---
authTest.describe("Authenticated Home Page Views (Fixtures)", () => {
  // 1. Functional Status Checks (Cleanest implementation)
  // The fixture handles the authentication and navigation

  authTest("Should be signed in as Admin (John Doe)", async ({ adminPage }) => {
    await checkUserStatus(adminPage, "John Doe");
  });

  authTest(
    "Should be signed in as Customer3 (Bob Smith)",
    async ({ customer3Page }) => {
      await checkUserStatus(customer3Page, "Bob Smith");
    }
  );

  // 2. Visual Snapshot Tests (Inherit viewport from the fixture)

  authTest("Visual snapshot as Admin", async ({ adminPage }) => {
    await adminPage.waitForLoadState("networkidle");
    await expect(adminPage).toHaveScreenshot("home-page-admin.png", {
      mask: [adminPage.getByTitle("Practice Software Testing - Toolshop")], // Mask dynamic content
      maxDiffPixelRatio: 0.02, // Allows up to 2% of pixels to be different (0.02 = 2%)
    });
  });

  authTest("Visual snapshot as Customer3", async ({ customer3Page }) => {
    await customer3Page.waitForLoadState("networkidle");

    // Note: Add a tolerance threshold to ignore minor pixel differences
    await expect(customer3Page).toHaveScreenshot("home-page-customer3.png", {
      mask: [customer3Page.getByTitle("Practice Software Testing - Toolshop")], // Mask dynamic content
      maxDiffPixelRatio: 0.02, // Allows up to 2% of pixels to be different (0.02 = 2%)
    });
  });
});
