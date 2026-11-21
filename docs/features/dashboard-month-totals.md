# Dashboard: current month's expenses, (expected) income and (expected) savings

## Summary
The top of the home screen shows up to three bubbles for the **current month**: income, expected savings and expenses.
If the salary of the month has not been received yet, the income is **predicted** using the salary prediction of `toto-ms-expenses`, so income and savings are *expected* values until the salary arrives.

This document describes the **V2** dashboard highlights (`DashboardKeyInfoV2`).

## User-facing behaviour
- Three bubbles are shown, in this order:
  1. **Income**: the currency, the amount and an income arrow icon.
  2. **Savings**: the currency, the amount and the label `savings`.
  3. **Expenses**: the currency, the amount, the label `expenses` and an expenses arrow icon.
- Amounts are shown rounded to whole numbers, formatted with the `it` locale.
- The currency shown is the one in the user's settings.
- The bubbles are not interactive.
- Which dashboard is shown is decided by `HomeScreen`, based on the `dashboardHighlightsVersion` setting: `V2` shows this dashboard, any other value (or none) shows V1.

## Data sources
All calls go to `toto-ms-expenses` (the `expensesV2` endpoint).

| Call | Endpoint | Used for |
|------|----------|----------|
| `ExpensesAPI.getSettings()` | `GET /settings` | the user's currency |
| `ExpensesAPI.getMonthTotalSpending(yearMonth, currency)` | `GET /expenses/{yearMonth}/total?currency={currency}` | total expenses of the current month (`total`) |
| `ExpensesAPI.getIncomes(yearMonth)` | `GET /incomes?yearMonth={yearMonth}` | the incomes received so far this month |
| `ExpensesAPI.getSalaryPrediction(currency)` | `GET /predictions/salary?currency={currency}` | the predicted salary (`predictedSalary`). Only called when needed, see below |

`yearMonth` is the current month, `YYYYMM`.

### How the values are calculated
The calculation is done locally, by `computeIncomeAndSavings` (`utils/incomeSavings.ts`).

- A **salary** is an income whose `category` is `SALARY`.
- **Salary already received** (at least one `SALARY` income this month):
  - the prediction endpoint is **not** called
  - income = sum of all the incomes of the month
- **Salary not received yet**:
  - income = sum of the incomes received so far + `predictedSalary`
- **Expected savings** = income − total expenses of the month.

The incomes of the month are summed as returned by `/incomes` (`amount`), without currency conversion.

The prediction itself is defined by `toto-ms-expenses`: the average salary of the last three completed months, returned as `null` when it has no salary data. See [Salary Prediction](https://github.com/nicolasances/toto-ms-expenses/blob/main/docs/features/salary-prediction.md).

## Edge cases & errors
- **Loading**: a loader is shown inside each bubble until all the data is loaded.
- **Prediction is `null`** (no salary data) **or the prediction call fails**, and the salary has not been received: the income and savings bubbles are **hidden** and only the expenses bubble is shown. In that case the expenses bubble is styled like the savings bubble and keeps the `expenses` label. A failed prediction call is only logged to the console.
- **Salary already received**: a prediction problem can never hide the bubbles, since the prediction is not requested.
- **No incomes and no expenses**: the amounts are shown as `0`.
- The calls for settings, expenses total and incomes are not wrapped in error handling: if one of them fails, the bubbles stay in the loading state.

## Out of scope
- `DashboardKeyInfoV1` (the V1 dashboard highlights) is not documented here.
- The prediction logic (it lives in `toto-ms-expenses`).
- Currency conversion of the incomes of the current month.
- The rest of the home screen (shortcut buttons, past months chart).

## Related code
- `components/dashboard/DashboardKeyInfoV2.tsx`: the component
- `utils/incomeSavings.ts`: `hasSalary` and `computeIncomeAndSavings` (unit tested in `__tests__/incomeSavings.test.ts`)
- `api/ExpensesAPI.ts`: the API client
- `model/stats.ts`: `SalaryPrediction`
- `app/HomeScreen.tsx`: switches between V1 and V2
