"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = useAsync;

var _react = require("react");

var _useAsyncFn3 = require("./useAsyncFn");

var _useAsyncFn4 = _interopRequireDefault(_useAsyncFn3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useAsync(fn, deps) {
  var _useAsyncFn = (0, _useAsyncFn4.default)(fn, deps, {
    loading: true
  }),
      _useAsyncFn2 = _slicedToArray(_useAsyncFn, 2),
      state = _useAsyncFn2[0],
      callback = _useAsyncFn2[1];

  (0, _react.useEffect)(function () {
    callback();
  }, [callback]);

  return state;
}
//# sourceMappingURL=useAsync.js.map