import TotoAPI from './TotoAPI';

/**
 * API to access the /incast/ Toto API
 */
export default class IncastAPI {

  /**
   * Forecast the current month salary
   */
  async forecastSalary() {

    return new TotoAPI().fetch('incast', `/predict`)
      .then((response) => response.json());

  }


}
