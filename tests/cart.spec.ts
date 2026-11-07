import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { testData } from '../utils/testData';

test.describe('Cart Page Functionality', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    // Independent test setup: fresh login for every test
    await loginPage.navigate();
    await loginPage.login(testData.users.standard, testData.users.password);
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('TC_SD_024 - Verify cart displays all products added by the user', async ({ page }) => {
    const item1 = testData.products.backpack;
    const item2 = testData.products.bikeLight;

    await inventoryPage.addProductToCart(item1.name);
    await inventoryPage.addProductToCart(item2.name);
    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(cartPage.titleLocator).toHaveText('Your Cart');

    const names = await cartPage.getAllCartItemNames();
    expect(names).toContain(item1.name);
    expect(names).toContain(item2.name);

    const details1 = await cartPage.getItemDetails(item1.name);
    expect(details1).not.toBeNull();
    expect(details1?.price).toBe(item1.price);
    expect(details1?.quantity).toBe(1);

    const details2 = await cartPage.getItemDetails(item2.name);
    expect(details2).not.toBeNull();
    expect(details2?.price).toBe(item2.price);
    expect(details2?.quantity).toBe(1);
  });

  test('TC_SD_025 - Verify cart displays quantity and description headings', async () => {
    await inventoryPage.addProductToCart(testData.products.backpack.name);
    await inventoryPage.goToCart();

    expect(await cartPage.isQtyHeadingVisible()).toBeTruthy();
    expect(await cartPage.getQtyHeadingText()).toBe('QTY');

    expect(await cartPage.isDescHeadingVisible()).toBeTruthy();
    expect(await cartPage.getDescHeadingText()).toBe('Description');
  });

  test('TC_SD_026 - Verify product quantity displayed in cart', async () => {
    const productName = testData.products.backpack.name;

    await inventoryPage.addProductToCart(productName);
    await inventoryPage.goToCart();

    const quantity = await cartPage.getItemQuantity(productName);
    expect(quantity).toBe(1);
  });

  test('TC_SD_027 - Remove a product from the cart', async () => {
    const item1 = testData.products.backpack.name;
    const item2 = testData.products.bikeLight.name;

    await inventoryPage.addProductToCart(item1);
    await inventoryPage.addProductToCart(item2);
    await inventoryPage.goToCart();

    expect(await cartPage.getCartItemsCount()).toBe(2);
    expect(await cartPage.getCartBadgeCount()).toBe(2);

    await cartPage.removeItem(item1);

    expect(await cartPage.getCartItemsCount()).toBe(1);
    expect(await cartPage.getCartBadgeCount()).toBe(1);

    const remainingItems = await cartPage.getAllCartItemNames();
    expect(remainingItems).not.toContain(item1);
    expect(remainingItems).toContain(item2);
  });

  test('TC_SD_028 - Remove the last product and verify empty cart state', async () => {
    const product = testData.products.backpack.name;

    await inventoryPage.addProductToCart(product);
    await inventoryPage.goToCart();

    expect(await cartPage.getCartItemsCount()).toBe(1);

    await cartPage.removeItem(product);

    expect(await cartPage.getCartItemsCount()).toBe(0);
    expect(await cartPage.isCartBadgeVisible()).toBeFalsy();
  });

  test('TC_SD_029 - Continue shopping from cart', async ({ page }) => {
    const product = testData.products.backpack.name;

    await inventoryPage.addProductToCart(product);
    await inventoryPage.goToCart();

    await cartPage.clickContinueShopping();

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(inventoryPage.titleLocator).toHaveText('Products');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });
});
