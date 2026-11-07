import { Locator, Page } from '@playwright/test';

export interface CartItemDetails {
  name: string;
  description: string;
  price: string;
  quantity: number;
}

export class CartPage {
  readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly qtyHeading: Locator;
  private readonly descHeading: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly checkoutButton: Locator;
  private readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('.cart_item');
    this.qtyHeading = page.locator('.cart_quantity_label');
    this.descHeading = page.locator('.cart_desc_label');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
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
    return (await this.pageTitle.textContent())?.trim() || '';
  }

  /**
   * Check if QTY header label is visible
   */
  async isQtyHeadingVisible(): Promise<boolean> {
    return await this.qtyHeading.isVisible();
  }

  /**
   * Get QTY header label text
   */
  async getQtyHeadingText(): Promise<string> {
    return (await this.qtyHeading.textContent())?.trim() || '';
  }

  /**
   * Check if Description header label is visible
   */
  async isDescHeadingVisible(): Promise<boolean> {
    return await this.descHeading.isVisible();
  }

  /**
   * Get Description header label text
   */
  async getDescHeadingText(): Promise<string> {
    return (await this.descHeading.textContent())?.trim() || '';
  }

  /**
   * Get count of items currently in the cart
   */
  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get list of all product names in the cart
   */
  async getAllCartItemNames(): Promise<string[]> {
    return await this.cartItems.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  /**
   * Get details for a specific item in the cart
   */
  async getItemDetails(productName: string): Promise<CartItemDetails | null> {
    const item = this.cartItems.filter({ hasText: productName });
    if ((await item.count()) === 0) return null;

    const name = (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim() || '';
    const description = (await item.locator('[data-test="inventory-item-desc"]').textContent())?.trim() || '';
    const price = (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim() || '';
    const qtyText = (await item.locator('.cart_quantity').textContent())?.trim() || '0';
    const quantity = parseInt(qtyText, 10);

    return { name, description, price, quantity };
  }

  /**
   * Get quantity value for a specific product
   */
  async getItemQuantity(productName: string): Promise<number> {
    const item = this.cartItems.filter({ hasText: productName });
    const text = (await item.locator('.cart_quantity').textContent())?.trim() || '0';
    return parseInt(text, 10);
  }

  /**
   * Remove item from cart by product name
   */
  async removeItem(productName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: productName });
    await item.locator('button').click();
  }

  /**
   * Click Continue Shopping button
   */
  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /**
   * Click Checkout button
   */
  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Check if cart badge is visible
   */
  async isCartBadgeVisible(): Promise<boolean> {
    return await this.cartBadge.isVisible();
  }

  /**
   * Get cart badge number
   */
  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = (await this.cartBadge.textContent())?.trim();
      return text ? parseInt(text, 10) : 0;
    }
    return 0;
  }

  // Getters for assertions
  get titleLocator(): Locator {
    return this.pageTitle;
  }

  get cartBadgeLocator(): Locator {
    return this.cartBadge;
  }

  get checkoutButtonLocator(): Locator {
    return this.checkoutButton;
  }
}
