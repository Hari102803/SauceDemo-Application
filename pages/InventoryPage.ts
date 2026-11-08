import { Locator, Page } from '@playwright/test';
import { InventoryLocators } from '../locators/InventoryLocators';

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
  private readonly locators: InventoryLocators;

  constructor(page: Page) {
    this.page = page;
    this.locators = new InventoryLocators(page);
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
    return await this.locators.appLogo.isVisible();
  }

  /**
   * Get the page title text (e.g. "Products")
   */
  async getPageTitleText(): Promise<string> {
    return (await this.locators.pageTitle.textContent())?.trim() || '';
  }

  /**
   * Check if sort container is visible
   */
  async isSortDropdownVisible(): Promise<boolean> {
    return await this.locators.sortDropdown.isVisible();
  }

  /**
   * Check if shopping cart icon is visible
   */
  async isCartIconVisible(): Promise<boolean> {
    return await this.locators.cartLink.isVisible();
  }

  /**
   * Get total count of displayed products
   */
  async getProductCount(): Promise<number> {
    return await this.locators.inventoryItems.count();
  }

  /**
   * Retrieve all product card details for validation
   */
  async getAllProductCardDetails(): Promise<ProductCardInfo[]> {
    const count = await this.locators.inventoryItems.count();
    const products: ProductCardInfo[] = [];

    for (let i = 0; i < count; i++) {
      const item = this.locators.inventoryItems.nth(i);
      const name = (await this.locators.itemName(item).textContent())?.trim() || '';
      const description = (await this.locators.itemDescription(item).textContent())?.trim() || '';
      const price = (await this.locators.itemPrice(item).textContent())?.trim() || '';
      const hasImage = await this.locators.itemImage(item).isVisible();
      const button = this.locators.itemButton(item);
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
    return await this.locators.allItemNames().allTextContents();
  }

  /**
   * Get list of all displayed product numeric prices
   */
  async getAllProductPrices(): Promise<number[]> {
    const rawPrices = await this.locators.allItemPrices().allTextContents();
    return rawPrices.map((p) => parseFloat(p.replace(/[^0-9.]/g, '')));
  }

  /**
   * Select sorting option ('az', 'za', 'lohi', 'hilo')
   */
  async selectSortOption(optionValue: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.locators.sortDropdown.selectOption(optionValue);
  }

  /**
   * Get currently active/selected sort option label
   */
  async getActiveSortOptionText(): Promise<string> {
    return (await this.locators.activeSortOption.textContent())?.trim() || '';
  }

  /**
   * Add a specific product to the cart by name
   */
  async addProductToCart(productName: string): Promise<void> {
    const item = this.locators.item(productName);
    await this.locators.itemButton(item).click();
  }

  /**
   * Remove a specific product from cart on inventory page
   */
  async removeProductFromCart(productName: string): Promise<void> {
    const item = this.locators.item(productName);
    await this.locators.itemButton(item).click();
  }

  /**
   * Get action button text for a product ("Add to cart" or "Remove")
   */
  async getActionButtonText(productName: string): Promise<string> {
    const item = this.locators.item(productName);
    return (await this.locators.itemButton(item).textContent())?.trim() || '';
  }

  /**
   * Check if cart badge is visible
   */
  async isCartBadgeVisible(): Promise<boolean> {
    return await this.locators.cartBadge.isVisible();
  }

  /**
   * Get number displayed on the cart badge
   */
  async getCartBadgeCount(): Promise<number> {
    if (await this.locators.cartBadge.isVisible()) {
      const text = (await this.locators.cartBadge.textContent())?.trim();
      return text ? parseInt(text, 10) : 0;
    }
    return 0;
  }

  /**
   * Click on product name to navigate to details page
   */
  async openProductDetails(productName: string): Promise<void> {
    const item = this.locators.item(productName);
    await this.locators.itemName(item).click();
  }

  // Product Details Page actions
  async getDetailsProductName(): Promise<string> {
    return (await this.locators.detailsItemName.textContent())?.trim() || '';
  }

  async getDetailsProductDescription(): Promise<string> {
    return (await this.locators.detailsItemDesc.textContent())?.trim() || '';
  }

  async getDetailsProductPrice(): Promise<string> {
    return (await this.locators.detailsItemPrice.textContent())?.trim() || '';
  }

  async isDetailsProductImageVisible(): Promise<boolean> {
    return await this.locators.detailsItemImage.isVisible();
  }

  async isDetailsActionButtonVisible(): Promise<boolean> {
    return await this.locators.detailsActionButton.isVisible();
  }

  async clickBackToProducts(): Promise<void> {
    await this.locators.backToProductsButton.click();
  }

  // Hamburger Menu actions
  async openSideMenu(): Promise<void> {
    await this.locators.burgerMenuButton.click();
    await this.locators.menuWrap.waitFor({ state: 'visible' });
  }

  async closeSideMenu(): Promise<void> {
    await this.locators.menuCloseButton.click();
    await this.locators.menuWrap.waitFor({ state: 'hidden' });
  }

  async isSideMenuVisible(): Promise<boolean> {
    const hiddenAttr = await this.locators.menuWrap.getAttribute('aria-hidden');
    return hiddenAttr === 'false';
  }

  async isAllItemsOptionVisible(): Promise<boolean> {
    return await this.locators.allItemsLink.isVisible();
  }

  async isAboutOptionVisible(): Promise<boolean> {
    return await this.locators.aboutLink.isVisible();
  }

  async isLogoutOptionVisible(): Promise<boolean> {
    return await this.locators.logoutLink.isVisible();
  }

  async isResetOptionVisible(): Promise<boolean> {
    return await this.locators.resetAppStateLink.isVisible();
  }

  async clickAllItems(): Promise<void> {
    await this.locators.allItemsLink.click();
  }

  async getAboutLinkHref(): Promise<string | null> {
    return await this.locators.aboutLink.getAttribute('href');
  }

  async clickAbout(): Promise<void> {
    await this.locators.aboutLink.click();
  }

  async clickResetAppState(): Promise<void> {
    await this.locators.resetAppStateLink.click();
  }

  async clickLogout(): Promise<void> {
    await this.locators.logoutLink.click();
  }

  /**
   * Click shopping cart icon
   */
  async goToCart(): Promise<void> {
    await this.locators.cartLink.click();
  }

  // Getters for assertions
  get titleLocator(): Locator {
    return this.locators.pageTitle;
  }

  get cartBadgeLocator(): Locator {
    return this.locators.cartBadge;
  }

  get menuWrapLocator(): Locator {
    return this.locators.menuWrap;
  }
}
