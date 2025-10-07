import { type Locator, type Page } from "@playwright/test";

// Best Practice: The class name should reflect its purpose clearly
export class LoginPage {
  // Use readonly for the page object as it shouldn't be reassigned
  readonly page: Page;

  // Best Practice: Locators are defined using the 'readonly' keyword
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  // Best Practice: Define page path as a static constant for easy reference
  private static readonly path = "/auth/login";

  constructor(page: Page) {
    this.page = page;
    // Best Practice: Locators use data-testid for resilience
    this.emailInput = page.getByTestId("email");
    this.passwordInput = page.getByTestId("password");
    this.loginButton = page.getByTestId("login-submit");
  }

  /**
   * Navigates to the login page path, relying on baseURL from config.
   */
  async goto(): Promise<void> {
    // Use path-only; Playwright prepends the baseURL defined in config
    await this.page.goto(LoginPage.path);
  }

  /**
   * Fills credentials and clicks the login button.
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
