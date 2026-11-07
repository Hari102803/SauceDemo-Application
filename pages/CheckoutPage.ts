import { Locator, Page } from '@playwright/test';

export interface OverviewItemDetails {
  name: string;
  price: string;
  numericPrice: number;
  quantity: number;
}

export class CheckoutPage {
  readonly page: Page;

  // Step 1: Information
  private readonly pageTitle: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;

  // Step 2: Overview
  private readonly overviewItems: Locator;
  private readonly itemTotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;

  // Step 3: Complete
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1
    this.pageTitle = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step 2
    this.overviewItems = page.locator('.cart_item');
    this.itemTotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');

    // Step 3
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
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
    return (await this.pageTitle.textContent())?.trim() || '';
  }

  // --- Step 1 Actions ---
  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    if (firstName) await this.firstNameInput.fill(firstName);
    if (lastName) await this.lastNameInput.fill(lastName);
    if (postalCode) await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async getErrorMessageText(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() || '';
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  // --- Step 2 Actions ---
  async getOverviewItemCount(): Promise<number> {
    return await this.overviewItems.count();
  }

  async getOverviewItemNames(): Promise<string[]> {
    return await this.overviewItems.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async getOverviewItemDetails(productName: string): Promise<OverviewItemDetails | null> {
    const item = this.overviewItems.filter({ hasText: productName });
    if ((await item.count()) === 0) return null;

    const name = (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim() || '';
    const price = (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim() || '';
    const qtyText = (await item.locator('.cart_quantity').textContent())?.trim() || '0';
    const quantity = parseInt(qtyText, 10);
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));

    return { name, price, numericPrice, quantity };
  }

  async getItemTotal(): Promise<number> {
    const text = (await this.itemTotalLabel.textContent()) || '';
    const match = text.match(/Item total: \$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTax(): Promise<number> {
    const text = (await this.taxLabel.textContent()) || '';
    const match = text.match(/Tax: \$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTotal(): Promise<number> {
    const text = (await this.totalLabel.textContent()) || '';
    const match = text.match(/Total: \$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getItemTotalRawText(): Promise<string> {
    return (await this.itemTotalLabel.textContent())?.trim() || '';
  }

  async getTaxRawText(): Promise<string> {
    return (await this.taxLabel.textContent())?.trim() || '';
  }

  async getTotalRawText(): Promise<string> {
    return (await this.totalLabel.textContent())?.trim() || '';
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  // --- Step 3 Actions ---
  async getCompleteHeaderText(): Promise<string> {
    return (await this.completeHeader.textContent())?.trim() || '';
  }

  async isCompleteHeaderVisible(): Promise<boolean> {
    return await this.completeHeader.isVisible();
  }

  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  // Getters for assertions
  get titleLocator(): Locator {
    return this.pageTitle;
  }

  get errorLocator(): Locator {
    return this.errorMessage;
  }

  get completeHeaderLocator(): Locator {
    return this.completeHeader;
  }
}
