'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (mapRequestToProps) {
  mapRequestToProps = mapRequestToProps || function () {
    return {};
  };
  if ((0, _isPlainObject2.default)(mapRequestToProps)) {
    var mapRequest = Object.assign({}, mapRequestToProps);
    mapRequestToProps = function mapRequestToProps() {
      return mapRequest;
    };
  }
  return function (WrappedComponent) {
    var _class, _temp, _initialiseProps;

    var ConnectComponent = (_temp = _class = function (_Component) {
      _inherits(ConnectComponent, _Component);

      function ConnectComponent(props, context) {
        _classCallCheck(this, ConnectComponent);

        // 初始化request
        var _this = _possibleConstructorReturn(this, (ConnectComponent.__proto__ || Object.getPrototypeOf(ConnectComponent)).call(this, props, context));

        _initialiseProps.call(_this);

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
    }(_react.Component), _initialiseProps = function _initialiseProps() {
      var _this3 = this;

      this.refactorMapRequestToState = function (mappings) {
        var lazyRequest = [];
        var requests = {};
        var responses = {};
        Object.keys(mappings).forEach(function (propName) {
          // 初始化requests
          var mapRequest = mappings[propName];
          if (Function.prototype.isPrototypeOf(mapRequest)) {
            requests[propName] = function (params) {
              var _buildRequestByFuncti = _this3.buildRequestByFunctionCall(mapRequest(params)),
                  needState = _buildRequestByFuncti.needState,
                  childRequests = _buildRequestByFuncti.childRequests;
              // 设置加载状态


              needState && _this3.initialResponsesState(childRequests);
              // 递归请求接口
              var finalResponses = {};
              return _this3.recursionRequest(childRequests, finalResponses).then(function (results) {
                needState && _this3.setState(function (pre) {
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
                needState && _this3.setState(function (pre) {
                  return {
                    responses: _extends({}, pre.responses, finalResponses)
                  };
                });
                throw error;
              });
            };
          } else {
            // 添加至懒加载队列
            lazyRequest.push(_this3.mapRequestByType(propName, mapRequest, true));
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

      this.recursionRequest = function () {
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
              var mixRequest = _this3.buildRequestByFunctionCall(item.then(response.result));
              return _this3.recursionRequest(mixRequest.childRequests, finalResponses, results, false).then(function (result) {
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

      this.buildRequestByFunctionCall = function (requestObj) {
        var childRequests = [];
        var needState = false;
        if (typeof requestObj === 'string') {
          // 如果返回的是一个String，默认get请求，并且没有State
          childRequests.push(_this3.mapRequestByType(null, requestObj));
        } else if ((0, _isPlainObject2.default)(requestObj)) {
          // 如果返回的是一个Object的话，就认为是异步请求，需要把所有的子请求全部便利出来
          // 需要setState
          childRequests = Object.keys(requestObj).map(function (key) {
            return _this3.mapRequestByType(key, requestObj[key]);
          });
          needState = true;
        } else if (Array.isArray(requestObj)) {
          // 如果返回的是一个数组的话，也认为是异步请求，需要把所有的子请求全部便利出来
          // 不需要setState
          childRequests = requestObj.map(function (item) {
            return _this3.mapRequestByType(null, item);
          });
        }
        return {
          needState: needState,
          childRequests: childRequests
        };
      };

      this.initialResponsesState = function () {
        var requests = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        if (requests.length === 0) return;
        _this3.setState(function (pre) {
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

      this.mapRequestByType = function (propName, mapRequest) {
        var isLazy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (typeof mapRequest === "string") {
          // default request
          return {
            propName: propName,
            request: _this3.makeRequest({
              url: mapRequest,
              method: 'GET',
              isLazy: isLazy
            })
          };
        } else if ((0, _isPlainObject2.default)(mapRequest)) {
          return {
            propName: propName,
            then: mapRequest.then,
            request: _this3.makeRequest(_extends({}, mapRequest, {
              isLazy: isLazy
            }))
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

      this.makeRequest = function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return function () {
          var url = options.url,
              method = options.method,
              headers = options.headers,
              mapResult = options.mapResult,
              isLazy = options.isLazy,
              successText = options.successText,
              then = options.then,
              andThen = options.andThen,
              others = _objectWithoutProperties(options, ['url', 'method', 'headers', 'mapResult', 'isLazy', 'successText', 'then', 'andThen']);

          var context = [url, _extends({
            method: method,
            headers: headers,
            isLazy: isLazy
          }, others)];
          return new Promise(function (resolve, reject) {
            (0, _middleware.compose)('before')(context, function () {
              _helper.buildFetch.apply(undefined, context).then(function (result) {
                return {
                  status: 'success',
                  loading: false,
                  error: false,
                  success: true,
                  code: 200,
                  message: successText || '请求成功',
                  data: mapResult ? mapResult(result) : result
                };
              }).catch(function (error) {
                return {
                  status: 'error',
                  loading: false,
                  error: true,
                  success: false,
                  code: error.code || 0,
                  message: error.message,
                  isLazy: isLazy
                };
              }).then(function (data) {
                (0, _middleware.compose)('after')(data, function () {
                  if (data.error) {
                    reject(data);
                  } else {
                    resolve(data);
                  }
                });
              });
            });
          });
        };
      };
    }, _temp);


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

var _middleware = require('./middleware.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }