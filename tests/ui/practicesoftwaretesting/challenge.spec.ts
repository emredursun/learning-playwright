// challenge.spec.ts (Location: tests/ui/practicesoftwaretesting/)

import { test, expect } from "@playwright/test";
import { authTest } from "./base"; // Assuming base.ts is in the same directory

// --- Constants & Configuration ---

/**
 * Checks for signed-in status and verifies the user's name.
 * @param page The Playwright page object (provided by a fixture).
 * @param expectedName The name expected in the navigation menu (e.g., "Jane Doe").
 */


const checkUserStatus = async (page: any, expectedName: string) => {
  // This is a more idiomatic Playwright way to wait for visibility.
  await expect(page.getByTestId("nav-menu")).toBeVisible(); 
  
  // Check 1: Now that it is visible, check its content.
  await expect(page.getByTestId("nav-menu")).toContainText(expectedName);

  // Check 2: NOW assert that the "Sign in" link is gone.
  await expect(page.getByTestId("nav-sign-in")).not.toBeVisible();
};

// =========================================================================

authTest.describe("Checkout Challenge Tests with Authenticated Users", () => {
  // Create a constant for the specific product name or expected messages for readability
  const PRODUCT_NAME = "Claw Hammer with Shock Reduction Grip";
  const SUCCESS_MESSAGE = "Payment was successful";

  authTest(
    `Customer 1 (${PRODUCT_NAME}) - Pay Later Checkout Flow`,
    async ({ customer1Page, headless }) => {
      // 1. Initial State Check
      await checkUserStatus(customer1Page, "Jane Doe");

      // Navigate to the home page if the fixture doesn't already do it
      // If the fixture does navigate, this line can be omitted.
      await customer1Page.goto("https://practicesoftwaretesting.com/");

      // 2. Add to Cart
      // OPTIMIZATION: Use a more robust locator pattern (getByRole('link', { name: ... }))
      await customer1Page.getByRole("link", { name: PRODUCT_NAME }).click();
      await customer1Page.getByTestId("add-to-cart").click();
      await expect(customer1Page.getByTestId("cart-quantity")).toHaveText("1");

      // 3. Checkout Steps (Cart -> Sign In -> Billing)
      await customer1Page.getByTestId("nav-cart").click();
      await customer1Page.getByTestId("proceed-1").click(); // Cart -> Sign In (Skip, already signed in)
      await customer1Page.getByTestId("proceed-2").click(); // Sign In -> Billing Address

      // OPTIMIZATION: Use toHaveCSS assertion as a stable wait before filling forms
      const step2Indicator = customer1Page
        .locator(".step-indicator")
        .filter({ hasText: "2" });
      await expect(step2Indicator).toHaveCSS(
        "background-color",
        "rgb(51, 153, 51)"
      );

      // 4. Billing Address
      const addressData = {
        street: "Pimpelmees XX",
        city: "Hoogkarspel",
        state: "Noord-Holland",
        country: "Netherlands",
        postal_code: "1616AA",
      };

      await customer1Page.getByTestId("street").fill(addressData.street);
      await customer1Page.getByTestId("city").fill(addressData.city);
      await customer1Page.getByTestId("state").fill(addressData.state);
      await customer1Page.getByTestId("country").fill(addressData.country);
      await customer1Page.getByTestId("postal_code").fill(addressData.postal_code);
      await customer1Page.getByTestId("proceed-3").click(); // Billing Address -> Payment

      // 5. Payment Selection
      await expect(customer1Page.getByTestId("finish")).toBeDisabled();

      await customer1Page
        .getByTestId("payment-method")
        .selectOption("Buy Now Pay Later");

      await customer1Page
        .getByTestId("monthly_installments")
        .selectOption("6 Monthly Installments");

      await customer1Page.getByTestId("finish").click();

      // 6. Final Assertions (Functional and Stability Check)
      const successBlock = customer1Page.locator(".help-block");

      // Wait for the success message to be visible and have text (stability/functional check)
      await expect(successBlock).toHaveText(SUCCESS_MESSAGE);

      // Ensure the element is fully stable before screenshotting
      await expect(successBlock).toBeVisible();

      // 7. Visual Snapshot
      if (headless) {
        await authTest.step("Visual snapshot", async () => {
          await expect(customer1Page).toHaveScreenshot(
            "checkout-challenge-customer1.png",
            {
              // Masking dynamic element (like the banner image/title)
              mask: [
                customer1Page.getByTitle(
                  "Practice Software Testing - Toolshop"
                ),
              ],
              // Timeout increased to handle potential UI transitions
              timeout: 10000,
            }
          );
        });
      } else {
        console.log("Skipping visual snapshot in headed mode");
      }
    }
  );
});
