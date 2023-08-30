import TotoAPI from './TotoAPI';

/**
 * API to access the /expcat/ Toto API
 */
export default class ExpCatAPI {

  /**
   * Predict expense category given a description
   * 
   * The output is an object {prediction: ["<category code>"]}
   * 
   * An example is {prediction: ["VIAGGI"]}
   */
  predictCategory(desc) {

    return new TotoAPI().fetch('expcat', `/predict?description=${desc}`)
        .then((response) => response.json());

  }



}
