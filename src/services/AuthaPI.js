import TotoAPI from './TotoAPI';
import moment from 'moment';

var newCid = function () {

  let ts = moment().format('YYYYMMDDHHmmssSSS');

  let random = (Math.random() * 100000).toFixed(0).padStart(5, '0');

  return ts + '-' + random;

}

/**
 * API to access the /auth/ Toto API
 */
export default class AuthAPI {

  /**
   * Get generic app settings
   * from the /app/expenses microservice
   */
  getTotoToken(googleToken) {

    return new TotoAPI().fetch('auth', `/token`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'x-correlation-id': newCid(),
        'x-client': "totoMoneyWeb",
        'Authorization': `Bearer ${googleToken}`
      }
    }, true).then((response) => response.json());

  }

}
