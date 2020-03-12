import { compose } from './middleware.js';
import { defaults, buildFetch } from './helper.js';
import isPlainObject from './isPlainObject.js';

function makeRequest(options = {}) {
  return function (params = {}) {
    const defaultOptions = defaults.fetchOptions || {};
    let {
      url, then, andThen,
      value = defaultOptions.value, delay = defaultOptions.delay, successText = defaultOptions.successText,
      ...otherOptions
    } = options;
    // support modify params
    if (otherOptions.params) {
      otherOptions.params = {
        ...otherOptions.params,
        ...params
      };
    } else {
      otherOptions.params = params;
    }
    let request = {};
    let promise = new Promise(function (resolve, reject) {
      compose('before')([options], () => {
        if (value && !Function.prototype.isPrototypeOf(value)) {
          request.promise = Promise.resolve(value);
        } else if (url) {
          request = buildFetch(url, otherOptions);
        } else {
          request.promise = Promise.reject('Must have url or value !');
        }
        request.promise.then((result) => {
          if (then) {
            let thenOptions = then(result);
            if (thenOptions) {
              return mapRequestByOptions(thenOptions)();
            }
          }
          let data = result;
          if (Function.prototype.isPrototypeOf(value)) {
            data = value(data);
          }
          return {
            status: 'success',
            loading: false,
            error: false,
            success: true,
            code: 200,
            message: successText || 'Success',
            value: data,
            cancel:() =>{}
          };
        }).catch((error) => {
          return {
            status: 'error',
            loading: false,
            error: true,
            success: false,
            code: error.code || 0,
            message: typeof error === 'string' ? error : (error.message || error.toString()),
            cancel:() =>{}
          };
        }).then((data) => {
          setTimeout(() => {
            compose('after')([options, data], () => {
              if (data.success) {
                resolve(data);
              } else {
                reject(data);
              }
            });
          }, delay)
        });
      });
    });
    promise.cancel = function () {
      console.error('Request has be cancel !');
      request.cancel && request.cancel();
    };
    return promise;
  };
}

function mapRequestByOptions(options, defaults = {}) {
  if (typeof options === 'string') {
    return makeRequest({
      ...defaults,
      url: options,
      method: 'GET'
    });
  } else if (isPlainObject(options)) {
    return makeRequest({
      ...defaults,
      ...options
    });
  } else if (Array.isArray(options)) {
    return () => Promise.all(options.map(item => makeRequest({
      ...defaults,
      ...item
    })()));
  } else {
    return () => Promise.reject('Not Support the Request Type');
  }
}

export {
  mapRequestByOptions
};
