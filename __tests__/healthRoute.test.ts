import { GET } from '@/app/api/health/route';

describe('GET /api/health', () => {

    it('responds with HTTP 200', async () => {

        const response = await GET();

        expect(response.status).toBe(200);
    });

    it('responds with the JSON body { status: "ok" }', async () => {

        const response = await GET();

        expect(await response.json()).toEqual({ status: 'ok' });
    });
});
