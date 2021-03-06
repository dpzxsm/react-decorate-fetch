"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapRequestByOptions = mapRequestByOptions;

var _middleware = require("./middleware.js");

var _helper = require("./helper.js");

var _isPlainObject = _interopRequireDefault(require("./isPlainObject.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function makeRequest() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function () {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaultOptions = _helper.defaults.fetchOptions || {};

    var url = options.url,
        then = options.then,
        andThen = options.andThen,
        _options$value = options.value,
        value = _options$value === void 0 ? defaultOptions.value : _options$value,
        _options$delay = options.delay,
        delay = _options$delay === void 0 ? defaultOptions.delay : _options$delay,
        _options$successText = options.successText,
        successText = _options$successText === void 0 ? defaultOptions.successText : _options$successText,
        otherOptions = _objectWithoutProperties(options, ["url", "then", "andThen", "value", "delay", "successText"]); // support modify params


    if (otherOptions.params) {
      otherOptions.params = _objectSpread({}, otherOptions.params, {}, params);
    } else {
      otherOptions.params = params;
    }

    var request = {};
    var promise = new Promise(function (resolve, reject) {
      (0, _middleware.compose)('before')([options], function () {
        if (value && !Function.prototype.isPrototypeOf(value)) {
          request.promise = Promise.resolve(value);
        } else if (url) {
          request = (0, _helper.buildFetch)(url, otherOptions);
        } else {
          request.promise = Promise.reject('Must have url or value !');
        }

        request.promise.then(function (result) {
          var data = result;

          if (Function.prototype.isPrototypeOf(value)) {
            data = value(data);
          }

          if (then) {
            var thenOptions = then(data);

            if (thenOptions) {
              return mapRequestByOptions(thenOptions)();
            }
          }

          return {
            status: 'success',
            loading: false,
            error: false,
            success: true,
            code: 200,
            message: successText || 'Success',
            value: data,
            cancel: function cancel() {}
          };
        })["catch"](function (error) {
          return {
            status: 'error',
            loading: false,
            error: true,
            success: false,
            code: error.code || 0,
            message: typeof error === 'string' ? error : error.message || error.toString(),
            cancel: function cancel() {}
          };
        }).then(function (data) {
          setTimeout(function () {
            (0, _middleware.compose)('after')([options, data], function () {
              if (data.success) {
                resolve(data);
              } else {
                reject(data);
              }
            });
          }, delay);
        });
      });
    });

    promise.cancel = function () {
      console.error('Request has be cancel !');
      request.cancel && request.cancel();
    };

    return promise;
  };
}

function mapRequestByOptions(options) {
  var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof options === 'string') {
    return makeRequest(_objectSpread({}, defaults, {
      url: options,
      method: 'GET'
    }));
  } else if ((0, _isPlainObject["default"])(options)) {
    return makeRequest(_objectSpread({}, defaults, {}, options));
  } else if (Array.isArray(options)) {
    return function () {
      return Promise.all(options.map(function (item) {
        return makeRequest(_objectSpread({}, defaults, {}, item))();
      }));
    };
  } else {
    return function () {
      return Promise.reject('Not Support the Request Type');
    };
  }
}
//# sourceMappingURL=mapRequest.js.map