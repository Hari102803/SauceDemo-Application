import { Locator, Page } from '@playwright/test';

export class InventoryLocators {
  readonly appLogo: Locator;
  readonly pageTitle: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly activeSortOption: Locator;
  readonly inventoryItems: Locator;
  readonly burgerMenuButton: Locator;
  readonly menuWrap: Locator;
  readonly menuCloseButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly backToProductsButton: Locator;
  readonly detailsItemName: Locator;
  readonly detailsItemDesc: Locator;
  readonly detailsItemPrice: Locator;
  readonly detailsItemImage: Locator;
  readonly detailsActionButton: Locator;

  constructor(page: Page) {
    this.appLogo = page.locator('.app_logo');
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.activeSortOption = page.locator('.active_option');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.menuWrap = page.locator('.bm-menu-wrap');
    this.menuCloseButton = page.locator('#react-burger-cross-btn');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.detailsItemName = page.locator('[data-test="inventory-item-name"]');
    this.detailsItemDesc = page.locator('[data-test="inventory-item-desc"]');
    this.detailsItemPrice = page.locator('[data-test="inventory-item-price"]');
    this.detailsItemImage = page.locator('.inventory_details_img');
    this.detailsActionButton = page.locator('.inventory_details_container button');
  }

  item(productName: string): Locator {
    return this.inventoryItems.filter({ hasText: productName });
  }

  itemName(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-name"]');
  }

  allItemNames(): Locator {
    return this.inventoryItems.locator('[data-test="inventory-item-name"]');
  }

  itemDescription(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-desc"]');
  }

  allItemPrices(): Locator {
    return this.inventoryItems.locator('[data-test="inventory-item-price"]');
  }

  itemPrice(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-price"]');
  }

  itemImage(item: Locator): Locator {
    return item.locator('img.inventory_item_img');
  }

  itemButton(item: Locator): Locator {
    return item.locator('button');
  }
}
