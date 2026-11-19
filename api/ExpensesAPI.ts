import { TotoAPI, jsonRequest } from './TotoAPI';
import { Expense, ExpenseInput, GetExpensesResponse, GetIncomesResponse, Income, IncomeInput, WriteResponse } from '@/model/expense';
import { Settings } from '@/model/settings';
import { GetTagExpensesResponse, GetTagsResponse, Tag } from '@/model/tag';
import { CategoriesAvgMonthlySpendResponse, CategoryTotalsPerMonthResponse, ExpensesPerDayResponse, MonthTotalResponse, MonthsTotalsResponse, SavingsResponse, StatsResponse, UnconsolidatedMonthsResponse } from '@/model/stats';

/**
 * API to access the expenses microservices ("expenses" v1 and "expensesV2").
 *
 * Endpoints, query strings and payloads are the same as in the pre-TypeScript app.
 */
export class ExpensesAPI {

  /**
   * Gets the generic app settings (v1).
   */
  async getAppSettings(userEmail: string): Promise<Settings> {

    return new TotoAPI().fetchJson('expensesV2', '/settings?user=' + userEmail);
  }

  /**
   * Updates the generic app settings (v1).
   */
  async putAppSettings(settings: Settings): Promise<WriteResponse> {

    return new TotoAPI().fetchJson('expensesV2', '/settings', jsonRequest('PUT', settings));
  }

  /**
   * Retrieves the expenses of a month, most recent first.
   */
  async getExpenses(userEmail: string, yearMonth: string): Promise<GetExpensesResponse> {

    return new TotoAPI().fetchJson('expensesV2', '/expenses?yearMonth=' + yearMonth + '&sortDate=true&sortDesc=true&user=' + userEmail);
  }

  /**
   * Retrieves the incomes of a month.
   */
  async getIncomes(yearMonth: string): Promise<GetIncomesResponse> {

    return new TotoAPI().fetchJson('expensesV2', `/incomes?yearMonth=${yearMonth}`);
  }

  /**
   * Retrieves the category totals per month since yearMonthGte, in the given currency.
   */
  async getCategoryTotalsPerMonth(yearMonthGte: string, currency: string): Promise<CategoryTotalsPerMonthResponse> {

    return new TotoAPI().fetchJson('expensesV2', `/stats/categoryTotalsPerMonth?yearMonthGte=${yearMonthGte}&currency=${currency}`);
  }

  /**
   * Retrieves an expense.
   */
  async getExpense(id: string): Promise<Expense> {

    return new TotoAPI().fetchJson('expensesV2', '/expenses/' + id);
  }

  /**
   * Retrieves an income.
   */
  async getIncome(id: string): Promise<Income> {

    return new TotoAPI().fetchJson('expensesV2', '/incomes/' + id);
  }

  /**
   * Creates an expense.
   */
  async postExpense(expense: ExpenseInput): Promise<WriteResponse> {

    return new TotoAPI().fetchJson('expensesV2', '/expenses', jsonRequest('POST', expense));
  }

  /**
   * Creates an income.
   */
  async postIncome(income: IncomeInput): Promise<WriteResponse> {

    return new TotoAPI().fetchJson('expensesV2', '/incomes', jsonRequest('POST', income));
  }

  /**
   * Deletes an expense.
   */
  async deleteExpense(expenseId: string): Promise<WriteResponse> {

    return new TotoAPI().fetchJson('expensesV2', '/expenses/' + expenseId, { method: 'DELETE' });
  }

  /**
   * Updates an expense.
   */
  async putExpense(expenseId: string, expense: Partial<ExpenseInput>): Promise<WriteResponse> {

    return new TotoAPI().fetchJson('expensesV2', '/expenses/' + expenseId, jsonRequest('PUT', expense));
  }

  /**
   * Updates an income.
   */
  async putIncome(id: string, income: Partial<IncomeInput>): Promise<WriteResponse> {

    return new TotoAPI().fetchJson('expensesV2', '/incomes/' + id, jsonRequest('PUT', income));
  }

