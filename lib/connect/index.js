'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
  var mapRequestToProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
    return {};
  };

  return function (WrappedComponent) {
    var ConnectComponent = function (_Component) {
      _inherits(ConnectComponent, _Component);

      function ConnectComponent(props, context) {
        _classCallCheck(this, ConnectComponent);

        // 初始化request
        var _this = _possibleConstructorReturn(this, (ConnectComponent.__proto__ || Object.getPrototypeOf(ConnectComponent)).call(this, props, context));

        _this.refactorMapRequestToState = function (mappings) {
          var lazyRequest = [];
          var requests = {};
          var responses = {};
          Object.keys(mappings).forEach(function (propName) {
            // 初始化requests
            var mapRequest = mappings[propName];
            if (Function.prototype.isPrototypeOf(mapRequest)) {
              requests[propName] = function (params) {
                var _this$buildRequestByF = _this.buildRequestByFunctionCall(mapRequest(params)),
                    needState = _this$buildRequestByF.needState,
                    childRequests = _this$buildRequestByF.childRequests;
                // 设置加载状态


                needState && _this.initialResponsesState(childRequests);
                // 递归请求接口
                var finalResponses = {};
                return _this.recursionRequest(childRequests, finalResponses).then(function (results) {
                  needState && _this.setState(function (pre) {
                    return {
                      responses: _extends({}, pre.responses, finalResponses)
                    };
                  });
                  if (results.length > 1) {
                    return results;
                  } else {
                    return results[0];
                  }
                }).catch(function (error) {
                  needState && _this.setState(function (pre) {
                    return {
                      responses: _extends({}, pre.responses, finalResponses)
                    };
                  });
                  throw error;
                });
              };
            } else {
              // 添加至懒加载队列
              lazyRequest.push(_this.mapRequestByType(propName, mapRequest));
              // 初始化responses
              responses[propName] = {
                status: 'pending',
                loading: true,
                code: 0
              };
            }
          });
          // 初始状态
          return {
            lazyRequest: lazyRequest,
            requests: requests,
            responses: responses
          };
        };

        _this.recursionRequest = function () {
          var childRequests = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          var finalResponses = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var results = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
          var isFirst = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

          return Promise.all(childRequests.map(function (item, index) {
            return item.request().then(function (response) {
              if (item.propName) {
                finalResponses[item.propName] = response;
              }
              if (item.then) {
                var mixRequest = _this.buildRequestByFunctionCall(item.then(response.result));
                return _this.recursionRequest(mixRequest.childRequests, finalResponses, results, false).then(function (result) {
                  if (result.length > 1) {
                    results[index] = result;
                    return result;
                  } else {
                    results[index] = result[0];
                    return result[0];
                  }
                });
              }
              if (isFirst) {
                results[index] = response.result || {};
              }
              return response.result || {};
            }).catch(function (error) {
              if (item.propName) {
                finalResponses[item.propName] = error;
              }
              throw error;
            });
          }));
        };

        _this.buildRequestByFunctionCall = function (requestObj) {
          var childRequests = [];
          var needState = false;
          if (typeof requestObj === 'string') {
            // 如果返回的是一个String，默认get请求，并且没有State
            childRequests.push(_this.mapRequestByType(null, requestObj));
          } else if ((0, _isPlainObject2.default)(requestObj)) {
            // 如果返回的是一个Object的话，就认为是异步请求，需要把所有的子请求全部便利出来
            // 需要setState
            childRequests = Object.keys(requestObj).map(function (key) {
              return _this.mapRequestByType(key, requestObj[key]);
            });
            needState = true;
          } else if (Array.isArray(requestObj)) {
            // 如果返回的是一个数组的话，也认为是异步请求，需要把所有的子请求全部便利出来
            // 不需要setState
            childRequests = requestObj.map(function (item) {
              return _this.mapRequestByType(null, item);
            });
          }
          return {
            needState: needState,
            childRequests: childRequests
          };
        };

        _this.initialResponsesState = function () {
          var requests = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

          if (requests.length === 0) return;
          _this.setState(function (pre) {
            var newResponses = {};
            requests.forEach(function (item) {
              if (item.propName) {
                newResponses[item.propName] = {
                  status: 'pending',
                  loading: true,
                  code: 0
                };
              }
            });
            return {
              responses: _extends({}, pre.responses, newResponses)
            };
          });
        };

        _this.mapRequestByType = function (propName, mapRequest) {
          if (typeof mapRequest === "string") {
            // default request
            return {
              propName: propName,
              request: _this.makeRequest({
                url: mapRequest,
                method: 'GET'
              })
            };
          } else if ((0, _isPlainObject2.default)(mapRequest)) {
            return {
              propName: propName,
              then: mapRequest.then,
              request: _this.makeRequest(mapRequest)
            };
          } else {
            return {
              propName: null,
              request: function request() {
                return Promise.reject("Not Support the Request Type");
              }
            };
          }
        };

        _this.makeRequest = function () {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          return function () {
            var url = options.url,
                method = options.method,
                headers = options.headers,
                mapResult = options.mapResult,
                then = options.then,
                andThen = options.andThen,
                others = _objectWithoutProperties(options, ['url', 'method', 'headers', 'mapResult', 'then', 'andThen']);

            var promise = (0, _helper.buildFetch)(url, _extends({
              method: method,
              headers: headers
            }, others));
            return promise.then(function (result) {
              return {
                status: 'success',
                loading: false,
                code: 200,
                result: mapResult ? mapResult(result) : result
              };
            }).catch(function (error) {
              throw {
                status: 'error',
                loading: false,
                code: error.code,
                message: error.message
              };
            });
          };
        };

        _this.state = _this.refactorMapRequestToState(mapRequestToProps((0, _helper.omitChildren)(props)));
        return _this;
      }

      // 递归调用获取Request，保证异步请求同步执行


      //构建Request


      _createClass(ConnectComponent, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          if (!(0, _shallowEqual2.default)(nextProps, this.props)) {
            // 因为props发生了变化，所以更新requests
            var newState = this.refactorMapRequestToState(mapRequestToProps((0, _helper.omitChildren)(nextProps)));
            this.setState({
              requests: newState.requests
            });
          }
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          var _state = this.state,
              lazyRequest = _state.lazyRequest,
              responses = _state.responses;
          // 没有懒加载的话，就返回，防止不必要的渲染

          if (lazyRequest.length === 0) return;
          var finalResponses = Object.assign({}, responses);
          // 设置成功和失败
          Promise.all(lazyRequest.map(function (item) {
            return item.request().then(function (response) {
              finalResponses[item.propName] = response;
            }).catch(function (error) {
              finalResponses[item.propName] = error;
            });
          })).then(function () {
            _this2.setState({
              responses: finalResponses
            });
          }).catch(function () {
            _this2.setState({
              responses: finalResponses
            });
          });
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, _extends({}, this.state.responses, this.state.requests, this.props));
        }
      }]);

      return ConnectComponent;
    }(_react.Component);

    return (0, _hoistNonReactStatics2.default)(ConnectComponent, WrappedComponent);
  };
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _helper = require('./helper');

var _isPlainObject = require('../utils/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _shallowEqual = require('../utils/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }