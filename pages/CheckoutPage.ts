import { Locator, Page } from '@playwright/test';
import { CheckoutLocators } from '../locators/CheckoutLocators';

export interface OverviewItemDetails {
  name: string;
  price: string;
  numericPrice: number;
  quantity: number;
}

export class CheckoutPage {
  readonly page: Page;
  private readonly locators: CheckoutLocators;

  constructor(page: Page) {
    this.page = page;
    this.locators = new CheckoutLocators(page);
  }

  /**
   * Navigate to checkout step 1 directly
   */
  async navigateToStepOne(): Promise<void> {
    await this.page.goto('/checkout-step-one.html');
  }

  /**
   * Get title text on current checkout step
   */
  async getPageTitleText(): Promise<string> {
    return (await this.locators.pageTitle.textContent())?.trim() || '';
  }

  // --- Step 1 Actions ---
  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    if (firstName) await this.locators.firstNameInput.fill(firstName);
    if (lastName) await this.locators.lastNameInput.fill(lastName);
    if (postalCode) await this.locators.postalCodeInput.fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.locators.continueButton.click();
  }

  async getErrorMessageText(): Promise<string> {
    return (await this.locators.errorMessage.textContent())?.trim() || '';
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.locators.errorMessage.isVisible();
  }

  // --- Step 2 Actions ---
  async getOverviewItemCount(): Promise<number> {
    return await this.locators.overviewItems.count();
  }

  async getOverviewItemNames(): Promise<string[]> {
    return await this.locators.allItemNames().allTextContents();
  }

  async getOverviewItemDetails(productName: string): Promise<OverviewItemDetails | null> {
    const item = this.locators.item(productName);
    if ((await item.count()) === 0) return null;

    const name = (await this.locators.itemName(item).textContent())?.trim() || '';
    const price = (await this.locators.itemPrice(item).textContent())?.trim() || '';
    const qtyText = (await this.locators.itemQuantity(item).textContent())?.trim() || '0';
    const quantity = parseInt(qtyText, 10);
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));

    return { name, price, numericPrice, quantity };
  }

  async getItemTotal(): Promise<number> {
    const text = (await this.locators.itemTotalLabel.textContent()) || '';
    const match = text.match(/Item total: \$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTax(): Promise<number> {
    const text = (await this.locators.taxLabel.textContent()) || '';
    const match = text.match(/Tax: \$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTotal(): Promise<number> {
    const text = (await this.locators.totalLabel.textContent()) || '';
    const match = text.match(/Total: \$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getItemTotalRawText(): Promise<string> {
    return (await this.locators.itemTotalLabel.textContent())?.trim() || '';
  }

  async getTaxRawText(): Promise<string> {
    return (await this.locators.taxLabel.textContent())?.trim() || '';
  }

  async getTotalRawText(): Promise<string> {
    return (await this.locators.totalLabel.textContent())?.trim() || '';
  }

  async clickFinish(): Promise<void> {
    await this.locators.finishButton.click();
  }

  // --- Step 3 Actions ---
  async getCompleteHeaderText(): Promise<string> {
    return (await this.locators.completeHeader.textContent())?.trim() || '';
  }

  async isCompleteHeaderVisible(): Promise<boolean> {
    return await this.locators.completeHeader.isVisible();
  }

  async clickBackHome(): Promise<void> {
    await this.locators.backHomeButton.click();
  }

  // Getters for assertions
  get titleLocator(): Locator {
    return this.locators.pageTitle;
  }

  get errorLocator(): Locator {
    return this.locators.errorMessage;
  }

  get completeHeaderLocator(): Locator {
    return this.locators.completeHeader;
  }
}
