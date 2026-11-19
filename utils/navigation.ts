import moment from 'moment';

/**
 * Inputs used to decide which month the expenses list should show.
 */
export interface SelectedYearMonthInput {
    cookieYearMonth?: string | null;    // Last month the user looked at, cached in the "expensesListYearMonth" cookie (YYYYMM)
    queryYearMonth?: string | null;     // The "yearMonth" URL query param (YYYYMM)
    today: Date;                        // The current date, used as a fallback
}

const YEAR_MONTH_FORMAT = /^\d{6}$/;

/**
 * Resolves the yearMonth (YYYYMM) to display in the expenses list.
 *
 * Precedence (same as the pre-Next.js app):
 * - the cookie with the last used month overrides everything
 * - then the "yearMonth" query param (this replaces the old router state "selectedMonth")
 * - otherwise the current month
 *
 * @param {SelectedYearMonthInput} input - the candidate sources of the yearMonth
 *
 * @returns {string} the yearMonth as YYYYMM
 */
export function resolveSelectedYearMonth(input: SelectedYearMonthInput): string {

    if (input.cookieYearMonth && YEAR_MONTH_FORMAT.test(input.cookieYearMonth)) return input.cookieYearMonth;

    if (input.queryYearMonth && YEAR_MONTH_FORMAT.test(input.queryYearMonth)) return input.queryYearMonth;

    return moment(input.today).format('YYYYMM');
}

/**
 * Tells whether the "income" query param flags the transaction as an income.
 *
 * @param {string | null} incomeParam - the raw value of the "income" query param
 *
 * @returns {boolean} true only if the param is "true"
 */
export function isIncomeParam(incomeParam: string | null): boolean {

    return incomeParam === 'true';
}
