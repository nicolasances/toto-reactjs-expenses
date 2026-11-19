export type ApiName = 'expenses' | 'expensesV2' | 'auth' | 'expcat' | 'games' | 'incast';

/**
 * Endpoints of the backend APIs used by the app.
 * The values are inlined at build time from the NEXT_PUBLIC_<X>_API_ENDPOINT environment variables.
 *
 * Note: process.env.NEXT_PUBLIC_* must be referenced literally (no dynamic keys), otherwise Next.js cannot inline them.
 */
const ApiEndpoints = new Map<ApiName, string>();
ApiEndpoints.set("expenses", String(process.env.NEXT_PUBLIC_EXPENSES_API_ENDPOINT))
ApiEndpoints.set("expensesV2", String(process.env.NEXT_PUBLIC_EXPENSES_V2_API_ENDPOINT))
ApiEndpoints.set("auth", String(process.env.NEXT_PUBLIC_AUTH_API_ENDPOINT))
ApiEndpoints.set("expcat", String(process.env.NEXT_PUBLIC_EXPCAT_API_ENDPOINT))
ApiEndpoints.set("games", String(process.env.NEXT_PUBLIC_GAMES_API_ENDPOINT))
ApiEndpoints.set("incast", String(process.env.NEXT_PUBLIC_INCAST_API_ENDPOINT))

/**
 * Returns the base endpoint (including the microservice basepath) of the specified API.
 *
 * @param {ApiName} api - the API to get the endpoint of
 *
 * @returns {string | undefined} the endpoint, e.g. https://.../expenses/v2
 */
export function endpoint(api: ApiName): string | undefined {

    return ApiEndpoints.get(api)
}

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export const APP_VERSION = "1.21.0.0"
