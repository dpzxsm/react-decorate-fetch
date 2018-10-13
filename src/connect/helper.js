const defaultFetchOptions = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

function omitChildren(obj) {
  const {children, ...rest} = obj;
  return rest;
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
  options.headers = Object.assign({}, options.headers || {}, defaultFetchOptions.headers);
  options.method = options.method || defaultFetchOptions.method;
  return topFetch(url, options);
}

function initFetchOptions(options = {}) {
  Object.assign(defaultFetchOptions, options)
}

export {
  omitChildren,
  buildFetch,
  initFetchOptions
};