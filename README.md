# SauceDemo Automation

This project is a Playwright + TypeScript automation framework for testing the SauceDemo e-commerce application using the Page Object Model (POM) design pattern.

It covers key user flows such as login, inventory browsing, cart operations, and checkout validation.

## Features

- End-to-end UI automation for SauceDemo
- Page Object Model structure for maintainable tests
- Cross-browser testing setup using Playwright
- HTML and JUnit reporting
- Configurable environment settings via `.env`
- Reusable test data management

## Tech Stack

- Playwright
- TypeScript
- Node.js
- SauceDemo demo site

## Project Structure

```text
saucedemo-automation/
├── config/
│   └── test.config.ts
├── locators/
│   ├── CartLocators.ts
│   ├── CheckoutLocators.ts
│   ├── InventoryLocators.ts
│   └── LoginLocators.ts
├── pages/
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── InventoryPage.ts
│   └── LoginPage.ts
├── test-data/
│   └── users.json
├── tests/
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   ├── inventory.spec.ts
│   └── login.spec.ts
├── utils/
│   └── testData.ts
├── playwright.config.ts
├── package.json
├── results.xml
├── playwright-report/
├── screenshots/
└── test-results/
```

Each page's selectors are defined in its corresponding file under `locators/`,
keeping locator definitions separate from page behavior in `pages/`.

## Prerequisites

Before running the tests, make sure you have the following installed:

- Node.js (recommended LTS version)
- npm

## Setup and Run

From the project root, install the Node.js dependencies and Playwright's Chromium browser:

```bash
npm install
npx playwright install chromium
```

Run the complete test suite:

```bash
npm test
```

## Configuration

This project supports environment-based configuration using a `.env` file. Create a `.env` file in the project root with values similar to:

```env
BASE_URL=https://www.saucedemo.com
STANDARD_USER=standard_user
LOCKED_OUT_USER=locked_out_user
PASSWORD=secret_sauce
INVALID_USER=harikarang28@gmail.com
INVALID_PASSWORD=Test@123
```

If the `.env` file is not present, the framework will fall back to the default SauceDemo URLs and credentials configured inside `config/test.config.ts`.

## Available Scripts

Run the following commands from the project root:

```bash
npm test
```
Runs all Playwright tests.

```bash
npm run test:headed
```
Runs tests in headed browser mode.

```bash
npm run test:login
```
Runs only the login test suite.

```bash
npm run test:inventory
```
Runs only the inventory test suite.

```bash
npm run test:cart
```
Runs only the cart test suite.

```bash
npm run test:checkout
```
Runs only the checkout test suite.

```bash
npm run test:debug
```
Runs tests in debug mode.

```bash
npm run report
```
Opens the generated HTML Playwright report.

## Test Coverage

The table maps each available manual case ID to its automated Playwright test.
All case IDs currently listed in the repository are automated; there are no
manual-only cases in this set.

| Manual case ID | Automated test |
|---|---|
| TC_SD_001 | `tests/login.spec.ts` — Verify login page elements are displayed |
| TC_SD_002 | `tests/login.spec.ts` — Login with valid standard user credentials |
| TC_SD_003 | `tests/login.spec.ts` — Verify locked-out user cannot log in |
| TC_SD_004 | `tests/login.spec.ts` — Verify login with an invalid username |
| TC_SD_005 | `tests/login.spec.ts` — Verify validation when both fields are empty |
| TC_SD_006 | `tests/login.spec.ts` — Verify password is masked while entering |
| TC_SD_007 | `tests/login.spec.ts` — Verify login error message can be dismissed |
| TC_SD_008 | `tests/inventory.spec.ts` — Verify Products page is displayed after login |
| TC_SD_009 | `tests/inventory.spec.ts` — Verify product cards display required information |
| TC_SD_010 | `tests/inventory.spec.ts` — Verify default product sorting |
| TC_SD_011 | `tests/inventory.spec.ts` — Sort products by Name (A to Z) |
| TC_SD_012 | `tests/inventory.spec.ts` — Sort products by Name (Z to A) |
| TC_SD_013 | `tests/inventory.spec.ts` — Sort products by Price (low to high) |
| TC_SD_014 | `tests/inventory.spec.ts` — Sort products by Price (high to low) |
| TC_SD_015 | `tests/inventory.spec.ts` — Open a product details page |
| TC_SD_016 | `tests/inventory.spec.ts` — Add one product to cart |
| TC_SD_017 | `tests/inventory.spec.ts` — Add multiple products and verify cart badge |
| TC_SD_018 | `tests/inventory.spec.ts` — Remove an added product from Products page |
| TC_SD_019 | `tests/inventory.spec.ts` — Open side navigation menu |
| TC_SD_020 | `tests/inventory.spec.ts` — Close side navigation menu |
| TC_SD_021 | `tests/inventory.spec.ts` — Select All Items from navigation menu |
| TC_SD_022 | `tests/inventory.spec.ts` — Select About from navigation menu |
| TC_SD_023 | `tests/inventory.spec.ts` — Reset application state |
| TC_SD_024 | `tests/cart.spec.ts` — Verify cart displays all products added by the user |
| TC_SD_025 | `tests/cart.spec.ts` — Verify cart displays quantity and description headings |
| TC_SD_026 | `tests/cart.spec.ts` — Verify product quantity displayed in cart |
| TC_SD_027 | `tests/cart.spec.ts` — Remove a product from the cart |
| TC_SD_028 | `tests/cart.spec.ts` — Remove the last product and verify empty cart state |
| TC_SD_029 | `tests/cart.spec.ts` — Continue shopping from cart |
| TC_SD_030 | `tests/checkout.spec.ts` — Proceed to checkout with all required information |
| TC_SD_031 | `tests/checkout.spec.ts` — Verify validation when all checkout fields are empty |
| TC_SD_032 | `tests/checkout.spec.ts` — Verify products and prices on Checkout Overview |
| TC_SD_033 | `tests/checkout.spec.ts` — Verify item total, tax and final total calculation |
| TC_SD_034 | `tests/checkout.spec.ts` — Finish checkout and verify order confirmation |
| TC_SD_035 | `tests/checkout.spec.ts` — Verify cart is empty after successful order placement |

