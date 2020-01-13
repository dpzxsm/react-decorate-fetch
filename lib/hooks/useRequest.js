"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useRequest;

var _react = require("react");

var _useMountedState = _interopRequireDefault(require("./useMountedState"));

var _helper = require("../utils/helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function useRequest(fn) {
  var deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var initialState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    status: 'pending',
    loading: false
  };
  var lastCallId = (0, _react.useRef)(0);
  var state = (0, _react.useRef)(initialState);
  var isMounted = (0, _useMountedState["default"])();
  var callback = (0, _react.useCallback)(function () {
    var callId = ++lastCallId.current;
    state.current = {
      status: 'loading',
      loading: true
    };
    return fn.apply(void 0, arguments).then(function (value) {
      if (isMounted() && callId === lastCallId.current) {
        state.current = value;
      }

      return value.value;
    }, function (error) {
      if (isMounted() && callId === lastCallId.current) {
        state.current = error;
      }

      throw new _helper.FetchError(error);
    });
  }, deps);
  return [state.current, callback];
}
//# sourceMappingURL=useRequest.js.map