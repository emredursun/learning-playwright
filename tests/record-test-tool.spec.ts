import { test, expect } from '@playwright/test';

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