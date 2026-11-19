import { resolveSelectedYearMonth, isIncomeParam } from '@/utils/navigation';

describe('resolveSelectedYearMonth', () => {

    it('uses the yearMonth stored in the cookie over everything else', () => {

        const yearMonth = resolveSelectedYearMonth({ cookieYearMonth: '202401', queryYearMonth: '202312', today: new Date(2025, 5, 10) });

        expect(yearMonth).toBe('202401');
    });

    it('uses the yearMonth query param when there is no cookie', () => {

        const yearMonth = resolveSelectedYearMonth({ cookieYearMonth: undefined, queryYearMonth: '202312', today: new Date(2025, 5, 10) });

        expect(yearMonth).toBe('202312');
    });

    it('falls back to the current month when neither cookie nor query param are set', () => {

        const yearMonth = resolveSelectedYearMonth({ cookieYearMonth: undefined, queryYearMonth: null, today: new Date(2025, 5, 10) });

        expect(yearMonth).toBe('202506');
    });

    it('ignores a malformed yearMonth query param', () => {

        const yearMonth = resolveSelectedYearMonth({ cookieYearMonth: undefined, queryYearMonth: '2023-12', today: new Date(2025, 0, 3) });

        expect(yearMonth).toBe('202501');
    });
});

describe('isIncomeParam', () => {

    it('is true only when the income query param is "true"', () => {

        expect(isIncomeParam('true')).toBe(true);
    });

    it('is false when the income query param is missing', () => {

        expect(isIncomeParam(null)).toBe(false);
    });

    it('is false for any other value', () => {

        expect(isIncomeParam('false')).toBe(false);
    });
});