## Growing the Suite to 200 Tests

To grow the suite to 200 tests, add cases by feature area while continuing to
reuse the page objects, locator classes, and centralized test data. Keep each
test independent with fresh setup, organize tests in focused spec files, and
use shared fixtures for common setup rather than duplicating flows. Add coverage
incrementally for positive, negative, and boundary scenarios, and run the
parallel suite and review its HTML/JUnit reports regularly to catch flaky tests
and keep execution time manageable.

## Defect Validation Report: Price Low-to-High Sorting

### Report details

| Field | Details |
|---|---|
| Defect ID | Price sorting defect (reported) |
| Application version | 4.2.0 (reported; not independently verified during this run) |
| Browser | Chromium project (branded Google Chrome not independently verified) |
| Feature | Inventory product sorting |
| Sort option | Price (low to high) |
| Reported behavior | The $29.99 product appears before the $15.99 product |
| Reported reproducibility | Consistent on every reported test run |
| Automated test | `TC_PRICE_01_verify_price_low_to_high_sorting` |
| Test file | `tests/price-sorting-defect.spec.ts` |
| Validation status | **Not reproduced in the recorded run** |

### Expected result

After selecting **Price (low to high)**, every displayed product price should
be in ascending numeric order. If both prices are displayed, $15.99 must appear
before $29.99.

### Reproduction steps

1. Open the SauceDemo application.
2. Log in using the existing standard-user login setup.
3. On the Products page, select **Price (low to high)**.
4. Read the displayed price for every product, from top to bottom.
5. Compare the complete price list in numeric ascending order and check that
   $15.99 precedes $29.99 when both are present.

### Automated coverage

The Playwright test reuses the existing `LoginPage` and `InventoryPage`
page-object methods and shared standard-user test data. It selects the `lohi`
sort option, retrieves all displayed prices through the existing inventory page
object, converts them to numeric values, prints their displayed order, and
asserts that the entire list is ascending. It also explicitly asserts the
$15.99/$29.99 relative order when both prices are present. No application
behavior or product prices are modified or mocked.

### Execution evidence

**Command**

```bash
npx playwright test tests/price-sorting-defect.spec.ts --project=chromium
```

**Result:** 1 test passed.

**Actual product price order printed by the test**

```text
$7.99 -> $9.99 -> $15.99 -> $15.99 -> $29.99 -> $49.99
```

The observed order was ascending, and $15.99 appeared before $29.99. Therefore,
the reported defect did not reproduce against the target configured for this
run.

### Environment limitations

The run used the configured Playwright `chromium` project. It does not
independently confirm the target was application version 4.2.0 or branded
Google Chrome. Re-run the test against the reported application version and
browser before treating the defect as resolved.

## Reporting

The Playwright configuration is set up to generate:

- HTML report in `playwright-report/`
- JUnit XML output in `results.xml`
- Test artifacts in `test-results/`

## Notes

- This project uses the SauceDemo demo site for realistic end-to-end testing.
- The tests are built for maintainability and reusability through clear page objects and central test data.
- Screenshots and traces are captured on failure for easier debugging.

## Author

HariKaran.G
