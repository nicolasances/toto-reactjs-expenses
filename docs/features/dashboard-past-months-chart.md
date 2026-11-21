# Dashboard: chart of the last months' total expenses and incomes

## Summary
A bar chart on the home screen that shows the total expenses of each of the past months as bars, with the total incomes of the same months drawn as an overlay line. Tapping a bar opens the expenses list of that month.

## User-facing behaviour
- The home screen shows the chart under the shortcut buttons, with `months={9}`.
- One bar per month, **oldest on the left**. The x axis label is the short month name (e.g. `Oct`).
- Each bar has the rounded total of the month as a label, formatted with the `it` locale.
- The incomes are drawn as a line with a point per month, on top of the bars.
- Bars and line share the same y scale.
- **Tapping a bar** navigates to `/expenses?yearMonth=<YYYYMM>` for that month (see [Expenses list](expenses-list.md)).

## Data sources
All calls go to `toto-ms-expenses` (the `expensesV2` endpoint). Amounts are requested in the user's currency.

| Call | Endpoint | Used for |
|------|----------|----------|
| `ExpensesAPI.getSettings()` | `GET /settings` | the user's currency (falls back to `EUR` if not available) |
| `ExpensesAPI.getExpensesPerMonth(yearMonthGte, currency)` | `GET /stats/expensesPerMonth?yearMonthGte={yearMonthGte}&currency={currency}` | the bars |
| `ExpensesAPI.getIncomesPerMonth(yearMonthGte, currency)` | `GET /stats/incomesPerMonth?yearMonthGte={yearMonthGte}&currency={currency}` | the income line |

Both responses nest the list of months in `months.months`, each entry being `{ yearMonth, amount, ... }`.

### Which months are shown
`yearMonthGte` is the first day of the current month minus `months` months, as `YYYYMM`. With `months={9}` the range covers the 9 past months **plus the current month**, so 10 months. The months shown are the ones returned by the expenses call.

### How the line is built
- One point per month of the expenses data, matched by `yearMonth`.
- A month without income gets a point at `0`, **except the last month** (the current month): if it has no income yet, no point is drawn for it.
- If the incomes call returns no months at all, the line is not drawn.

### How the y scale is computed
The max of the y scale is computed by `computeYMax` (`utils/chartScale.ts`): the highest value across **both the bars and the line**. This keeps an income point that is higher than every bar inside the chart. With no data at all, the max is `0`.

## Edge cases & errors
- **Loading**: nothing is drawn until both calls have returned.
- **No expenses returned**: the chart has no bars.
- **A failed call** is not handled: nothing is drawn and no error is shown.

## Out of scope
- The other graphs in `components/graphs` (savings per year, categories etc.).
- The expenses list screen itself (see [Expenses list](expenses-list.md)).
- Computation of the monthly totals (done by `toto-ms-expenses`).

## Related code
- `components/graphs/PastMonthsGraph.tsx`: loads and prepares the data
- `components/chart/TotoBarChart.tsx`: draws the bars and the line
- `utils/chartScale.ts`: `computeYMax` (tested in `__tests__/chartScale.test.ts`)
- `app/HomeScreen.tsx`: where the chart is used
- `api/ExpensesAPI.ts`: the API client
