import { Locator, Page } from '@playwright/test';

export class CartLocators {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly qtyHeading: Locator;
  readonly descHeading: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('.cart_item');
    this.qtyHeading = page.locator('.cart_quantity_label');
    this.descHeading = page.locator('.cart_desc_label');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  item(productName: string): Locator {
    return this.cartItems.filter({ hasText: productName });
  }

  itemName(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-name"]');
  }

  allItemNames(): Locator {
    return this.cartItems.locator('[data-test="inventory-item-name"]');
  }

  itemDescription(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-desc"]');
  }

  itemPrice(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-price"]');
  }

  itemQuantity(item: Locator): Locator {
    return item.locator('.cart_quantity');
  }

  itemRemoveButton(item: Locator): Locator {
    return item.locator('button');
  }
}
