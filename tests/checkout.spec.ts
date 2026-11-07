import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { testData } from '../utils/testData';

test.describe('Checkout Functionality and Calculations', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Independent test setup: fresh session for every test
    await loginPage.navigate();
    await loginPage.login(testData.users.standard, testData.users.password);
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('TC_SD_030 - Proceed to checkout with all required information', async ({ page }) => {
    await inventoryPage.addProductToCart(testData.products.backpack.name);
    await inventoryPage.goToCart();
    await cartPage.clickCheckout();

    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(checkoutPage.titleLocator).toHaveText('Checkout: Your Information');

    await checkoutPage.fillInformation(
      testData.checkoutData.firstName,
      testData.checkoutData.lastName,
      testData.checkoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(checkoutPage.titleLocator).toHaveText('Checkout: Overview');

    const names = await checkoutPage.getOverviewItemNames();
    expect(names).toContain(testData.products.backpack.name);
  });

  test('TC_SD_031 - Verify validation when all checkout fields are empty', async ({ page }) => {
    await inventoryPage.addProductToCart(testData.products.backpack.name);
    await inventoryPage.goToCart();
    await cartPage.clickCheckout();

    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Click Continue without filling any inputs
    await checkoutPage.clickContinue();

    // Verify user is blocked and required field validation appears
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(checkoutPage.errorLocator).toBeVisible();
    await expect(checkoutPage.errorLocator).toHaveText(testData.messages.firstNameRequiredError);
  });

  test('TC_SD_032 - Verify products and prices on Checkout Overview', async ({ page }) => {
    const item1 = testData.products.backpack;
    const item2 = testData.products.bikeLight;

    await inventoryPage.addProductToCart(item1.name);
    await inventoryPage.addProductToCart(item2.name);
    await inventoryPage.goToCart();
    await cartPage.clickCheckout();

    await checkoutPage.fillInformation(
      testData.checkoutData.firstName,
      testData.checkoutData.lastName,
      testData.checkoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    expect(await checkoutPage.getOverviewItemCount()).toBe(2);

    const overviewItem1 = await checkoutPage.getOverviewItemDetails(item1.name);
    expect(overviewItem1).not.toBeNull();
    expect(overviewItem1?.price).toBe(item1.price);
    expect(overviewItem1?.quantity).toBe(1);

    const overviewItem2 = await checkoutPage.getOverviewItemDetails(item2.name);
    expect(overviewItem2).not.toBeNull();
    expect(overviewItem2?.price).toBe(item2.price);
    expect(overviewItem2?.quantity).toBe(1);
  });

  test('TC_SD_033 - Verify item total, tax and final total calculation', async ({ page }) => {
    const item1 = testData.products.backpack;
    const item2 = testData.products.bikeLight;

    await inventoryPage.addProductToCart(item1.name);
    await inventoryPage.addProductToCart(item2.name);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(cartPage.titleLocator).toHaveText('Your Cart');
    expect(await cartPage.getCartItemsCount()).toBe(2);
    expect(await cartPage.getAllCartItemNames()).toEqual(
      expect.arrayContaining([item1.name, item2.name])
    );

    const cartItem1 = await cartPage.getItemDetails(item1.name);
    expect(cartItem1?.price).toBe(item1.price);
    const cartItem2 = await cartPage.getItemDetails(item2.name);
    expect(cartItem2?.price).toBe(item2.price);

    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    await checkoutPage.fillInformation(
      testData.checkoutData.firstName,
      testData.checkoutData.lastName,
      testData.checkoutData.postalCode
    );
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);

    const overviewItem1 = await checkoutPage.getOverviewItemDetails(item1.name);
    expect(overviewItem1?.price).toBe(item1.price);
    const overviewItem2 = await checkoutPage.getOverviewItemDetails(item2.name);
    expect(overviewItem2?.price).toBe(item2.price);

    const displayedItemTotal = await checkoutPage.getItemTotal();
    const displayedTax = await checkoutPage.getTax();
    const displayedTotal = await checkoutPage.getTotal();

    const expectedItemTotal = item1.numericPrice + item2.numericPrice;
    expect(displayedItemTotal).toBeCloseTo(expectedItemTotal, 2);

    const expectedTax = Math.round(expectedItemTotal * 0.08 * 100) / 100;
    expect(displayedTax).toBeCloseTo(expectedTax, 2);

    const expectedFinalTotal = expectedItemTotal + expectedTax;
    expect(displayedTotal).toBeCloseTo(expectedFinalTotal, 2);
  });

  test('TC_SD_034 - Finish checkout and verify order confirmation', async ({ page }) => {
    await inventoryPage.addProductToCart(testData.products.backpack.name);
    await inventoryPage.goToCart();
    await cartPage.clickCheckout();

    await checkoutPage.fillInformation(
      testData.checkoutData.firstName,
      testData.checkoutData.lastName,
      testData.checkoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await checkoutPage.clickFinish();

    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(checkoutPage.titleLocator).toHaveText('Checkout: Complete!');
    await expect(checkoutPage.completeHeaderLocator).toHaveText(testData.messages.orderSuccessHeader);
  });

  test('TC_SD_035 - Verify cart is empty after successful order placement', async ({ page }) => {
    await inventoryPage.addProductToCart(testData.products.backpack.name);
    await inventoryPage.goToCart();
    await cartPage.clickCheckout();

    await checkoutPage.fillInformation(
      testData.checkoutData.firstName,
      testData.checkoutData.lastName,
      testData.checkoutData.postalCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();

    // Click Back Home button to return to Products page
    await checkoutPage.clickBackHome();
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Verify cart is empty and badge is not displayed
    expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();

    // Navigate to Cart page and verify 0 items remain
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart\.html/);
    expect(await cartPage.getCartItemsCount()).toBe(0);
    expect(await cartPage.isCartBadgeVisible()).toBeFalsy();
  });
});
