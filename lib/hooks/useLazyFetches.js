"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useLazyFetches;

var _react = require("react");

var _useFetch3 = _interopRequireDefault(require("./useFetch"));

var _useForceUpdate = _interopRequireDefault(require("./useForceUpdate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function useLazyFetches(options, deps) {
  var state = (0, _react.useRef)([]);
  var forceUpdate = (0, _useForceUpdate["default"])();
  var fetches = options.map(function (item, index) {
    var _useFetch = (0, _useFetch3["default"])(item, deps, false),
        _useFetch2 = _slicedToArray(_useFetch, 2),
        state = _useFetch2[0],
        callback = _useFetch2[1];

    return {
      state: state,
      callback: callback
    };
  });
  state.current = _toConsumableArray(fetches.map(function (item) {
    return item.state;
  }));
  (0, _react.useEffect)(function () {
    forceUpdate();
    Promise.all(fetches.map(function (item) {
      return item.callback();
    })).then(function () {
      forceUpdate();
    });
  }, []);
  return state.current;
}
//# sourceMappingURL=useLazyFetches.js.map