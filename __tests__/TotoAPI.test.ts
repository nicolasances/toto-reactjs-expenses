import { parseJsonBody } from '@/api/TotoAPI';

describe('parseJsonBody', () => {

  it('parses a JSON body', async () => {
    const response = new Response(JSON.stringify({ id: 'abc' }), { status: 200 });

    expect(await parseJsonBody(response)).toEqual({ id: 'abc' });
  });

  it('returns an empty object when the body is empty (e.g. PUT /expenses/:id on expensesV2)', async () => {
    const response = new Response('', { status: 200 });

    expect(await parseJsonBody(response)).toEqual({});
  });

  it('returns an empty object on 204 No Content', async () => {
    const response = new Response(null, { status: 204 });

    expect(await parseJsonBody(response)).toEqual({});
  });

  it('returns an empty object when the body is only whitespace', async () => {
    const response = new Response('  \n', { status: 200 });

    expect(await parseJsonBody(response)).toEqual({});
  });
});
