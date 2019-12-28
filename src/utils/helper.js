const defaults = {
  fetchOptions: {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
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
  transformPostParams: function (params) {
    return JSON.stringify(params);
  },
  fetch: getTopFetch()
};

const fetchInitKeys = ['method', 'headers', 'body', 'mode', 'credentials', 'cache', 'redirect', 'referrer', 'referrerPolicy', 'integrity'];

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
  finalOptions = filterOptions(finalOptions);
  // filter host and globalParam
  let { host, globalParams = {}, ...fetchOptions } = defaults.fetchOptions;
  if (!url.match(/https?:\/\//) && host) {
    url = host + url;
  }
  // header is special merge
  finalOptions.headers = Object.assign({}, fetchOptions.headers, finalOptions.headers || {});
  // merge options
  finalOptions = Object.assign(fetchOptions, finalOptions);

  params = Object.assign({}, globalParams, params);
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
    finalOptions.body = transformPostParams(params, finalOptions);
  }
  let topFetch = defaults.fetch || getTopFetch();
  return topFetch(url, finalOptions).then((res) => {
    return defaults.buildResponse(res);
  });
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

export {
  omitChildren,
  buildFetch,
  initConfig
};