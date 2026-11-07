import { Locator, Page } from '@playwright/test';

export interface ProductCardInfo {
  name: string;
  description: string;
  price: string;
  hasImage: boolean;
  hasButton: boolean;
  buttonText: string;
}

export class InventoryPage {
  readonly page: Page;
  private readonly appLogo: Locator;
  private readonly pageTitle: Locator;
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;
  private readonly sortDropdown: Locator;
  private readonly activeSortOption: Locator;
  private readonly inventoryItems: Locator;
  private readonly burgerMenuButton: Locator;
  private readonly menuWrap: Locator;
  private readonly menuCloseButton: Locator;
  private readonly allItemsLink: Locator;
  private readonly aboutLink: Locator;
  private readonly logoutLink: Locator;
  private readonly resetAppStateLink: Locator;

  // Product details page locators
  private readonly backToProductsButton: Locator;
  private readonly detailsItemName: Locator;
  private readonly detailsItemDesc: Locator;
  private readonly detailsItemPrice: Locator;
  private readonly detailsItemImage: Locator;
  private readonly detailsActionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appLogo = page.locator('.app_logo');
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.activeSortOption = page.locator('.active_option');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');

    // Menu locators
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.menuWrap = page.locator('.bm-menu-wrap');
    this.menuCloseButton = page.locator('#react-burger-cross-btn');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');

    // Product Details locators
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.detailsItemName = page.locator('[data-test="inventory-item-name"]');
    this.detailsItemDesc = page.locator('[data-test="inventory-item-desc"]');
    this.detailsItemPrice = page.locator('[data-test="inventory-item-price"]');
    this.detailsItemImage = page.locator('.inventory_details_img');
    this.detailsActionButton = page.locator('.inventory_details_container button');
  }

  /**
   * Navigate directly to inventory page
   */
  async navigate(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  /**
   * Verify header elements are visible
   */
  async isHeaderVisible(): Promise<boolean> {
    return await this.appLogo.isVisible();
  }

  /**
   * Get the page title text (e.g. "Products")
   */
  async getPageTitleText(): Promise<string> {
    return (await this.pageTitle.textContent())?.trim() || '';
  }

  /**
   * Check if sort container is visible
   */
  async isSortDropdownVisible(): Promise<boolean> {
    return await this.sortDropdown.isVisible();
  }

  /**
   * Check if shopping cart icon is visible
   */
  async isCartIconVisible(): Promise<boolean> {
    return await this.cartLink.isVisible();
  }

  /**
   * Get total count of displayed products
   */
  async getProductCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  /**
   * Retrieve all product card details for validation
   */
  async getAllProductCardDetails(): Promise<ProductCardInfo[]> {
    const count = await this.inventoryItems.count();
    const products: ProductCardInfo[] = [];

    for (let i = 0; i < count; i++) {
      const item = this.inventoryItems.nth(i);
      const name = (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim() || '';
      const description = (await item.locator('[data-test="inventory-item-desc"]').textContent())?.trim() || '';
      const price = (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim() || '';
      const hasImage = await item.locator('img.inventory_item_img').isVisible();
      const button = item.locator('button');
      const hasButton = await button.isVisible();
      const buttonText = (await button.textContent())?.trim() || '';

      products.push({ name, description, price, hasImage, hasButton, buttonText });
    }

    return products;
  }

  /**
   * Get list of all displayed product names
   */
  async getAllProductNames(): Promise<string[]> {
    return await this.inventoryItems.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  /**
   * Get list of all displayed product numeric prices
   */
  async getAllProductPrices(): Promise<number[]> {
    const rawPrices = await this.inventoryItems.locator('[data-test="inventory-item-price"]').allTextContents();
    return rawPrices.map((p) => parseFloat(p.replace(/[^0-9.]/g, '')));
  }

  /**
   * Select sorting option ('az', 'za', 'lohi', 'hilo')
   */
  async selectSortOption(optionValue: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(optionValue);
  }

  /**
   * Get currently active/selected sort option label
   */
  async getActiveSortOptionText(): Promise<string> {
    return (await this.activeSortOption.textContent())?.trim() || '';
  }

  /**
   * Add a specific product to the cart by name
   */
  async addProductToCart(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.locator('button').click();
  }

  /**
   * Remove a specific product from cart on inventory page
   */
  async removeProductFromCart(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.locator('button').click();
  }

  /**
   * Get action button text for a product ("Add to cart" or "Remove")
   */
  async getActionButtonText(productName: string): Promise<string> {
    const item = this.inventoryItems.filter({ hasText: productName });
    return (await item.locator('button').textContent())?.trim() || '';
  }

  /**
   * Check if cart badge is visible
   */
  async isCartBadgeVisible(): Promise<boolean> {
    return await this.cartBadge.isVisible();
  }

  /**
   * Get number displayed on the cart badge
   */
  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = (await this.cartBadge.textContent())?.trim();
      return text ? parseInt(text, 10) : 0;
    }
    return 0;
  }

  /**
   * Click on product name to navigate to details page
   */
  async openProductDetails(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.locator('[data-test="inventory-item-name"]').click();
  }

  // Product Details Page actions
  async getDetailsProductName(): Promise<string> {
    return (await this.detailsItemName.textContent())?.trim() || '';
  }

  async getDetailsProductDescription(): Promise<string> {
    return (await this.detailsItemDesc.textContent())?.trim() || '';
  }

  async getDetailsProductPrice(): Promise<string> {
    return (await this.detailsItemPrice.textContent())?.trim() || '';
  }

  async isDetailsProductImageVisible(): Promise<boolean> {
    return await this.detailsItemImage.isVisible();
  }

  async isDetailsActionButtonVisible(): Promise<boolean> {
    return await this.detailsActionButton.isVisible();
  }

  async clickBackToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  // Hamburger Menu actions
  async openSideMenu(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.menuWrap.waitFor({ state: 'visible' });
  }

  async closeSideMenu(): Promise<void> {
    await this.menuCloseButton.click();
    await this.menuWrap.waitFor({ state: 'hidden' });
  }

  async isSideMenuVisible(): Promise<boolean> {
    const hiddenAttr = await this.menuWrap.getAttribute('aria-hidden');
    return hiddenAttr === 'false';
  }

  async isAllItemsOptionVisible(): Promise<boolean> {
    return await this.allItemsLink.isVisible();
  }

  async isAboutOptionVisible(): Promise<boolean> {
    return await this.aboutLink.isVisible();
  }

  async isLogoutOptionVisible(): Promise<boolean> {
    return await this.logoutLink.isVisible();
  }

  async isResetOptionVisible(): Promise<boolean> {
    return await this.resetAppStateLink.isVisible();
  }

  async clickAllItems(): Promise<void> {
    await this.allItemsLink.click();
  }

  async getAboutLinkHref(): Promise<string | null> {
    return await this.aboutLink.getAttribute('href');
  }

  async clickAbout(): Promise<void> {
    await this.aboutLink.click();
  }

  async clickResetAppState(): Promise<void> {
    await this.resetAppStateLink.click();
  }

  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
  }

  /**
   * Click shopping cart icon
   */
  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  // Getters for assertions
  get titleLocator(): Locator {
    return this.pageTitle;
  }

  get cartBadgeLocator(): Locator {
    return this.cartBadge;
  }

  get menuWrapLocator(): Locator {
    return this.menuWrap;
  }
}
