import Cookies from "js-cookie"

export const csrfFetch = async (url, options = {}) => {
  // Set options.method as 'GET' by default
  options.method = options.method || 'GET';
  // Set options.headers  to empty obj by default since any request without headers
  // either won't work or don't need it
  options.headers = options.headers || {};

  // if the options.method is not 'GET', then set the "Content-Type" header to
    // "application/json", and set the "XSRF-TOKEN" header to the value of the
    // "XSRF-TOKEN" cookie
  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';
    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
  }

  // call the default window's fetch with the url and the options passed in
  const res = await window.fetch(url, options);

  // if the response status code is 400 or above, then throw an error with the
    // error being the response
  if (res.status >= 400) throw res;

  // if the response status code is under 400, then return the response to the
    // next promise chain
  return res;
}

// call this to get the "XSRF-TOKEN" cookie, should only be used in development
export const restoreCSRF = () => {
  return csrfFetch('/api/csrf/restore');
}
