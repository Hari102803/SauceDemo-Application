import { Locator, Page } from '@playwright/test';
import { CartLocators } from '../locators/CartLocators';

export interface CartItemDetails {
  name: string;
  description: string;
  price: string;
  quantity: number;
}

export class CartPage {
  readonly page: Page;
  private readonly locators: CartLocators;

  constructor(page: Page) {
    this.page = page;
    this.locators = new CartLocators(page);
  }

  /**
   * Navigate directly to the cart page
   */
  async navigate(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  /**
   * Get title text on the cart page ("Your Cart")
   */
  async getPageTitleText(): Promise<string> {
    return (await this.locators.pageTitle.textContent())?.trim() || '';
  }

  /**
   * Check if QTY header label is visible
   */
  async isQtyHeadingVisible(): Promise<boolean> {
    return await this.locators.qtyHeading.isVisible();
  }

  /**
   * Get QTY header label text
   */
  async getQtyHeadingText(): Promise<string> {
    return (await this.locators.qtyHeading.textContent())?.trim() || '';
  }

  /**
   * Check if Description header label is visible
   */
  async isDescHeadingVisible(): Promise<boolean> {
    return await this.locators.descHeading.isVisible();
  }

  /**
   * Get Description header label text
   */
  async getDescHeadingText(): Promise<string> {
    return (await this.locators.descHeading.textContent())?.trim() || '';
  }

  /**
   * Get count of items currently in the cart
   */
  async getCartItemsCount(): Promise<number> {
    return await this.locators.cartItems.count();
  }

  /**
   * Get list of all product names in the cart
   */
  async getAllCartItemNames(): Promise<string[]> {
    return await this.locators.allItemNames().allTextContents();
  }

  /**
   * Get details for a specific item in the cart
   */
  async getItemDetails(productName: string): Promise<CartItemDetails | null> {
    const item = this.locators.item(productName);
    if ((await item.count()) === 0) return null;

    const name = (await this.locators.itemName(item).textContent())?.trim() || '';
    const description = (await this.locators.itemDescription(item).textContent())?.trim() || '';
    const price = (await this.locators.itemPrice(item).textContent())?.trim() || '';
    const qtyText = (await this.locators.itemQuantity(item).textContent())?.trim() || '0';
    const quantity = parseInt(qtyText, 10);

    return { name, description, price, quantity };
  }

  /**
   * Get quantity value for a specific product
   */
  async getItemQuantity(productName: string): Promise<number> {
    const item = this.locators.item(productName);
    const text = (await this.locators.itemQuantity(item).textContent())?.trim() || '0';
    return parseInt(text, 10);
  }

  /**
   * Remove item from cart by product name
   */
  async removeItem(productName: string): Promise<void> {
    const item = this.locators.item(productName);
    await this.locators.itemRemoveButton(item).click();
  }

  /**
   * Click Continue Shopping button
   */
  async clickContinueShopping(): Promise<void> {
    await this.locators.continueShoppingButton.click();
  }

  /**
   * Click Checkout button
   */
  async clickCheckout(): Promise<void> {
    await this.locators.checkoutButton.click();
  }

  /**
   * Check if cart badge is visible
   */
  async isCartBadgeVisible(): Promise<boolean> {
    return await this.locators.cartBadge.isVisible();
  }

  /**
   * Get cart badge number
   */
  async getCartBadgeCount(): Promise<number> {
    if (await this.locators.cartBadge.isVisible()) {
      const text = (await this.locators.cartBadge.textContent())?.trim();
      return text ? parseInt(text, 10) : 0;
    }
    return 0;
  }

  // Getters for assertions
  get titleLocator(): Locator {
    return this.locators.pageTitle;
  }

  get cartBadgeLocator(): Locator {
    return this.locators.cartBadge;
  }

  get checkoutButtonLocator(): Locator {
    return this.locators.checkoutButton;
  }
}
