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
├── test-results/
└── README.md
```

## Prerequisites

Before running the tests, make sure you have the following installed:

- Node.js (recommended LTS version)
- npm

## Installation

1. Clone the repository
2. Go to the project folder
3. Install dependencies:

```bash
npm install
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

The automation suite includes scenarios such as:

- Login page visibility checks
- Valid and invalid login attempts
- Locked-out user scenarios
- Empty field validation
- Password masking validation
- Inventory product listing validation
- Cart item behavior
- Checkout flow validation

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
