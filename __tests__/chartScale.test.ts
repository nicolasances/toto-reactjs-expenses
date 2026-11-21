import { computeYMax } from '@/utils/chartScale';

describe('computeYMax', () => {

    it('returns the highest bar value when there is no line data', () => {

        const bars = [{ y: 33110 }, { y: 66580 }, { y: 42306 }];

        const yMax = computeYMax(bars);

        expect(yMax).toBe(66580);
    });

    it('returns the highest bar value when the line data is null', () => {

        const bars = [{ y: 33110 }, { y: 66580 }];

        const yMax = computeYMax(bars, null);

        expect(yMax).toBe(66580);
    });

    it('returns the highest bar value when the line data is lower than every bar', () => {

        const bars = [{ y: 33110 }, { y: 66580 }];
        const line = [{ y: 20000 }, { y: 50000 }];

        const yMax = computeYMax(bars, line);

        expect(yMax).toBe(66580);
    });

    it('returns the highest line value when an income is higher than every expense', () => {

        const bars = [{ y: 33110 }, { y: 49901 }, { y: 66580 }];
        const line = [{ y: 55000 }, { y: 180000 }, { y: 60000 }];

        const yMax = computeYMax(bars, line);

        expect(yMax).toBe(180000);
    });

    it('returns the highest line value when there are no bars', () => {

        const line = [{ y: 1200 }, { y: 800 }];

        const yMax = computeYMax([], line);

        expect(yMax).toBe(1200);
    });

    it('returns 0 when there is no data at all', () => {

        const yMax = computeYMax([]);

        expect(yMax).toBe(0);
    });

});
