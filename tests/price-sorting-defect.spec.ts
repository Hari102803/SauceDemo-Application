import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { testData } from '../utils/testData';

test.describe('Price sorting defect', () => {
  test('TC_PRICE_01_verify_price_low_to_high_sorting', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login(testData.users.standard, testData.users.password);
    await expect(page).toHaveURL(/.*inventory\.html/);

    await inventoryPage.selectSortOption('lohi');
    const prices = await inventoryPage.getAllProductPrices();
    const formatPrices = (values: number[]) =>
      values.map((price) => `$${price.toFixed(2)}`).join(' -> ');
    const actualOrder = formatPrices(prices);
    const expectedOrder = formatPrices([...prices].sort((a, b) => a - b));

    console.log(`[TC_PRICE_01] Actual product price order: ${actualOrder}`);

    expect(prices.length, 'Expected at least one product price to be displayed').toBeGreaterThan(0);
    expect.soft(
      prices,
      `Expected every displayed product price in ascending order. Expected: ${expectedOrder}. Actual: ${actualOrder}`
    ).toEqual([...prices].sort((a, b) => a - b));

    const lowerPriceIndex = prices.indexOf(15.99);
    const higherPriceIndex = prices.indexOf(29.99);
    if (lowerPriceIndex !== -1 && higherPriceIndex !== -1) {
      expect.soft(
        lowerPriceIndex,
        `Expected $15.99 to appear before $29.99 when both are displayed. Actual order: ${actualOrder}`
      ).toBeLessThan(higherPriceIndex);
    }
  });
});
