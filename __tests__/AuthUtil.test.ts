import { userFromToken } from '@/utils/AuthUtil';

/**
 * Builds an unsigned JWT with the given payload (signature is irrelevant for decoding).
 */
function fakeJwt(payload: object): string {

    const encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString('base64url');

    return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`;
}

describe('userFromToken', () => {

    it('builds the stored user from the "user" claim of the Toto token', () => {

        const token = fakeJwt({ user: 'someone@example.com' });

        const user = userFromToken(token);

        expect(user).toEqual({ name: 'someone@example.com', email: 'someone@example.com', idToken: token });
    });
});
