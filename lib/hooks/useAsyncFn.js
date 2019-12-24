'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = useAsyncFn;

var _react = require('react');

var _useMountedState = require('./useMountedState');

var _useMountedState2 = _interopRequireDefault(_useMountedState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useAsyncFn(fn) {
  var deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var initialState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { loading: false };

  var lastCallId = (0, _react.useRef)(0);

  var _useState = (0, _react.useState)(initialState),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      set = _useState2[1];

  var isMounted = (0, _useMountedState2.default)();

  var callback = (0, _react.useCallback)(function () {
    var callId = ++lastCallId.current;
    set({ loading: true });
    return fn().then(function (value) {
      isMounted() && callId === lastCallId.current && set({
        value: value,
        loading: false
      });

      return value;
    }, function (error) {
      isMounted() && callId === lastCallId.current && set({
        error: error,
        loading: false
      });

      return error;
    });
  }, deps);

  return [state, callback];
}
//# sourceMappingURL=useAsyncFn.js.map