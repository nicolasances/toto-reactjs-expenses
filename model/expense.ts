/**
 * Data model of expenses and incomes, as returned by the expenses APIs.
 *
 * Fields were inferred from how the pre-TypeScript app used them. Fields marked optional are either
 * genuinely optional or not confirmed against the backend: verify them before relying on them.
 */

/**
 * An expense ("payment").
 */
export interface Expense {
    id: string;                     // Id of the expense
    amount: number;                 // Amount, in the expense's currency
    currency: string;               // ISO currency code (e.g. EUR, DKK)
    category: string;               // Category code (see utils/CategoriesMap)
    date: string;                   // Date of the expense, YYYYMMDD
    description: string;            // Free-text description
    yearMonth?: string;             // YYYYMM of the expense
    monthly?: boolean;              // True if the expense is recurring every month
    consolidated?: boolean;         // True if the expense has been consolidated (reconciled)
    tags?: string[];                // Ids of the tags attached to the expense
    localCurrencyAmount?: number;   // Amount converted to the user's currency
    additionalData?: any;           // Extra data attached by other services (e.g. games)
    user?: string;                  // Email of the user owning the expense
}

/**
 * An income.
 */
export interface Income {
    id: string;                     // Id of the income
    amount: number;                 // Amount, in the income's currency
    currency: string;               // ISO currency code
    category: string;               // Income category code (see utils/IncomeCategoriesMap)
    date: string;                   // Date of the income, YYYYMMDD
    description: string;            // Free-text description
    yearMonth?: string;             // YYYYMM of the income
    consolidated?: boolean;         // True if the income has been consolidated
    localCurrencyAmount?: number;   // Amount converted to the user's currency
}

/**
 * An expense or an income, as shown together in the expenses list.
 */
export type Transaction = (Expense & { income?: false }) | (Income & { income: true });

/**
 * Payload to create or update an expense.
 */
export interface ExpenseInput {
    amount: number;             // Amount
    currency: string;           // ISO currency code
    category: string;           // Category code
    date: string;               // YYYYMMDD
    description: string;        // Free-text description
    yearMonth?: string;         // YYYYMM
    monthly?: boolean;          // Recurring monthly
    user?: string;              // Email of the user
    [key: string]: any;         // Other fields sent by the forms
}

/**
 * Payload to create or update an income.
 */
export interface IncomeInput {
    amount: number;             // Amount
    currency: string;           // ISO currency code
    category: string;           // Income category code
    date: string;               // YYYYMMDD
    description: string;        // Free-text description
    [key: string]: any;         // Other fields sent by the forms
}

export interface GetExpensesResponse {
    expenses: Expense[];        // The expenses of the month, most recent first
}

export interface GetIncomesResponse {
    incomes: Income[];          // The incomes of the month
}

/**
 * Generic response of create/update/delete calls.
 */
export interface WriteResponse {
    id?: string;                // Id of the created/updated object, when returned
    [key: string]: any;         // Other fields returned by the API
}
