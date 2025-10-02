import { test as base, Page } from "@playwright/test";

// Define the type for our extended test context (fixtures)
type AuthFixtures = {
  // These fixtures provide a fully configured, authenticated Page object
  adminPage: Page;
  customer2Page: Page;
  customer3Page: Page;
};

const HOME_PAGE_URL = "https://practicesoftwaretesting.com/";
const VISUAL_VIEWPORT = { width: 1280, height: 720 };

// Extend the base test object with our custom authenticated pages
export const authTest = base.extend<AuthFixtures>({
  // Fixture to create a page authenticated as Admin
  adminPage: async ({ browser }, use) => {
    const adminContext = await browser.newContext({
      storageState: ".auth/admin.json",
      viewport: VISUAL_VIEWPORT,
    });
    const adminPage = await adminContext.newPage();
    await adminPage.goto(HOME_PAGE_URL);

    await use(adminPage); // Yield the page to the test
    await adminContext.close(); // Close after the test finishes
  },

  // Fixture to create a page authenticated as Customer 2
  customer2Page: async ({ browser }, use) => {
    const customer2Context = await browser.newContext({
      storageState: ".auth/customer2.json",
      viewport: VISUAL_VIEWPORT,
    });
    const customer2Page = await customer2Context.newPage();
    await customer2Page.goto(HOME_PAGE_URL);

    await use(customer2Page);
    await customer2Context.close();
  },

  // Fixture to create a page authenticated as Customer 3
  customer3Page: async ({ browser }, use) => {
    const customer3Context = await browser.newContext({
      storageState: ".auth/customer3.json",
      viewport: VISUAL_VIEWPORT,
    });
    const customer3Page = await customer3Context.newPage();
    await customer3Page.goto(HOME_PAGE_URL);

    await use(customer3Page);
    await customer3Context.close();
  },
});
