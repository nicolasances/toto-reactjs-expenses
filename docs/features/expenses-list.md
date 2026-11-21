# Expenses list and month browser

## Summary
A screen (title: "Payments list") that lists the expenses **and** incomes of one month in a single list. The user can move between months, change the category of an item, mark an expense as consolidated and open the detail of an item.

## User-facing behaviour
- **Month navigator**: a scroll picker with the selected month. Moving to the previous or next month reloads the list.
- **List**: expenses and incomes of the selected month, merged and sorted by date (most recent first). Each row shows:
  - an avatar with the icon of the category
  - the date
  - the description
  - the amount, prefixed by the currency (`€` for EUR, `kr.` for DKK, otherwise the currency code). Incomes have a `+ ` prefix and a different style from payments.
  - highlight icons: a **reconcile** icon if the item is not consolidated, and a **bank** icon if the item was imported from a bank statement (`additionalData.source === 'bank-statement'`).
  - a `monthly` marker for expenses that have it.
- **Title bar**: back button and a "new expense" button that opens `/newExpense?yearMonth=<selected month>`.

### Actions
| Action | What happens |
|--------|--------------|
| Tap the **avatar** | Opens a category popup. Choosing a category updates the item: `PUT /incomes/{id}` for an income, `PUT /expenses/{id}` for an expense. The list is not reloaded, the new category is applied to the row in memory. |
| Tap the **reconcile** icon | Consolidates the item with `PUT /expenses/{id}` (`{ "consolidated": true }`), then reloads the list. |
| Tap a **row** | Navigates to `/expenses/{id}`, with `?income=true` appended for incomes. The detail screen is not documented here. |

### Which month is shown
The month is resolved when the screen opens (`resolveSelectedYearMonth`), in this order:
1. the `expensesListYearMonth` cookie, if it holds a valid month
2. the `yearMonth` query param (`YYYYMM`)
3. the current month

The cookie is written every time the user changes month in the navigator and **expires after 5 minutes**. It is removed when the user taps the back button of the screen, so that opening the list again from the home screen starts on the requested month. Since the cookie has precedence, a `?yearMonth=` param is ignored while a recent cookie exists.

The list is opened from:
- the list shortcut on the home screen, with the current month
- a tap on a bar of the [past months chart](dashboard-past-months-chart.md), with that month

## Data sources
All calls go to `toto-ms-expenses` (the `expensesV2` endpoint).

| Call | Endpoint | Used for |
|------|----------|----------|
| `ExpensesAPI.getExpenses(userEmail, yearMonth)` | `GET /expenses?yearMonth={yearMonth}&sortDate=true&sortDesc=true&user={userEmail}` | the expenses of the month |
| `ExpensesAPI.getIncomes(yearMonth)` | `GET /incomes?yearMonth={yearMonth}` | the incomes of the month |
| `ExpensesAPI.putExpense(id, expense)` | `PUT /expenses/{id}` | category change of an expense |
| `ExpensesAPI.putIncome(id, income)` | `PUT /incomes/{id}` | category change of an income |
| `ExpensesAPI.consolidateExpense(id)` | `PUT /expenses/{id}` | consolidation |

Incomes are tagged as incomes in the client (`income: true`) and merged with the expenses. Amounts are shown in the currency of each item, with no conversion.

## Edge cases & errors
- **Loading**: the list is empty until both calls have returned. There is no loader.
- **No expenses and no incomes**: the list is empty, there is no empty-state message.
- **Failed calls** (loading, category change, consolidation) are not handled in the screen: no error is shown. If the category update fails, the row keeps showing the new category until the list is reloaded.
- The reconcile icon is shown for any item that is not consolidated, **including incomes**, but it always calls the expenses endpoint.

## Out of scope
- The expense / income detail and edit screen (`app/expenses/[id]`). Only the navigation to it is described.
- The new expense screen.
- Other ways of changing items (e.g. deleting).

## Related code
- `app/expenses/ExpensesScreen.tsx`: the screen
- `utils/navigation.ts`: `resolveSelectedYearMonth` (tested in `__tests__/navigation.test.ts`)
- `components/TotoList.tsx`: the list
- `components/picker/ScrollPicker.tsx` and `components/picker/YearMonthTile.tsx`: the month navigator
- `components/categorypicker/CategorySelectionPopup.tsx`: the category popup
- `api/ExpensesAPI.ts`: the API client
