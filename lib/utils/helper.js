"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.omitChildren = omitChildren;
exports.buildFetch = buildFetch;
exports.initConfig = initConfig;
exports.FetchError = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
  transformPostParams: function transformPostParams(params) {
    return JSON.stringify(params);
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

  var _options$params = options.params,
      params = _options$params === void 0 ? {} : _options$params,
      finalOptions = _objectWithoutProperties(options, ["params"]);

  finalOptions = filterOptions(finalOptions); // filter host and globalParam

  var _defaults$fetchOption = defaults.fetchOptions,
      host = _defaults$fetchOption.host,
      _defaults$fetchOption2 = _defaults$fetchOption.globalParams,
      globalParams = _defaults$fetchOption2 === void 0 ? {} : _defaults$fetchOption2,
      fetchOptions = _objectWithoutProperties(_defaults$fetchOption, ["host", "globalParams"]);

  if (!url.match(/https?:\/\//) && host) {
    url = host + url;
  } // header is special merge


  finalOptions.headers = Object.assign({}, fetchOptions.headers, finalOptions.headers || {}); // merge options

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
    var transformPostParams = defaults.transformPostParams;
    finalOptions.body = transformPostParams(params, finalOptions);
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
      transformPostParams = _ref.transformPostParams,
      fetch = _ref.fetch;

  if (_typeof(fetchOptions) === 'object') {
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

var FetchError =
/*#__PURE__*/
function () {
  function FetchError(error) {
    _classCallCheck(this, FetchError);

    if (typeof error === 'string') {
      this.message = error;
      this.code = 0;
    } else {
      this.message = error.message;
      this.code = error.code || 0;
    }
  }

  _createClass(FetchError, [{
    key: "toString",
    value: function toString() {
      return this.message;
    }
  }]);

  return FetchError;
}();

exports.FetchError = FetchError;
//# sourceMappingURL=helper.js.map