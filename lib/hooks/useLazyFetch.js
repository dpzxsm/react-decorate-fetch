"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useLazyFetch;

var _react = require("react");

var _useFetch3 = _interopRequireDefault(require("./useFetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

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
      return function () {
        state.cancel && state.cancel();
        clearInterval(timer);
      };
    } else {
      return function () {
        state.cancel && state.cancel();
      };
    }
  }, [callback]);
  return state;
}
//# sourceMappingURL=useLazyFetch.js.map