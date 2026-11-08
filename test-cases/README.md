# Manual Test Cases

The manual test case workbook in this folder contains the SauceDemo test cases
from the supplied spreadsheet. It has 35 cases, identified as `TC_SD_001`
through `TC_SD_035`.

## Test case format

Each case uses the following fields:

| Field | What to include |
|---|---|
| ID | A unique, stable identifier such as `TC_SD_036` |
| Area | The application feature or page covered |
| Type | Scenario category, such as Positive, Negative, Boundary, or UI Validation |
| Title | A concise description of the behavior being tested |
| Pre-conditions | The application state required before starting |
| Steps | Numbered, actionable steps in execution order |
| Test data | Accounts, values, URLs, or products required by the steps |
| Expected result | Observable outcome(s) that determine whether the case passes |
| Priority (P1–P3) | Business or execution priority |
| Automate? (Yes / No) and why | Whether automation is suitable and a short reason |

## Adding or updating cases

Add each new case as a row in the workbook, following the field definitions
above. Keep IDs unique and sequential, use numbered steps, and state expected
results so they can be verified objectively. When a case is automated, record
the corresponding Playwright spec and test title in the automation rationale.
Keep this manual catalog and the automated-case mapping in the project
README in sync.
