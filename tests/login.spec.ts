
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { testData } from '../utils/testData';

test.describe('Login Functionality - SauceDemo', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // TC_SD_001
  test('TC_SD_001 - Verify login page elements are displayed', async () => {

    await expect(loginPage.logoLocator).toBeVisible();
    await expect(loginPage.usernameLocator).toBeVisible();
    await expect(loginPage.passwordLocator).toBeVisible();
    await expect(loginPage.loginButtonLocator).toBeVisible();

    await expect(loginPage.errorLocator).not.toBeVisible();
  });

  // TC_SD_002
  test('TC_SD_002 - Login with valid standard user credentials', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);

    await loginPage.login(
      testData.users.standard,
      testData.users.password
    );

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(inventoryPage.titleLocator).toHaveText('Products');
  });

  // TC_SD_003
  test('TC_SD_003 - Verify locked-out user cannot log in', async () => {

    await loginPage.login(
      testData.users.lockedOut,
      testData.users.password
    );

    await expect(loginPage.errorLocator).toBeVisible();
    await expect(loginPage.errorLocator).toHaveText(
      testData.messages.lockedOutError
    );
  });

  // TC_SD_004
  test('TC_SD_004 - Verify login with an invalid username', async () => {

    await loginPage.login(
      testData.users.invalidUser,
      testData.users.invalidPassword
    );

    await expect(loginPage.errorLocator).toBeVisible();
    await expect(loginPage.errorLocator).toHaveText(
      testData.messages.invalidCredentialsError
    );
  });

  // TC_SD_005
  test('TC_SD_005 - Verify validation when both fields are empty', async () => {

    await loginPage.clickLogin();

    await expect(loginPage.errorLocator).toBeVisible();
    await expect(loginPage.errorLocator).toHaveText(
      testData.messages.usernameRequiredError
    );
  });

  // TC_SD_006
  test('TC_SD_006 - Verify password is masked while entering', async () => {

    await loginPage.enterPassword(testData.users.password);

    await expect(loginPage.passwordLocator).toHaveAttribute(
      'type',
      'password'
    );
  });

  // TC_SD_007
  test('TC_SD_007 - Verify login error message can be dismissed', async () => {

    await loginPage.clickLogin();

    await expect(loginPage.errorLocator).toBeVisible();

    await loginPage.closeErrorMessage();

    await expect(loginPage.errorLocator).not.toBeVisible();
  });

});
