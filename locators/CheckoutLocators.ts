import { Locator, Page } from '@playwright/test';

export class CheckoutLocators {
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly overviewItems: Locator;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.pageTitle = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.overviewItems = page.locator('.cart_item');
    this.itemTotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  item(productName: string): Locator {
    return this.overviewItems.filter({ hasText: productName });
  }

  itemName(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-name"]');
  }

  allItemNames(): Locator {
    return this.overviewItems.locator('[data-test="inventory-item-name"]');
  }

  itemPrice(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-price"]');
  }

  itemQuantity(item: Locator): Locator {
    return item.locator('.cart_quantity');
  }
}
