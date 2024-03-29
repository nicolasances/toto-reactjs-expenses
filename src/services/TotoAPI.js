import React from 'react';
import * as config from '../Config';
import moment from 'moment';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

var newCid = function () {

  let ts = moment().format('YYYYMMDDHHmmssSSS');

  let random = (Math.random() * 100000).toFixed(0).padStart(5, '0');

  return ts + '-' + random;

}
/**
 * Wrapper for the fetch() React method that adds the required fields for Toto authentication
 * @param noHeaderOverride set to true to avoid that this method overrides some of the headers
 */
export default class TotoAPI {

  fetch(api, url, options, noHeaderOverride) {

    if (options == null) options = { method: 'GET', headers: {} };
    if (options.headers == null) options.headers = {};

    let idToken = cookies.get('user') ? cookies.get('user').idToken : null

    // Adding standard headers
    if (!noHeaderOverride) {
      options.headers['Accept'] = 'application/json';
      options.headers['x-correlation-id'] = newCid();
      options.headers['x-client'] = "totoMoneyWeb";
      options.headers['Authorization'] = 'Bearer ' + idToken;
      options.headers['auth-provider'] = "toto";
    }

    return fetch(config.APIS[api] + url, options);
  }
}
