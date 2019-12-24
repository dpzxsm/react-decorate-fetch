'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _mapRequest = require('../utils/mapRequest');

var _useAsync = require('./useAsync');

var _useAsync2 = _interopRequireDefault(_useAsync);

var _useLazyFetch = require('./useLazyFetch');

var _useLazyFetch2 = _interopRequireDefault(_useLazyFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeLazyRequest = function makeLazyRequest(mappings) {
  var lazyRequest = [];
  Object.keys(mappings).forEach(function (propName) {
    var mapRequest = mappings[propName];
    if (Function.prototype.isPrototypeOf(mapRequest)) {} else {
      // 添加至懒加载队列
      lazyRequest.push((0, _mapRequest.mapRequestByType)(propName, mapRequest, true));
    }
  });
  return function () {
    return Promise.all(lazyRequest.map(function (item) {
      return item.request().then(function (response) {
        return {
          response: response,
          propName: item.propName
        };
      }).catch(function (error) {
        return {
          response: error,
          propName: item.propName
        };
      });
    }));
  };
};

var useDecorateFetch = function useDecorateFetch(mappings, deps) {
  return (0, _useLazyFetch2.default)(mappings, deps);
};

exports.default = useDecorateFetch;
//# sourceMappingURL=useDecorateFetch.js.map