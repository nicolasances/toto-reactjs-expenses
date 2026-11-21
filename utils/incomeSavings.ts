import { SalaryPrediction } from '@/model/stats';

/**
 * The part of an income that is needed to compute income and savings
 */
export interface IncomeLike {
    amount: number;         // Amount of the income
    category: string;       // Income category code
}

/**
 * Input to the computation of the income and savings of the month
 */
export interface IncomeSavingsInput {
    incomes: IncomeLike[];                      // The incomes received in the month so far
    totalExpenses: number;                      // The total expenses of the month
    prediction: SalaryPrediction | null;        // The salary prediction, null if it has not been requested
    predictionFailed: boolean;                  // True if the call for the salary prediction failed
}

/**
 * Result of the computation of the income and savings of the month
 */
export interface IncomeSavingsResult {
    available: boolean;             // False if the income can't be determined (salary missing and no usable prediction)
    totalIncomes?: number;          // Incomes of the month (including the predicted salary, if needed)
    totalSavings?: number;          // Expected savings: income - total expenses
}

/**
 * Tells whether the incomes contain a salary.
 *
 * @param {IncomeLike[]} incomes - the incomes of the month
 *
 * @returns {boolean} true if at least one income is a salary
 */
export function hasSalary(incomes: IncomeLike[]): boolean {

    return incomes.some((income) => income.category == 'SALARY');
}

/**
 * Computes the income and the expected savings of the month.
 *
 * Rules:
 * - If the salary has been received, income is the sum of all the incomes and the prediction is ignored
 * - If not, income is the sum of the incomes received so far plus the predicted salary
 * - If not and the prediction failed or is null, the result is not available
 * - Expected savings = income - total expenses
 *
 * @param {IncomeSavingsInput} input - incomes, expenses and (optional) salary prediction
 *
 * @returns {IncomeSavingsResult} the income and savings, or available = false
 */
export function computeIncomeAndSavings(input: IncomeSavingsInput): IncomeSavingsResult {

    const receivedIncomes = input.incomes.reduce((sum, income) => sum + income.amount, 0);

    if (hasSalary(input.incomes)) return { available: true, totalIncomes: receivedIncomes, totalSavings: receivedIncomes - input.totalExpenses };

    if (input.predictionFailed || input.prediction == null || input.prediction.predictedSalary == null) return { available: false };

    const totalIncomes = receivedIncomes + input.prediction.predictedSalary;

    return { available: true, totalIncomes, totalSavings: totalIncomes - input.totalExpenses };
}
