"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useFetch;

var _react = require("react");

var _mapRequest = require("../utils/mapRequest");

var _useRequest3 = _interopRequireDefault(require("./useRequest"));

var _useForceUpdate = _interopRequireDefault(require("./useForceUpdate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var LazyInitialState = {
  status: 'loading',
  loading: true,
  cancel: function cancel() {}
};
var DefaultInitialState = {
  status: 'pending',
  loading: false,
  cancel: function cancel() {}
};

function useFetch(options) {
  var deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var lazy = arguments.length > 2 ? arguments[2] : undefined;
  var request = (0, _mapRequest.mapRequestByOptions)(options);
  var forceUpdate = (0, _useForceUpdate["default"])();

  var _useRequest = (0, _useRequest3["default"])(request, deps, lazy ? LazyInitialState : DefaultInitialState),
      _useRequest2 = _slicedToArray(_useRequest, 2),
      state = _useRequest2[0],
      callback = _useRequest2[1];

  var newCallback = (0, _react.useCallback)(function () {
    var promise = callback.apply(void 0, arguments);
    forceUpdate();
    return promise.then(function (data) {
      forceUpdate();
      return data;
    })["catch"](function (error) {
      forceUpdate();
      throw error;
    });
  }, [callback]);
  return [state, newCallback];
}
//# sourceMappingURL=useFetch.js.map