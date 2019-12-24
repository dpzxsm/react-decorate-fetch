import { compose } from "./middleware.js";
import { buildFetch } from "./helper.js";
import isPlainObject from "./isPlainObject.js";

function makeRequest(options = {}) {
  return function () {
    let { url, value, then, andThen, successText, ...otherOptions } = options;
    return new Promise((resolve) => {
      compose('before')([options], () => {
        let request;
        if (value && !Function.prototype.isPrototypeOf(value)) {
          request = Promise.resolve(value);
        } else if (url) {
          request = buildFetch(url, otherOptions);
        } else {
          request = Promise.reject('Must have url or value !');
        }
        request.then((result) => {
          if (then) {
            return mapRequestByOptions(then(result))();
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
            message: successText || '请求成功',
            value: data
          };
        }).catch((error) => {
          return {
            status: 'error',
            loading: false,
            error: true,
            success: false,
            code: error.code || 0,
            message: error.message,
            value: null
          };
        }).then((data) => {
          compose('after')([options, data], () => {
            resolve(data);
          });
        });
      });
    });
  };
}

function mapRequestByOptions(options) {
  if (typeof options === "string") {
    return makeRequest({
      url: options,
      method: 'GET'
    });
  } else if (isPlainObject(options)) {
    return makeRequest({ ...options });
  } else if (Array.isArray(options)) {
    return () => Promise.all(options.map(item => makeRequest(item)()));
  } else {
    return () => Promise.reject("Not Support the Request Type");
  }
}

export {
  mapRequestByOptions
};
