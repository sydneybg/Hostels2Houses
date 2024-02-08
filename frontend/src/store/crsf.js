// frontend/src/store/csrf.js

import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
  // set options.method to 'GET' if not specified
  options.method = options.method || 'GET';

  // set headers to an empty object if not specified
  options.headers = options.headers || {};

  if (options.method.toUpperCase() !== 'GET') {
    // set header and cookie for non-GET requests
    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';
    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
  }

  // call the default window's fetch with url and options
  const res = await window.fetch(url, options);

  // if the response status code is 400 or above, then throw an error with the
  // error being the response
  if (res.status >= 400) throw res;

  return res;
}
