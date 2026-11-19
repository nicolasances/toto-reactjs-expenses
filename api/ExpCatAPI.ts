import { TotoAPI } from './TotoAPI';

/**
 * Category prediction, e.g. { prediction: ["VIAGGI"] }
 */
export interface PredictCategoryResponse {
  prediction: string[];   // Predicted category codes, best first
}

/**
 * API to access the expcat (expense category prediction) microservice.
 */
export class ExpCatAPI {

  /**
   * Predicts the category of an expense from its description.
   *
   * @param {string} description - the expense description
   * @param {string} email - the user's email
   *
   * @returns {Promise<PredictCategoryResponse>} the prediction
   */
  async predictCategory(description: string, email: string): Promise<PredictCategoryResponse> {

    return new TotoAPI().fetchJson('expcat', `/predict?description=${description}&email=${email}`);
  }

  /**
   * Calls the smoke endpoint, to wake the service up (avoids a cold start later).
   */
  async smoke(): Promise<unknown> {

    return new TotoAPI().fetchJson('expcat', '/');
  }
}
