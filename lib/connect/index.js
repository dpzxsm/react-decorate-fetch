"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _react = _interopRequireWildcard(require("react"));

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

var _helper = require("../utils/helper");

var _isPlainObject = _interopRequireDefault(require("../utils/isPlainObject"));

var _shallowEqual = _interopRequireDefault(require("../utils/shallowEqual"));

var _mapRequest = require("../utils/mapRequest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _default(mapRequestToProps, defaults, options) {
  mapRequestToProps = mapRequestToProps || function () {
    return {};
  };

  if ((0, _isPlainObject["default"])(mapRequestToProps)) {
    var mapRequest = Object.assign({}, mapRequestToProps);

    mapRequestToProps = function mapRequestToProps() {
      return mapRequest;
    };
  }

  options = Object.assign({
    withRef: false
  }, options);
  return function (WrappedComponent) {
    var ConnectComponent =
    /*#__PURE__*/
    function (_Component) {
      _inherits(ConnectComponent, _Component);

      function ConnectComponent(props, context) {
        var _this;

        _classCallCheck(this, ConnectComponent);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(ConnectComponent).call(this, props, context)); // 初始化request

        _defineProperty(_assertThisInitialized(_this), "refactorMapRequestToState", function (mappings) {
          var lazyRequest = [];
          var requests = {};
          var responses = {};
          Object.keys(mappings).forEach(function (key) {
            var options = mappings[key];

            if (Function.prototype.isPrototypeOf(options)) {
              requests[key] = function (params) {
                var childMappings = options(params);
                var childRequests = Object.keys(childMappings).map(function (key) {
                  var request = (0, _mapRequest.mapRequestByOptions)(childMappings[key], defaults);
                  return {
                    key: key,
                    request: request
                  };
                });

                _this.initialResponsesState(childRequests);

                var finalResponses = {};
                return Promise.all(childRequests.map(function (item) {
                  return item.request().promise.then(function (response) {
                    finalResponses[item.key] = response;
                    return response;
                  });
                })).then(function (results) {
                  _this.setState(function (pre) {
                    return {
                      responses: _objectSpread({}, pre.responses, {}, finalResponses)
                    };
                  });

                  results.forEach(function (item) {
                    if (item.error) {
                      throw new _helper.FetchError(item);
                    }
                  });

                  if (results.length > 1) {
                    return results.map(function (item) {
                      return item.value;
                    });
                  } else if (results.length === 1) {
                    return results[0].value;
                  } else {
                    return null;
                  }
                });
              };
            } else {
              responses[key] = {
                status: 'pending',
                loading: false
              };
              lazyRequest.push({
                key: key,
                options: options,
                request: (0, _mapRequest.mapRequestByOptions)(options, defaults)
              });
            }
          });
          return {
            lazyRequest: lazyRequest,
            requests: requests,
            responses: responses
          };
        });

        _defineProperty(_assertThisInitialized(_this), "initialResponsesState", function () {
          var requests = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          if (requests.length === 0) return;

          _this.setState(function (pre) {
            var newResponses = {};
            requests.forEach(function (item) {
              if (item.key) {
                newResponses[item.key] = {
                  status: 'loading',
                  loading: true
                };
              }
            });
            return {
              responses: _objectSpread({}, pre.responses, {}, newResponses)
            };
          });
        });

        _this.state = _this.refactorMapRequestToState(mapRequestToProps((0, _helper.omitChildren)(props)));
        return _this;
      }

      _createClass(ConnectComponent, [{
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
          if (!(0, _shallowEqual["default"])(prevProps, this.props)) {
            // 因为props发生了变化，所以更新requests
            var newState = this.refactorMapRequestToState(mapRequestToProps((0, _helper.omitChildren)(nextProps)));
            this.setState({
              requests: newState.requests
            });
          }
        }
      }, {
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this2 = this;

          var _this$state = this.state,
              lazyRequest = _this$state.lazyRequest,
              responses = _this$state.responses; // 没有懒加载的话，就返回，防止不必要的渲染

          if (lazyRequest.length === 0) return;
          var finalResponses = Object.assign({}, responses); // 设置成功和失败

          Promise.all(lazyRequest.map(function (item) {
            return item.request().promise.then(function (response) {
              finalResponses[item.key] = response;
            })["catch"](function (error) {
              finalResponses[item.key] = error;
            });
          })).then(function () {
            _this2.setState({
              responses: finalResponses
            });
          })["catch"](function () {
            _this2.setState({
              responses: finalResponses
            });
          });
          this._timers = lazyRequest.map(function (item) {
            var refreshInterval = item.options.refreshInterval || 0;

            if (refreshInterval && Number.isInteger(refreshInterval)) {
              return setInterval(function () {
                _this2.initialResponsesState([item]);

                item.request().promise.then(function (response) {
                  _this2.setState(function (pre) {
                    return {
                      responses: _objectSpread({}, pre.responses, _defineProperty({}, item.key, response))
                    };
                  });
                });
              }, refreshInterval);
            } else {
              return null;
            }
          });
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this._timers && this._timers.forEach(function (timer) {
            return clearInterval(timer);
          });
        }
      }, {
        key: "render",
        value: function render() {
          var ref = options.withRef ? 'wrappedInstance' : null;
          return _react["default"].createElement(WrappedComponent, _extends({}, this.state.responses, this.state.requests, this.props, {
            ref: ref
          }));
        }
      }]);

      return ConnectComponent;
    }(_react.Component);

    return (0, _hoistNonReactStatics["default"])(ConnectComponent, WrappedComponent);
  };
}
//# sourceMappingURL=index.js.map