  /**
   * Marks an expense as consolidated.
   */
  async consolidateExpense(expenseId: string): Promise<WriteResponse> {

    return new TotoAPI().fetch('expensesV2', '/expenses/' + expenseId, jsonRequest('PUT', { consolidated: true }));
  }

  /**
   * Retrieves the total spending of a month (default currency: EUR).
   */
  async getMonthTotalSpending(yearMonth: string, targetCurrency?: string): Promise<MonthTotalResponse> {

    const currency = targetCurrency ? targetCurrency : "EUR";

    return new TotoAPI().fetchJson('expensesV2', `/expenses/${yearMonth}/total?currency=${currency}`);
  }

  /**
   * Retrieves the total spending of each day between dateFrom and dateTo (dates as YYYYMMDD).
   */
  async getExpensesPerDay(userEmail: string, dateFrom: string, dateTo?: string | null, targetCurrency?: string): Promise<ExpensesPerDayResponse> {

    const dateToFilter = dateTo == null ? '' : ('&dateTo=' + dateTo);
    const currencyFilter = targetCurrency ? '&targetCurrency=' + targetCurrency : '';

    return new TotoAPI().fetchJson('expenses', '/stats/expensesPerDay?user=' + userEmail + '&dateFrom=' + dateFrom + dateToFilter + currencyFilter);
  }

  /**
   * Retrieves the total spending of each month since yearMonthGte.
   */
  async getExpensesPerMonth(yearMonthGte: string, targetCurrency: string): Promise<MonthsTotalsResponse> {

    return new TotoAPI().fetchJson('expensesV2', `/stats/expensesPerMonth?yearMonthGte=${yearMonthGte}&currency=${targetCurrency}`);
  }

  /**
   * Retrieves the total incomes of each month since yearMonthGte.
   */
  async getIncomesPerMonth(yearMonthGte: string, targetCurrency: string): Promise<MonthsTotalsResponse> {

    return new TotoAPI().fetchJson('expensesV2', `/stats/incomesPerMonth?yearMonthGte=${yearMonthGte}&currency=${targetCurrency}`);
  }

  /**
   * Retrieves the savings of each month of the given year.
   */
  async getSavingsOfYear(year: string | number, targetCurrency: string): Promise<SavingsResponse> {

    const yearMonthGte = `${year}01`
    const yearMonthLte = `${year}12`

    return new TotoAPI().fetchJson('expensesV2', `/stats/savingsPerMonth?yearMonthGte=${yearMonthGte}&yearMonthLte=${yearMonthLte}&currency=${targetCurrency}`);
  }

  /**
   * Retrieves the total spending of each year.
   */
  async getExpensesPerYear(userEmail: string, targetCurrency?: string): Promise<StatsResponse> {

    const targetCurrencyFilter = targetCurrency ? '&targetCurrency=' + targetCurrency : ''

    return new TotoAPI().fetchJson('expensesV2', '/stats/expensesPerYear?user=' + userEmail + targetCurrencyFilter);
  }

  /**
   * Retrieves the top spending categories of a month.
   */
  async getTopSpendingCategoriesOfMonth(userEmail: string, yearMonth: string, maxCategories?: number, targetCurrency?: string): Promise<StatsResponse> {

    const maxCatFilter = maxCategories ? '&maxCategories=' + maxCategories : '';
    const targetCurrencyFilter = targetCurrency ? '&targetCurrency=' + targetCurrency : ''

    return new TotoAPI().fetchJson('expensesV2', '/stats/topCategoriesOfMonth?user=' + userEmail + '&yearMonth=' + yearMonth + maxCatFilter + targetCurrencyFilter);
  }

