import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { testData } from '../utils/testData';

test.describe('Products / Inventory Page Functionality', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Each test is fully independent and begins with a clean authenticated session
    await loginPage.navigate();
    await loginPage.login(testData.users.standard, testData.users.password);
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('TC_SD_008 - Verify Products page is displayed after login', async () => {
    expect(await inventoryPage.isHeaderVisible()).toBeTruthy();
    expect(await inventoryPage.getPageTitleText()).toBe('Products');
    expect(await inventoryPage.isSortDropdownVisible()).toBeTruthy();
    expect(await inventoryPage.isCartIconVisible()).toBeTruthy();
    expect(await inventoryPage.getProductCount()).toBeGreaterThan(0);
  });

  test('TC_SD_009 - Verify product cards display required information', async () => {
    const products = await inventoryPage.getAllProductCardDetails();
    expect(products.length).toBeGreaterThan(0);

    for (const product of products) {
      expect(product.name.length).toBeGreaterThan(0);
      expect(product.description.length).toBeGreaterThan(0);
      expect(product.price).toMatch(/^\$[0-9]+\.[0-9]{2}$/);
      // expect(product.hasImage).toBeTruthy();
      expect(product.hasButton).toBeTruthy();
      expect(product.buttonText).toBe('Add to cart');
    }
  });

  test('TC_SD_010 - Verify default product sorting', async () => {
    const activeSort = await inventoryPage.getActiveSortOptionText();
    expect(activeSort).toBe('Name (A to Z)');

    const names = await inventoryPage.getAllProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('TC_SD_011 - Sort products by Name (A to Z)', async () => {
    await inventoryPage.selectSortOption('az');
    const names = await inventoryPage.getAllProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('TC_SD_012 - Sort products by Name (Z to A)', async () => {
    await inventoryPage.selectSortOption('za');
    const names = await inventoryPage.getAllProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('TC_SD_013 - Sort products by Price (low to high)', async () => {
    await inventoryPage.selectSortOption('lohi');
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('TC_SD_014 - Sort products by Price (high to low)', async () => {
    await inventoryPage.selectSortOption('hilo');
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('TC_SD_015 - Open a product details page', async ({ page }) => {
    const targetProduct = testData.products.backpack;

    await inventoryPage.openProductDetails(targetProduct.name);
    await expect(page).toHaveURL(/.*inventory-item\.html\?id=\d+/);

    expect(await inventoryPage.getDetailsProductName()).toBe(targetProduct.name);
    expect(await inventoryPage.getDetailsProductDescription()).toBe(targetProduct.description);
    expect(await inventoryPage.getDetailsProductPrice()).toBe(targetProduct.price);
    expect(await inventoryPage.isDetailsProductImageVisible()).toBeTruthy();
    expect(await inventoryPage.isDetailsActionButtonVisible()).toBeTruthy();

    await inventoryPage.clickBackToProducts();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('TC_SD_016 - Add one product to cart', async () => {
    const product = testData.products.backpack.name;

    await inventoryPage.addProductToCart(product);

    expect(await inventoryPage.getActionButtonText(product)).toBe('Remove');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('TC_SD_017 - Add multiple products and verify cart badge', async () => {
    await inventoryPage.addProductToCart(testData.products.backpack.name);
    await inventoryPage.addProductToCart(testData.products.bikeLight.name);
    await inventoryPage.addProductToCart(testData.products.boltTShirt.name);

    expect(await inventoryPage.getCartBadgeCount()).toBe(3);
  });

  test('TC_SD_018 - Remove an added product from Products page', async () => {
    const product = testData.products.backpack.name;

    await inventoryPage.addProductToCart(product);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    await inventoryPage.removeProductFromCart(product);
    expect(await inventoryPage.getActionButtonText(product)).toBe('Add to cart');
    expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();
  });

  test('TC_SD_019 - Open side navigation menu', async () => {
    await inventoryPage.openSideMenu();

    expect(await inventoryPage.isSideMenuVisible()).toBeTruthy();
    expect(await inventoryPage.isAllItemsOptionVisible()).toBeTruthy();
    expect(await inventoryPage.isAboutOptionVisible()).toBeTruthy();
    expect(await inventoryPage.isLogoutOptionVisible()).toBeTruthy();
    expect(await inventoryPage.isResetOptionVisible()).toBeTruthy();
  });

  test('TC_SD_020 - Close side navigation menu', async () => {
    await inventoryPage.openSideMenu();
    expect(await inventoryPage.isSideMenuVisible()).toBeTruthy();

    await inventoryPage.closeSideMenu();
    expect(await inventoryPage.isSideMenuVisible()).toBeFalsy();
  });

  test('TC_SD_021 - Select All Items from navigation menu', async ({ page }) => {
    // Navigate away to product details first
    await inventoryPage.openProductDetails(testData.products.backpack.name);
    await expect(page).toHaveURL(/.*inventory-item\.html/);

    // Open side menu and click All Items
    await inventoryPage.openSideMenu();
    await inventoryPage.clickAllItems();

    // Verify user is navigated back to Products listing
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(inventoryPage.titleLocator).toHaveText('Products');
  });

  test('TC_SD_022 - Select About from navigation menu', async () => {
    await inventoryPage.openSideMenu();
    const href = await inventoryPage.getAboutLinkHref();
    expect(href).toContain('saucelabs.com');
  });

  test('TC_SD_023 - Reset application state', async () => {
    // Add two products to cart
    await inventoryPage.addProductToCart(testData.products.backpack.name);
    await inventoryPage.addProductToCart(testData.products.bikeLight.name);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    // Reset app state from side menu
    await inventoryPage.openSideMenu();
    await inventoryPage.clickResetAppState();
    await inventoryPage.closeSideMenu();

    // Verify cart badge is cleared
    expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();
  });
});
