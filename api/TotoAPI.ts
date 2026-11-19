import moment from 'moment';
import Cookies from 'universal-cookie';
import { ApiName, endpoint } from '@/Config';

const cookies = new Cookies();

/**
 * Error thrown when an API call returns a non-2xx status.
 */
export class ApiError extends Error {

  constructor(public status: number) {
    super('API error ' + status);
  }
}

/**
 * Generates a correlation id: a timestamp followed by a random 5-digit number.
 *
 * @returns {string} the correlation id, e.g. 20250601120000123-04211
 */
export function cid(): string {

  const ts = moment().format('YYYYMMDDHHmmssSSS');
  const random = (Math.random() * 100000).toFixed(0).padStart(5, '0');

  return ts + '-' + random;
}

/**
 * Options passed to fetch(). Headers are always a plain object so the standard Toto headers can be added.
 */
export interface TotoFetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

/**
 * Wrapper for fetch() that adds the headers required by the Toto backends.
 */
export class TotoAPI {

  /**
   * Calls the specified API.
   *
   * Standard headers added (unless noHeaderOverride is true):
   * - Accept, x-correlation-id, Authorization (Toto token from the "user" cookie)
   * - x-client: totoMoneyWeb and auth-provider: toto, which the expenses backends expect
   *
   * @param {ApiName} api - the API to call
   * @param {string} path - the path, without the microservice basepath (that is in the endpoint)
   * @param {TotoFetchOptions} options - fetch options (default: GET)
   * @param {boolean} noHeaderOverride - true to send the headers in options as they are
   *
   * @returns {Promise<Response>} the fetch response
   */
  fetch(api: ApiName, path: string, options?: TotoFetchOptions, noHeaderOverride: boolean = false): Promise<Response> {

    const requestOptions: TotoFetchOptions = options ?? { method: 'GET' };
    const headers: Record<string, string> = requestOptions.headers ?? {};

    const user = cookies.get('user');
    const idToken = user ? user.idToken : null;

    if (!noHeaderOverride) {
      headers['Accept'] = 'application/json';
      headers['x-correlation-id'] = cid();
      headers['x-client'] = "totoMoneyWeb";
      headers['Authorization'] = 'Bearer ' + idToken;
      headers['auth-provider'] = "toto";
    }

    return fetch(endpoint(api) + path, { ...requestOptions, headers });
  }

  /**
   * Calls the specified API and parses the JSON body.
   *
   * Note: like the original app, the body is parsed whatever the status. Use fetchJsonOrThrow to fail on non-2xx.
   *
   * @param {ApiName} api - the API to call
   * @param {string} path - the path, without the microservice basepath
   * @param {TotoFetchOptions} options - fetch options (default: GET)
   * @param {boolean} noHeaderOverride - true to send the headers in options as they are
   *
   * @returns {Promise<T>} the parsed body
   */
  async fetchJson<T>(api: ApiName, path: string, options?: TotoFetchOptions, noHeaderOverride: boolean = false): Promise<T> {

    const response = await this.fetch(api, path, options, noHeaderOverride);

    return parseJsonBody<T>(response);
  }

  /**
   * Same as fetchJson, but throws an ApiError when the response is not 2xx.
   *
   * @returns {Promise<T>} the parsed body
   */
  async fetchJsonOrThrow<T>(api: ApiName, path: string, options?: TotoFetchOptions, noHeaderOverride: boolean = false): Promise<T> {

    const response = await this.fetch(api, path, options, noHeaderOverride);

    if (!response.ok) throw new ApiError(response.status);

    return parseJsonBody<T>(response);
  }
}

/**
 * Parses the JSON body of a response, tolerating responses without a payload.
 *
 * Some endpoints (e.g. PUT /expenses/:id on expensesV2) return no body: in that case an empty object is returned
 * instead of failing with a JSON parse error.
 *
 * @param {Response} response - the fetch response
 *
 * @returns {Promise<T>} the parsed body, or {} when the body is empty
 */
export async function parseJsonBody<T>(response: Response): Promise<T> {

  const text = await response.text();

  if (text.trim() === '') return {} as T;

  return JSON.parse(text) as T;
}

/**
 * Builds the options for a request with a JSON body.
 *
 * @param {string} method - the HTTP method (POST, PUT, DELETE)
 * @param {unknown} body - the body to serialize (optional)
 *
 * @returns {TotoFetchOptions} the fetch options
 */
export function jsonRequest(method: string, body?: unknown): TotoFetchOptions {

  return { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) };
}
