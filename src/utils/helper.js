const defaults = {
  fetchOptions: {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    delay: 0,
    successText: 'Success',
    cleanParams: true
  },
  buildResponse: function (res) {
    if (res && res.json) {
      return res.json().then((dataOrError) => {
        if (res.ok) {
          return dataOrError;
        } else {
          throw dataOrError;
        }
      });
    } else {
      return {};
    }
  },
  fetch: getTopFetch()
};

const fetchInitKeys = ['method', 'headers', 'body', 'mode', 'credentials', 'cache', 'redirect', 'referrer', 'referrerPolicy', 'integrity', 'signal'];

function omitChildren(obj) {
  const { children, ...rest } = obj;
  return rest;
}

function buildQuery(params) {
  let esc = encodeURIComponent;
  return Object.keys(params)
    .map(k => {
      if (Array.isArray(params[k])) {
        let key = k;
        let items = params[k].map(item => {
          return esc(key + '[]') + '=' + esc(item);
        });
        return items.join('&');
      } else {
        return esc(k) + '=' + esc(params[k]);
      }
    })
    .join('&');
}

function filterOptions(options) {
  return Object.keys(options).reduce((data, key) => {
    if (fetchInitKeys.indexOf(key) !== -1) {
      data[key] = options[key];
    }
    return data;
  }, {});
}

function getTopFetch() {
  let topFetch;
  if (typeof window !== 'undefined') {
    if (window.fetch) {
      topFetch = window.fetch.bind(window);
    }
  } else if (typeof global !== 'undefined') {
    if (global.fetch) {
      topFetch = global.fetch.bind(global);
    }
  } else if (typeof self !== 'undefined') {
    if (self.fetch) {
      topFetch = self.fetch.bind(self);
    }
  }
  return topFetch;
}

function buildFetch(url, options = {}) {
  let { params = {}, ...finalOptions } = options;
  // merge params
  params = Object.assign({}, defaults.fetchOptions.params, params);
  // merge options
  finalOptions = Object.assign({}, defaults.fetchOptions, finalOptions);

  let host = finalOptions.host;
  if (!url.match(/https?:\/\//) && host) {
    url = host + url;
  }

  // clean params, like null, undefined
  if (finalOptions.cleanParams) {
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === null) {
        delete params[key];
      }
    })
  }

  // set signal
  let controller;
  if (window.AbortController && !finalOptions.signal) {
    controller = new window.AbortController();
    finalOptions.signal = controller.signal;
  }

  if (finalOptions.method === 'GET') {
    let query = buildQuery(params);
    if (query) {
      if (url.match(/https?:\/\/.*\?/)) {
        url = url + '&' + buildQuery(params);
      } else {
        url = url + '?' + buildQuery(params);
      }
    }
  } else if (finalOptions.method === 'POST' && !finalOptions.body) {
    let transformPostParams = defaults.transformPostParams;
    if (transformPostParams) {
      finalOptions.body = transformPostParams(params, finalOptions);
    } else {
      if (finalOptions.postForm) {
        let formData = new FormData();
        Object.keys(params).forEach(key => {
          formData.append(key, params[key]);
        });
        finalOptions.body = formData;
      } else {
        finalOptions.body = JSON.stringify(params);
      }
    }
  }
  // 筛选最终的fetch参数
  finalOptions = filterOptions(finalOptions);
  let topFetch = defaults.fetch || getTopFetch();
  return {
    promise: topFetch(url, finalOptions).then((res) => {
      return defaults.buildResponse(res);
    }),
    cancel: () => controller && controller.abort()
  }
}

function initConfig({ fetchOptions = {}, buildResponse, transformPostParams, fetch }) {
  if (typeof fetchOptions === 'object') {
    defaults.fetchOptions = Object.assign(defaults.fetchOptions, fetchOptions);
  }
  if (Function.prototype.isPrototypeOf(buildResponse)) {
    defaults.buildResponse = buildResponse;
  }
  if (Function.prototype.isPrototypeOf(transformPostParams)) {
    defaults.transformPostParams = transformPostParams;
  }
  if (fetch) {
    console.log('global fetch api is change');
    defaults.fetch = fetch;
  }
}

class FetchError {
  constructor(error) {
    if (typeof error === 'string') {
      this.message = error;
      this.code = 0;
    } else {
      this.message = error.message;
      this.code = error.code || 0;
    }
  }

  toString() {
    return this.message;
  }
}

export {
  defaults,
  FetchError,
  omitChildren,
  buildFetch,
  initConfig
};
