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
  }
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

function buildFetch(url, options = {}) {
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
  let { params = {}, ...otherOptions } = options;
  otherOptions = filterOptions(otherOptions);
  let { host, ...fetchOptions } = defaults.fetchOptions;
  if (!url.match(/https?:\/\//) && host) {
    url = host + url;
  }
  otherOptions.headers = Object.assign({}, options.headers || {}, fetchOptions.headers);
  otherOptions.method = options.method || fetchOptions.method;
  if (otherOptions.method === 'GET') {
    let query = buildQuery(params);
    if (query) {
      if (url.match(/https?:\/\/.*\?/)) {
        url = url + '&' + buildQuery(params);
      } else {
        url = url + '?' + buildQuery(params);
      }
    }
  } else if (otherOptions.method === 'POST') {
    otherOptions.body = JSON.stringify(params);
  }
  return fetch(url, otherOptions).then((res) => {
    return defaults.buildResponse(res);
  });
}

function initConfig({ options = {}, mapResponse }) {
  if (typeof options === 'object') {
    defaults.fetchOptions = Object.assign(defaults.fetchOptions, options);
  }
  if (Function.prototype.isPrototypeOf(mapResponse)) {
    defaults.buildResponse = mapResponse;
  }
}

function bindDomClick(func, disabled) {
  return function (event) {
    if (disabled) {
      return;
    }
    // get params from event
    let params = {};
    if (event && event.currentTarget) {
      let dataset = event.currentTarget.dataset || {};
      params = {
        ...dataset
      };
    }
    return func(params);
  };
}

export {
  omitChildren,
  buildFetch,
  initConfig,
  bindDomClick
};