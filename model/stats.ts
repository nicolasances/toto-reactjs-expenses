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
    months: MonthTotal[];           // One entry per month
}

export interface SavingsResponse {
    savings: any[];                 // Savings entries (per month or per year, depending on the endpoint)
}

export interface UnconsolidatedMonthsResponse {
    unconsolidated: any[];          // Months that still contain unconsolidated transactions
}

export interface CategoryTotalsPerMonthResponse {
    [key: string]: any;             // Category totals per month
}

export interface CategoriesAvgMonthlySpendResponse {
    [key: string]: any;             // Average monthly spend per category per year
}

export interface SalaryForecast {
    amount: number;                 // Forecasted salary of the current month
    [key: string]: any;             // Other fields returned by the API
}

export type StatsResponse = Record<string, any>;
