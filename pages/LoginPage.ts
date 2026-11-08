
import { Locator, Page } from '@playwright/test';
import { LoginLocators } from '../locators/LoginLocators';

export class LoginPage {
  readonly page: Page;
  private readonly locators: LoginLocators;

  constructor(page: Page) {
    this.page = page;
    this.locators = new LoginLocators(page);
  }

  // Navigate to login page
  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  // Enter username
  async enterUsername(username: string): Promise<void> {
    await this.locators.usernameInput.fill(username);
  }

  // Enter password
  async enterPassword(password: string): Promise<void> {
    await this.locators.passwordInput.fill(password);
  }

  // Click login button
  async clickLogin(): Promise<void> {
    await this.locators.loginButton.click();
  }

  // Complete login
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // Check logo visibility
  async isLogoVisible(): Promise<boolean> {
    return this.locators.logo.isVisible();
  }

  // Check username visibility and editability
  async isUsernameInputVisible(): Promise<boolean> {
    return (
      await this.locators.usernameInput.isVisible() &&
      await this.locators.usernameInput.isEditable()
    );
  }

  // Check password visibility and editability
  async isPasswordInputVisible(): Promise<boolean> {
    return (
      await this.locators.passwordInput.isVisible() &&
      await this.locators.passwordInput.isEditable()
    );
  }

  // Check login button visibility and enabled state
  async isLoginButtonVisible(): Promise<boolean> {
    return (
      await this.locators.loginButton.isVisible() &&
      await this.locators.loginButton.isEnabled()
    );
  }

  // Get password input type
  async getPasswordInputType(): Promise<string | null> {
    return this.locators.passwordInput.getAttribute('type');
  }

  // Get error message
  async getErrorMessageText(): Promise<string> {
    return (
      (await this.locators.errorMessage.textContent())?.trim() || ''
    );
  }

  // Check error visibility
  async isErrorMessageVisible(): Promise<boolean> {
    return this.locators.errorMessage.isVisible();
  }

  // Close error message
  async closeErrorMessage(): Promise<void> {
    await this.locators.errorCloseButton.click();
  }

  // Getters for Playwright assertions
  get errorLocator(): Locator {
    return this.locators.errorMessage;
  }

  get logoLocator(): Locator {
    return this.locators.logo;
  }

  get usernameLocator(): Locator {
    return this.locators.usernameInput;
  }

  get passwordLocator(): Locator {
    return this.locators.passwordInput;
  }

  get loginButtonLocator(): Locator {
    return this.locators.loginButton;
  }
}
