import { TotoAPI } from './TotoAPI';
import { SalaryForecast } from '@/model/stats';

/**
 * API to access the incast (income forecast) microservice.
 */
export class IncastAPI {

  /**
   * Forecasts the salary of the current month.
   *
   * @returns {Promise<SalaryForecast>} the forecast
   */
  async forecastSalary(): Promise<SalaryForecast> {

    return new TotoAPI().fetchJson('incast', `/predict`);
  }
}
