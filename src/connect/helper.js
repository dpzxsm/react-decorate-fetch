const defaults = {
  fetchOptions: {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  buildResponse: function (res) {
    if (res && res.json) {
      return res.json();
    } else {
      return {};
    }
  }
};

function omitChildren(obj) {
  const {children, ...rest} = obj;
  return rest;
}

function buildQuery(params) {
  let esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => {
      if (Array.isArray(params[k])) {
        let key = k;
        let items = params[k].map(item => {
          let result = esc(key + '[]') + '=' + esc(item);
          return result;
        });
        return items.join('&');
      } else {
        return esc(k) + '=' + esc(params[k]);
      }
    })
    .join('&');
  return query;
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
  let {params = {}, ...otherOptions} = options;
  let fetchOptions = defaults.fetchOptions;
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
  }
  return fetch(url, otherOptions).then((res) => {
    return defaults.buildResponse(res);
  });
}

function initConfig({options = {}, mapResponse}) {
  if (typeof options === 'object') {
    defaults.fetchOptions = Object.assign(defaults.fetchOptions, options);
  }
  if (Function.prototype.isPrototypeOf(mapResponse)) {
    defaults.buildResponse = mapResponse;
  }
}

export {
  omitChildren,
  buildFetch,
  initConfig,
};