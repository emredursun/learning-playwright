import { test , expect } from "@playwright/test"

test("Add basic home page verification test", async ({ page }) => {

  await page.goto("https://practicesoftwaretesting.com/");

  // Ensure the sign-in link is present
  await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");

  // Check that the page title is correct
  await expect(page).toHaveTitle("Practice Software Testing - Toolshop - v5.0");

  // Check the count of items displayed
  const productGrid = page.locator(".col-md-9");
  await expect(productGrid.getByRole("link")).toHaveCount(9);
  expect(await productGrid.getByRole("link").count()).toBe(9);

  // Search for Thor Hammer and check the results
  await page.getByTestId("search-query").fill("Thor Hammer");
  await page.getByTestId("search-submit").click();
  await expect(productGrid.getByRole("link")).toHaveCount(1);
  await expect(page.getByAltText("Thor Hammer")).toBeVisible();
});