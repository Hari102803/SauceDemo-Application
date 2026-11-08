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

# Section B3 – Defect Report

## Defect Details

**Title:** [Sorting] Price (low to high) displays products in incorrect price order

- **Application version:** 4.2.0
- **Browser:** Google Chrome
- **Test area:** Section A – Product Sorting
- **Test environment:** Chrome browser
- **Severity:** Major (S2)

## Precondition

The user is logged in and the product listing page is displayed.

## Steps to Reproduce

1. Launch the application in Google Chrome.
2. Log in using a Visual_user account.
3. Navigate to the product listing page.
4. Select **Price (low to high)** from the sorting dropdown.
5. Observe the order of the product prices displayed.

## Expected Result

When **Price (low to high)** is selected, all products should be displayed in
ascending order by price. The expected order is:

```text
$4.15 -> $23.60 -> $39.05 -> $42.28 -> $48.46 -> $72.91
```

The entire product list should remain in ascending price order without sorting
inconsistencies.

## Actual Result

The products are reported to appear in the following order after selecting
**Price (low to high)**:

```text
$72.91 -> $42.28 -> $48.46 -> $39.05 -> $23.60 -> $4.15
```

The highest-priced product appears before the lowest-priced product, so the
displayed order is not ascending. The issue is reported as reproducible in
every test run.

## Severity Reason

The sorting problem makes it harder for users to compare products and find
lower-priced options. Users can still browse and purchase products using other
available options, so this is a major (S2) issue rather than a critical blocker.

## Reference

[Jam recording](https://jam.dev/c/cb7cabdd-bb28-41d4-8565-977e786e13c6)

# B4 Message to the client

I understand that we are targeting a Friday release. However, our latest
testing has identified two concerns.

First, the product sorting issue (B3) is still present, showing products in
the wrong price order. Second, the checkout test fails approximately 1 out of
10 times, even though it passes when repeated. This makes the checkout
reliability uncertain.

My recommendation is to avoid a full release on Friday until these issues are
investigated and verified.

As an alternative, we could release the unaffected features on Friday while
keeping the affected changes on hold. Meanwhile, the team can investigate the
checkout issue and fix the sorting defect. We can then complete another round
of testing before releasing the remaining changes.

This approach will help reduce customer impact while keeping the release
progress on track.

Thanks!
