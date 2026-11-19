import { TotoAPI, cid } from './TotoAPI';

/**
 * Response of the /token endpoint.
 */
export interface GetTotoTokenResponse {
  token: string;      // The Toto JWT
}

/**
 * Response of the /verify endpoint. On failure it carries the JWT error name (e.g. TokenExpiredError).
 */
export interface VerifyTokenResponse {
  name?: string;      // Name of the verification error, if any (e.g. "TokenExpiredError")
  [key: string]: any; // Other fields returned by the auth API
}

/**
 * API to access the Toto auth microservice.
 */
export class AuthAPI {

  /**
   * Exchanges a Google id token for a Toto token.
   *
   * @param {string} googleToken - the Google credential from Google Sign-In
   *
   * @returns {Promise<GetTotoTokenResponse>} the Toto token
   */
  async getTotoToken(googleToken: string): Promise<GetTotoTokenResponse> {

    return new TotoAPI().fetchJson('auth', `/token`, { method: "GET", headers: this.headers(googleToken) }, true);
  }

  /**
   * Verifies a Toto token.
   *
   * @param {string} totoToken - the Toto token to verify
   *
   * @returns {Promise<VerifyTokenResponse>} the verification result
   */
  async verifyToken(totoToken: string): Promise<VerifyTokenResponse> {

    return new TotoAPI().fetchJson('auth', `/verify`, { method: "POST", headers: this.headers(totoToken) }, true);
  }

  /**
   * Builds the headers for the auth API (which does not use the standard Toto auth-provider header).
   */
  private headers(bearerToken: string): Record<string, string> {

    return { 'Accept': 'application/json', 'x-correlation-id': cid(), 'x-client': "totoMoneyWeb", 'Authorization': `Bearer ${bearerToken}` };
  }
}
