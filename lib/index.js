"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "connect", {
  enumerable: true,
  get: function get() {
    return _connect["default"];
  }
});
Object.defineProperty(exports, "initConfig", {
  enumerable: true,
  get: function get() {
    return _helper.initConfig;
  }
});
Object.defineProperty(exports, "buildFetch", {
  enumerable: true,
  get: function get() {
    return _helper.buildFetch;
  }
});
Object.defineProperty(exports, "applyMiddleware", {
  enumerable: true,
  get: function get() {
    return _middleware.applyMiddleware;
  }
});
Object.defineProperty(exports, "removeMiddleware", {
  enumerable: true,
  get: function get() {
    return _middleware.removeMiddleware;
  }
});
Object.defineProperty(exports, "useFetch", {
  enumerable: true,
  get: function get() {
    return _useFetch["default"];
  }
});
Object.defineProperty(exports, "useLazyFetch", {
  enumerable: true,
  get: function get() {
    return _useLazyFetch["default"];
  }
});
Object.defineProperty(exports, "useLazyFetches", {
  enumerable: true,
  get: function get() {
    return _useLazyFetches["default"];
  }
});

var _connect = _interopRequireDefault(require("./connect"));

var _helper = require("./utils/helper");

var _middleware = require("./utils/middleware");

var _useFetch = _interopRequireDefault(require("./hooks/useFetch"));

var _useLazyFetch = _interopRequireDefault(require("./hooks/useLazyFetch"));

var _useLazyFetches = _interopRequireDefault(require("./hooks/useLazyFetches"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//# sourceMappingURL=index.js.map