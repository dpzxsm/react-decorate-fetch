"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.omitChildren = omitChildren;
exports.buildFetch = buildFetch;
exports.initConfig = initConfig;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var defaults = {
  fetchOptions: {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  buildResponse: function buildResponse(res) {
    if (res && res.json) {
      return res.json().then(function (dataOrError) {
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
var fetchInitKeys = ['method', 'headers', 'body', 'mode', 'credentials', 'cache', 'redirect', 'referrer', 'referrerPolicy', 'integrity'];

function omitChildren(obj) {
  var children = obj.children,
      rest = _objectWithoutProperties(obj, ["children"]);

  return rest;
}

function buildQuery(params) {
  var esc = encodeURIComponent;
  return Object.keys(params).map(function (k) {
    if (Array.isArray(params[k])) {
      var key = k;
      var items = params[k].map(function (item) {
        return esc(key + '[]') + '=' + esc(item);
      });
      return items.join('&');
    } else {
      return esc(k) + '=' + esc(params[k]);
    }
  }).join('&');
}

function filterOptions(options) {
  return Object.keys(options).reduce(function (data, key) {
    if (fetchInitKeys.indexOf(key) !== -1) {
      data[key] = options[key];
    }

    return data;
  }, {});
}

function getTopFetch() {
  var topFetch;

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

function buildFetch(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // filter params and postFormParams
  var _options$params = options.params,
      params = _options$params === void 0 ? {} : _options$params,
      postFormParams = options.postFormParams,
      finalOptions = _objectWithoutProperties(options, ["params", "postFormParams"]);

  finalOptions = filterOptions(finalOptions); // filter host and globalParam

  var _defaults$fetchOption = defaults.fetchOptions,
      host = _defaults$fetchOption.host,
      _defaults$fetchOption2 = _defaults$fetchOption.globalParams,
      globalParams = _defaults$fetchOption2 === void 0 ? {} : _defaults$fetchOption2,
      fetchOptions = _objectWithoutProperties(_defaults$fetchOption, ["host", "globalParams"]);

  if (!url.match(/https?:\/\//) && host) {
    url = host + url;
  } // header is special merge


  finalOptions.headers = Object.assign({}, finalOptions.headers || {}, fetchOptions.headers); // merge options

  finalOptions = Object.assign(fetchOptions, finalOptions);
  params = Object.assign({}, globalParams, params);

  if (finalOptions.method === 'GET') {
    var query = buildQuery(params);

    if (query) {
      if (url.match(/https?:\/\/.*\?/)) {
        url = url + '&' + buildQuery(params);
      } else {
        url = url + '?' + buildQuery(params);
      }
    }
  } else if (finalOptions.method === 'POST' && !finalOptions.body) {
    if (finalOptions.transformFormData) if (postFormParams) {
      var formData = new FormData();
      Object.keys(params).forEach(function (key) {
        formData.append(key, params[key]);
      });
      finalOptions.body = formData;
    } else {
      // default transform json
      finalOptions.body = JSON.stringify(params);
    }
  }

  var topFetch = defaults.fetch || getTopFetch();
  return topFetch(url, finalOptions).then(function (res) {
    return defaults.buildResponse(res);
  });
}

function initConfig(_ref) {
  var _ref$fetchOptions = _ref.fetchOptions,
      fetchOptions = _ref$fetchOptions === void 0 ? {} : _ref$fetchOptions,
      buildResponse = _ref.buildResponse,
      fetch = _ref.fetch;

  if (_typeof(fetchOptions) === 'object') {
    defaults.fetchOptions = Object.assign(defaults.fetchOptions, fetchOptions);
  }

  if (Function.prototype.isPrototypeOf(buildResponse)) {
    defaults.buildResponse = buildResponse;
  }

  if (fetch) {
    console.log('global fetch api is change');
    defaults.fetch = fetch;
  }
}
//# sourceMappingURL=helper.js.map