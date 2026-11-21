import { computeIncomeAndSavings, hasSalary } from '@/utils/incomeSavings';

const salary = { amount: 3000, category: 'SALARY' };
const bonus = { amount: 500, category: 'BONUS' };

describe('hasSalary', () => {

    it('is true when one of the incomes is a salary', () => {
        expect(hasSalary([bonus, salary])).toBe(true);
    });

    it('is false when there are no salary incomes', () => {
        expect(hasSalary([bonus])).toBe(false);
    });
});

describe('computeIncomeAndSavings', () => {

    it('sums all the incomes when the salary is present, ignoring the prediction', () => {
        const result = computeIncomeAndSavings({ incomes: [salary, bonus], totalExpenses: 1000, prediction: { predictedSalary: 9999, currency: 'EUR', basedOnMonths: [] }, predictionFailed: false });

        expect(result).toEqual({ available: true, totalIncomes: 3500, totalSavings: 2500 });
    });

    it('adds the predicted salary to the incomes received so far when the salary is missing', () => {
        const result = computeIncomeAndSavings({ incomes: [bonus], totalExpenses: 1000, prediction: { predictedSalary: 4200.5, currency: 'EUR', basedOnMonths: [202608, 202609, 202610] }, predictionFailed: false });

        expect(result).toEqual({ available: true, totalIncomes: 4700.5, totalSavings: 3700.5 });
    });

    it('is not available when the salary is missing and the predicted salary is null', () => {
        const result = computeIncomeAndSavings({ incomes: [bonus], totalExpenses: 1000, prediction: { predictedSalary: null, currency: 'EUR', basedOnMonths: [] }, predictionFailed: false });

        expect(result).toEqual({ available: false });
    });

    it('is not available when the salary is missing and the prediction call failed', () => {
        const result = computeIncomeAndSavings({ incomes: [], totalExpenses: 1000, prediction: null, predictionFailed: true });

        expect(result).toEqual({ available: false });
    });
});
