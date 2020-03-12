"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useLazyFetch;

var _react = require("react");

var _useFetch3 = _interopRequireDefault(require("./useFetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function useLazyFetch(options, deps) {
  var _useFetch = (0, _useFetch3["default"])(options, deps, true),
      _useFetch2 = _slicedToArray(_useFetch, 2),
      state = _useFetch2[0],
      callback = _useFetch2[1];

  var refreshInterval = options.refreshInterval || 0;
  (0, _react.useEffect)(function () {
    callback().then(function (err) {//do nothing
    });

    if (refreshInterval) {
      var timer = setInterval(callback, refreshInterval);
      state.cancel && state.cancel();
      return function () {
        return clearInterval(timer);
      };
    }
  }, [callback]);
  return state;
}
//# sourceMappingURL=useLazyFetch.js.map