  /**
   * Retrieves the top spending categories of each month since yearMonthGte.
   */
  async getTopSpendingCategoriesPerMonth(userEmail: string, yearMonthGte: string, targetCurrency?: string): Promise<StatsResponse> {

    const targetCurrencyFilter = targetCurrency ? '&targetCurrency=' + targetCurrency : ''

    return new TotoAPI().fetchJson('expensesV2', '/stats/topCategoriesPerMonth?user=' + userEmail + '&yearMonthGte=' + yearMonthGte + targetCurrencyFilter);
  }

  /**
   * Retrieves the savings of each year since yearMonthGte.
   */
  async getSavingsPerYear(yearMonthGte: string, targetCurrency: string): Promise<SavingsResponse> {

    return new TotoAPI().fetchJson('expensesV2', `/stats/savingsPerYear?yearMonthGte=${yearMonthGte}&currency=${targetCurrency}`);
  }

  /**
   * Retrieves the user settings.
   */
  async getSettings(): Promise<Settings> {

    return new TotoAPI().fetchJson('expensesV2', '/settings');
  }

  /**
   * Updates the user settings.
   */
  async putSettings(settings: Partial<Settings>): Promise<WriteResponse> {

    return new TotoAPI().fetchJson('expensesV2', '/settings', jsonRequest('PUT', settings));
  }

  /**
   * Creates a tag (e.g. "Paternity Trip").
   */
  async postTag(tagName: string): Promise<WriteResponse> {

    return new TotoAPI().fetchJson('expensesV2', '/tags', jsonRequest('POST', { tagName: tagName }));
  }

  /**
   * Deletes a tag.
   */
  async deleteTag(tagId: string): Promise<WriteResponse> {

    return new TotoAPI().fetchJson('expensesV2', `/tags/${tagId}`, jsonRequest('DELETE'));
  }

  /**
   * Retrieves the tags, with amounts in the target currency.
   */
  async getTags(targetCurrency: string): Promise<GetTagsResponse> {

    return new TotoAPI().fetchJson('expensesV2', `/tags?targetCurrency=${targetCurrency}`);
  }

  /**
   * Retrieves a tag, with amounts in the target currency.
   */
  async getTag(tagId: string, targetCurrency: string): Promise<Tag> {

    return new TotoAPI().fetchJson('expensesV2', `/tags/${tagId}?targetCurrency=${targetCurrency}`);
  }

  /**
   * Retrieves the expenses with the specified tag.
   */
  async getTagExpenses(tagId: string): Promise<GetTagExpensesResponse> {

    return new TotoAPI().fetchJson('expensesV2', `/tags/${tagId}/expenses`);
  }

  /**
   * Adds a tag to an expense.
   */
  async tagExpense(expenseId: string, tagId: string): Promise<WriteResponse> {

    return new TotoAPI().fetchJson('expensesV2', `/expenses/${expenseId}/tags`, jsonRequest('POST', { tagId: tagId }));
  }

  /**
   * Removes a tag from an expense.
   */
  async untagExpense(expenseId: string, tagId: string): Promise<WriteResponse> {

    return new TotoAPI().fetchJson('expensesV2', `/expenses/${expenseId}/tags/${tagId}`, jsonRequest('DELETE'));
  }

  /**
   * Retrieves the months that still have unconsolidated transactions.
   */
  async getUnconsolidatedMonths(targetCurrency: string): Promise<UnconsolidatedMonthsResponse> {

    return new TotoAPI().fetchJson('expensesV2', `/insights/unconsolidated?targetCurrency=${targetCurrency}`);
  }

  /**
   * Retrieves the average monthly spend per category per year since yearMonthGte.
   */
  async getCategoriesAvgMonthlySpendPerYear(yearMonthGte: string, targetCurrency: string): Promise<CategoriesAvgMonthlySpendResponse> {

    return new TotoAPI().fetchJson('expensesV2', `/stats/categoryAvgMonthlySpendPerYear?&yearMonthGte=${yearMonthGte}&targetCurrency=${targetCurrency}`);
  }
}
