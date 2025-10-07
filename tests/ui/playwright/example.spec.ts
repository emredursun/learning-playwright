import { test, expect } from "@playwright/test";

test("has title", { tag: "@first" }, async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", { tag: "@last" }, async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});

test("verify Butch Mayhew is still Playwright Ambassadors", async ({
  page,
}) => {
  await page.goto("https://playwright.dev/");
  await page.getByRole("link", { name: "Community" }).click();
  await page
    .getByLabel("Docs sidebar")
    .getByRole("link", { name: "Ambassadors" })
    .click();
  await expect(page.locator("section")).toContainText("Butch Mayhew");
});
