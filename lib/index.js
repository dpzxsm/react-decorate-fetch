'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeMiddleware = exports.applyMiddleware = exports.initConfig = exports.bindDomClick = exports.buildFetch = exports.connect = undefined;

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var _helper = require('./connect/helper');

var _middleware = require('./connect/middleware.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.connect = _connect2.default;
exports.buildFetch = _helper.buildFetch;
exports.bindDomClick = _helper.bindDomClick;
exports.initConfig = _helper.initConfig;
exports.applyMiddleware = _middleware.applyMiddleware;
exports.removeMiddleware = _middleware.removeMiddleware;