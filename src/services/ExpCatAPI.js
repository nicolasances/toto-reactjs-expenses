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
  predictCategory(desc, email) {

    return new TotoAPI().fetch('expcat', `/predict?description=${desc}&email=${email}`).then((response) => response.json());

  }


  /**
   * Calls the smoke endpoint to check if the API is running (or activate it, if dormient)
   */
  smoke() {

    return new TotoAPI().fetch('expcat', '/').then((response) => response.json())

  }


}
