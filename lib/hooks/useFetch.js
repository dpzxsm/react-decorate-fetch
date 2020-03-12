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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

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