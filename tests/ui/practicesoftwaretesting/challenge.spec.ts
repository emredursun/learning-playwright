// challenge.spec.ts (Optimized)

import { test, expect } from "@playwright/test";
import { authTest } from "./base";

// --- Reusable Logic ---

/**
 * Checks for signed-in status and verifies the user's name.
 */
const checkUserStatus = async (page: any, expectedName: string) => {
  // This avoids the failure that occurred when relying only on getByText(expectedName).
  await expect(page.getByTestId("nav-menu")).toBeVisible();

  // Check 1: Now that the menu is visible, check its content for authentication.
  await expect(page.getByTestId("nav-menu")).toContainText(expectedName);

  // Check 2: Assert that the "Sign in" link is gone.
  await expect(page.getByTestId("nav-sign-in")).not.toBeVisible();
};

// =========================================================================

authTest.describe("Checkout Challenge Tests with Authenticated Users", () => {
  const PRODUCT_NAME = "Claw Hammer with Shock Reduction Grip";
  const SUCCESS_MESSAGE = "Payment was successful";

  authTest(
    `Customer 1 (${PRODUCT_NAME}) - Pay Later Checkout Flow`,
    async ({ customer1Page, headless }) => {
      // 1. Initial State Check (Navigation to '/' is now handled by the optimized base.ts fixture)
      await checkUserStatus(customer1Page, "Jane Doe");

      // REMOVED: The redundant hardcoded page.goto() call is eliminated.

      // 2. Add to Cart
      await customer1Page.getByRole("link", { name: PRODUCT_NAME }).click();
      await customer1Page.getByTestId("add-to-cart").click();
      await expect(customer1Page.getByTestId("cart-quantity")).toHaveText("1");

      // 3. Checkout Steps (Cart -> Sign In -> Billing)
      await customer1Page.getByTestId("nav-cart").click();
      await customer1Page.getByTestId("proceed-1").click();
      await customer1Page.getByTestId("proceed-2").click();

      // Stable wait for the step indicator to confirm navigation completion
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
      await customer1Page
        .getByTestId("postal_code")
        .fill(addressData.postal_code);
      await customer1Page.getByTestId("proceed-3").click();

      // 5. Payment Selection
      await expect(customer1Page.getByTestId("finish")).toBeDisabled();

      await customer1Page
        .getByTestId("payment-method")
        .selectOption("Buy Now Pay Later");
      await customer1Page
        .getByTestId("monthly_installments")
        .selectOption("6 Monthly Installments");

      await customer1Page.getByTestId("finish").click();

      // 6. Final Assertions
      const successBlock = customer1Page.locator(".help-block");
      await expect(successBlock).toHaveText(SUCCESS_MESSAGE);
      await expect(successBlock).toBeVisible();

      // 7. Visual Snapshot
      if (headless) {
        await authTest.step("Visual snapshot", async () => {
          await expect(customer1Page).toHaveScreenshot(
            "checkout-challenge-customer1.png",
            {
              mask: [
                customer1Page.getByTitle(
                  "Practice Software Testing - Toolshop"
                ),
              ],
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
