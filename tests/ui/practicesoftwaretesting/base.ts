// base.ts

import { test as base, Page, BrowserContext } from "@playwright/test";

// Define the type for the extended test context (fixtures)
type AuthFixtures = {
  adminPage: Page;
  customer1Page: Page;
  customer2Page: Page;
  customer3Page: Page;
};

// --- Reusable Logic (Function Factory) ---
async function getAuthenticatedPage(
  browser: any,
  authFile: string
): Promise<[BrowserContext, Page]> {
  // Use storageState and rely on playwright.config.ts for baseURL/viewport
  const context = await browser.newContext({
    storageState: authFile,
  });

  const page = await context.newPage();

  // Use simple page.goto('/') which relies on the global baseURL
  await page.goto("/");

  return [context, page];
}

// Extend the base test object with the custom authenticated pages
export const authTest = base.extend<AuthFixtures>({
  // Use the function factory for all users
  adminPage: async ({ browser }, use) => {
    const [context, page] = await getAuthenticatedPage(
      browser,
      ".auth/admin.json"
    );
    await use(page);
    await context.close();
  },

  customer1Page: async ({ browser }, use) => {
    const [context, page] = await getAuthenticatedPage(
      browser,
      ".auth/customer1.json"
    );
    await use(page);
    await context.close();
  },

  customer2Page: async ({ browser }, use) => {
    const [context, page] = await getAuthenticatedPage(
      browser,
      ".auth/customer2.json"
    );
    await use(page);
    await context.close();
  },

  customer3Page: async ({ browser }, use) => {
    const [context, page] = await getAuthenticatedPage(
      browser,
      ".auth/customer3.json"
    );
    await use(page);
    await context.close();
  },
});