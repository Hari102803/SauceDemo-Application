# Section B1 – AI-Generated Test Code Review

## 1. Problems Identified

The original AI-generated test had the following issues:

1. **Weak assertion:** `expect(total).toBeTruthy()` only checks whether the total exists; it does not validate the calculated amount.
2. **Hardcoded credentials:** Login credentials were included directly in the test instead of using reusable test data.
3. **Weak test data:** Checkout details used meaningless single-character values.
4. **Fixed wait:** `waitForTimeout(3000)` introduced unnecessary delays and could make the test unreliable.
5. **Ambiguous locator:** `text=Add to cart` did not uniquely identify the intended product.
6. **Missing product validation:** The test did not verify which products were added.
7. **Missing cart badge assertion:** It did not verify the cart item count.
8. **Missing cart validation:** It did not verify the products displayed in the cart.
9. **Missing navigation assertions:** It did not verify successful login or checkout navigation.
10. **Missing price validation:** It did not verify individual product prices or the subtotal.
11. **Missing tax validation:** It did not verify the tax amount.
12. **Missing total calculation:** It did not independently verify that subtotal plus tax equals the final total.
13. **Poor maintainability:** Locators and actions were written directly in the test instead of using reusable Page Object Model methods.
14. **Insufficient test coverage:** The test only checked that some total text existed, not whether the total was correct.

## 2. Improvements Made

- Used reusable Page Object Model methods and specific locators.
- Selected two known products and verified their names and prices in the cart and checkout overview.
- Verified successful login and cart/checkout navigation.
- Verified the cart badge count and cart item count.
- Used meaningful checkout information from shared test data.
- Avoided fixed timeouts and relied on Playwright's auto-waiting assertions.
- Validated the item subtotal, expected 8% tax, and independently calculated final total.

## 3. Expected Result

- Sauce Labs Backpack: $29.99
- Sauce Labs Bike Light: $9.99
- Item total: $39.98
- Tax: $3.20
- Final total: $43.18

The test passes only when the displayed checkout subtotal, tax, and final total match the expected calculated amounts.

# Section B2 – Evaluation Set: Test Case Generator

The AI-powered test case generator converts user stories into test cases in a predefined JSON format. These test cases are imported directly into the test management tool.

## 1. Test Coverage

- **Check:** Verify whether the AI generates test cases covering all important scenarios mentioned or implied by the user story, including positive, negative, and boundary scenarios.
- **Example:** For a login user story, verify that valid login, invalid login, empty username, and empty password scenarios are covered.
- **Scoring:** Automatic.
- **Scoring approach:** Compare generated test cases against an expected scenario list and calculate the coverage percentage.

## 2. Invented Requirements

- **Check:** Verify that the AI does not introduce requirements, features, or validations that are not mentioned or reasonably supported by the user story.
- **Example:** If the user story only mentions username and password authentication, the AI should not introduce OTP verification as a mandatory requirement.
- **Scoring:** Human Review.
- **Scoring approach:** A QA reviewer compares the generated test cases with the original user story and identifies unsupported assumptions.

## 3. Duplicate Test Cases

- **Check:** Verify that the AI does not generate multiple test cases covering the same scenario with slightly different wording.
- **Example:** “Verify login with invalid username” and “Check login using incorrect username” may represent duplicate scenarios.
- **Scoring:** Automatic.
- **Scoring approach:** Compare test case titles, descriptions, and steps using text similarity checks to identify potential duplicates.

## 4. JSON Format Validation

- **Check:** Verify that the generated output follows the required JSON structure and contains all mandatory fields with the correct data types.
- **Example:** Each test case must contain fields such as `testCaseId`, `title`, `priority`, `steps`, and `expectedResult`.
- **Scoring:** Automatic.
- **Scoring approach:** Parse the generated output using a JSON parser and validate it against the predefined JSON schema.

## Summary

The evaluation set uses three automatic checks and one human review check. This combination helps ensure that generated test cases are complete, relevant, non-duplicated, and technically valid before importing them into the test management tool.
