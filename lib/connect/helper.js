'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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

function omitChildren(obj) {
  var children = obj.children,
      rest = _objectWithoutProperties(obj, ['children']);

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

function buildFetch(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var topFetch = void 0;
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

  var _options$params = options.params,
      params = _options$params === undefined ? {} : _options$params,
      otherOptions = _objectWithoutProperties(options, ['params']);

  var _defaults$fetchOption = defaults.fetchOptions,
      host = _defaults$fetchOption.host,
      fetchOptions = _objectWithoutProperties(_defaults$fetchOption, ['host']);

  if (!url.match(/https?:\/\//) && host) {
    url = host + url;
  }
  otherOptions.headers = Object.assign({}, options.headers || {}, fetchOptions.headers);
  otherOptions.method = options.method || fetchOptions.method;
  if (otherOptions.method === 'GET') {
    var query = buildQuery(params);
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
  return fetch(url, otherOptions).then(function (res) {
    return defaults.buildResponse(res);
  });
}

function initConfig(_ref) {
  var _ref$options = _ref.options,
      options = _ref$options === undefined ? {} : _ref$options,
      mapResponse = _ref.mapResponse;

  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    defaults.fetchOptions = Object.assign(defaults.fetchOptions, options);
  }
  if (Function.prototype.isPrototypeOf(mapResponse)) {
    defaults.buildResponse = mapResponse;
  }
}

function bindDomClick(func) {
  return function (event) {
    // get params from event
    var dataset = event.currentTarget.dataset || {};
    var params = _extends({}, dataset);
    return func(params);
  };
}

exports.omitChildren = omitChildren;
exports.buildFetch = buildFetch;
exports.initConfig = initConfig;
exports.bindDomClick = bindDomClick;