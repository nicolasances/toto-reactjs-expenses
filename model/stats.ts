/**
 * Statistics returned by the expenses APIs (/stats/*, /insights/*) and the incast API.
 *
 * Item shapes were inferred from the pre-TypeScript app: verify against the backend before relying on optional fields.
 */

export interface MonthTotalResponse {
    total: number;                  // Total spent in the month
}

export interface DayTotal {
    date: string;                   // YYYYMMDD
    amount: number;                 // Total spent that day
}

export interface ExpensesPerDayResponse {
    days: DayTotal[];               // One entry per day with spending
}

export interface MonthTotal {
    yearMonth: string;              // YYYYMM
    amount: number;                 // Total of the month
    [key: string]: any;             // Other fields returned by the API
}

export interface MonthsTotalsResponse {
    months: { months: MonthTotal[] };   // Wrapper object; the actual list of months (one entry per month) is in months.months
}

export interface SavingEntry {
    saving: number;                 // Savings of the period (negative when spending exceeded income)
    month?: string;                 // MM, only for the per-month endpoint
    year?: number;                  // YYYY, only for the per-year endpoint
}

export interface SavingsResponse {
    savings: SavingEntry[];         // Savings entries (per month or per year, depending on the endpoint)
}

export interface UnconsolidatedMonthsResponse {
    unconsolidated: any[];          // Months that still contain unconsolidated transactions
}

export interface CategoryMonthAmount {
    yearMonth: string;              // YYYYMM
    amount: number;                 // Total spent on the category in that month
}

export interface CategoryMonthlyTotals {
    category: string;               // Category code
    months: CategoryMonthAmount[];  // Totals per month (some months can be missing)
}

export interface CategoryTotalsPerMonthResponse {
    categories?: CategoryMonthlyTotals[];   // Totals per month, for each category
    [key: string]: any;             // Category totals per month
}

export interface CategoryYearAvgSpend {
    year: number;                   // The year
    amount: number;                 // Average monthly spend of the category in that year
}

export interface CategoryAvgMonthlySpend {
    category: string;                       // Category code
    avgMonthlySpend?: CategoryYearAvgSpend[];   // Average monthly spend, per year
}

export interface CategoriesAvgMonthlySpendResponse {
    categories?: CategoryAvgMonthlySpend[]; // Average monthly spend per category per year
    [key: string]: any;             // Other fields returned by the API
}

export interface SalaryForecast {
    amount: number;                 // Forecasted salary of the current month
    [key: string]: any;             // Other fields returned by the API
}

export type StatsResponse = Record<string, any>;
