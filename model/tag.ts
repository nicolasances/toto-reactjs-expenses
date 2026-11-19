import { Expense } from './expense';

/**
 * A tag that groups expenses (e.g. "Paternity Trip").
 */
export interface Tag {
    id: string;                 // Id of the tag
    name: string;               // Name of the tag
    localCurrencyAmount?: number; // Total spent on the tag, in the requested target currency
    numExpenses?: number;       // Number of expenses with the tag
    minDate?: string;           // Date of the earliest tagged expense, YYYYMMDD
    maxDate?: string;           // Date of the latest tagged expense, YYYYMMDD
    [key: string]: any;         // Other fields returned by the API
}

export interface GetTagsResponse {
    tags: Tag[];                // All tags of the user
}

export interface GetTagExpensesResponse {
    expenses: Expense[];        // The expenses with the tag
}
