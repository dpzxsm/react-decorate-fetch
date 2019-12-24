"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.omitChildren = omitChildren;
exports.buildFetch = buildFetch;
exports.initConfig = initConfig;
exports.bindDomClick = bindDomClick;

var _middleware = require("./middleware.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  }
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
  var topFetch = getTopFetch();

  var _options$params = options.params,
      params = _options$params === void 0 ? {} : _options$params,
      isForm = options.isForm,
      otherOptions = _objectWithoutProperties(options, ["params", "isForm"]);

  otherOptions = filterOptions(otherOptions);

  var _defaults$fetchOption = defaults.fetchOptions,
      host = _defaults$fetchOption.host,
      fetchOptions = _objectWithoutProperties(_defaults$fetchOption, ["host"]);

  if (!url.match(/https?:\/\//) && host) {
    url = host + url;
  }

  otherOptions.headers = Object.assign({}, options.headers || {}, fetchOptions.headers);
  otherOptions.method = options.method || fetchOptions.method;
  var globalParams = fetchOptions.globalParams ? fetchOptions.globalParams : {};
  params = Object.assign({}, params, globalParams);

  if (otherOptions.method === 'GET') {
    var query = buildQuery(params);

    if (query) {
      if (url.match(/https?:\/\/.*\?/)) {
        url = url + '&' + buildQuery(params);
      } else {
        url = url + '?' + buildQuery(params);
      }
    }
  } else if (otherOptions.method === 'POST' && !otherOptions.body) {
    if (otherOptions.transformFormData) if (isForm) {
      var formData = new FormData();
      Object.keys(params).forEach(function (key) {
        formData.append(key, params[key]);
      });
      otherOptions.body = formData;
    } else {
      // default transform json
      otherOptions.body = JSON.stringify(params);
    }
  }

  return topFetch(url, otherOptions).then(function (res) {
    return defaults.buildResponse(res);
  });
}

function initConfig(_ref) {
  var _ref$options = _ref.options,
      options = _ref$options === void 0 ? {} : _ref$options,
      mapResponse = _ref.mapResponse;

  if (_typeof(options) === 'object') {
    defaults.fetchOptions = Object.assign(defaults.fetchOptions, options);
  }

  if (Function.prototype.isPrototypeOf(mapResponse)) {
    defaults.buildResponse = mapResponse;
  }
}

function bindDomClick(func, verification) {
  return function (event) {
    // get params from event
    var params = {};

    if (event && event.currentTarget) {
      var dataset = event.currentTarget.dataset || {};
      params = _objectSpread({}, dataset);
    }

    if (verification) {
      if (typeof verification === 'function') {
        if (!verification(params)) return;
      } else {
        return;
      }
    }

    return func(params);
  };
}
//# sourceMappingURL=helper.js.map