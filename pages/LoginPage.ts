
import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  private readonly logo: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logo = page.locator('.login_logo');
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator(
      '[data-test="error"] .error-button'
    );
  }

  // Navigate to login page
  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  // Enter username
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  // Enter password
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  // Click login button
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  // Complete login
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // Check logo visibility
  async isLogoVisible(): Promise<boolean> {
    return this.logo.isVisible();
  }

  // Check username visibility and editability
  async isUsernameInputVisible(): Promise<boolean> {
    return (
      await this.usernameInput.isVisible() &&
      await this.usernameInput.isEditable()
    );
  }

  // Check password visibility and editability
  async isPasswordInputVisible(): Promise<boolean> {
    return (
      await this.passwordInput.isVisible() &&
      await this.passwordInput.isEditable()
    );
  }

  // Check login button visibility and enabled state
  async isLoginButtonVisible(): Promise<boolean> {
    return (
      await this.loginButton.isVisible() &&
      await this.loginButton.isEnabled()
    );
  }

  // Get password input type
  async getPasswordInputType(): Promise<string | null> {
    return this.passwordInput.getAttribute('type');
  }

  // Get error message
  async getErrorMessageText(): Promise<string> {
    return (
      (await this.errorMessage.textContent())?.trim() || ''
    );
  }

  // Check error visibility
  async isErrorMessageVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  // Close error message
  async closeErrorMessage(): Promise<void> {
    await this.errorCloseButton.click();
  }

  // Getters for Playwright assertions
  get errorLocator(): Locator {
    return this.errorMessage;
  }

  get logoLocator(): Locator {
    return this.logo;
  }

  get usernameLocator(): Locator {
    return this.usernameInput;
  }

  get passwordLocator(): Locator {
    return this.passwordInput;
  }

  get loginButtonLocator(): Locator {
    return this.loginButton;
  }
}
