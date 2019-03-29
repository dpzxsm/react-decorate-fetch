import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { buildFetch, omitChildren } from './helper';
import isPlainObject from "../utils/isPlainObject";
import shallowEqual from "../utils/shallowEqual";

export default function (mapRequestToProps) {
  mapRequestToProps = mapRequestToProps || (() => ({}));
  if (isPlainObject(mapRequestToProps)) {
    mapRequestToProps = () => mapRequestToProps;
  }
  return function (WrappedComponent) {
    class ConnectComponent extends Component {
      constructor(props, context) {
        super(props, context);
        // 初始化request
        this.state = this.refactorMapRequestToState(mapRequestToProps(omitChildren(props)));
      }

      refactorMapRequestToState = (mappings) => {
        let lazyRequest = [];
        let requests = {};
        let responses = {};
        Object.keys(mappings).forEach((propName) => {
          // 初始化requests
          let mapRequest = mappings[propName];
          if (Function.prototype.isPrototypeOf(mapRequest)) {
            requests[propName] = (params) => {
              let { needState, childRequests } = this.buildRequestByFunctionCall(mapRequest(params));
              // 设置加载状态
              needState && this.initialResponsesState(childRequests);
              // 递归请求接口
              let finalResponses = {};
              return this.recursionRequest(childRequests, finalResponses).then((results) => {
                needState && this.setState((pre) => ({
                  responses: {
                    ...pre.responses, ...finalResponses
                  }
                }));
                if (results.length > 1) {
                  return results;
                } else {
                  return results[0];
                }
              }).catch((error) => {
                needState && this.setState((pre) => {
                  return {
                    responses: {
                      ...pre.responses,
                      ...finalResponses
                    }
                  };
                });
                throw error;
              });
            };
          } else {
            // 添加至懒加载队列
            lazyRequest.push(this.mapRequestByType(propName, mapRequest));
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
          lazyRequest,
          requests,
          responses
        };
      };

      // 递归调用获取Request，保证异步请求同步执行
      recursionRequest = (childRequests = [], finalResponses = {}, results = [], isFirst = true) => {
        return Promise.all(childRequests.map((item, index) => {
          return item.request().then(response => {
            if (item.propName) {
              finalResponses[item.propName] = response;
            }
            if (item.then) {
              let mixRequest = this.buildRequestByFunctionCall(item.then(response.result));
              return this.recursionRequest(mixRequest.childRequests, finalResponses, results, false).then((result) => {
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
          }).catch((error) => {
            if (item.propName) {
              finalResponses[item.propName] = error;
            }
            throw  error;
          });
        }));
      };

      //构建Request
      buildRequestByFunctionCall = (requestObj) => {
        let childRequests = [];
        let needState = false;
        if (typeof requestObj === 'string') {
          // 如果返回的是一个String，默认get请求，并且没有State
          childRequests.push(this.mapRequestByType(null, requestObj));
        } else if (isPlainObject(requestObj)) {
          // 如果返回的是一个Object的话，就认为是异步请求，需要把所有的子请求全部便利出来
          // 需要setState
          childRequests = Object.keys(requestObj).map((key) => {
            return this.mapRequestByType(key, requestObj[key]);
          });
          needState = true;
        } else if (Array.isArray(requestObj)) {
          // 如果返回的是一个数组的话，也认为是异步请求，需要把所有的子请求全部便利出来
          // 不需要setState
          childRequests = requestObj.map((item) => {
            return this.mapRequestByType(null, item);
          });
        }
        return {
          needState,
          childRequests
        };
      };

      initialResponsesState = (requests = []) => {
        if (requests.length === 0) return;
        this.setState((pre) => {
          let newResponses = {};
          requests.forEach((item) => {
            if (item.propName) {
              newResponses[item.propName] = {
                status: 'pending',
                loading: true,
                code: 0
              };
            }
          });
          return {
            responses: {
              ...pre.responses, ...newResponses
            }
          };
        });
      };

      mapRequestByType = (propName, mapRequest) => {
        if (typeof mapRequest === "string") {
          // default request
          return {
            propName,
            request: this.makeRequest({
              url: mapRequest,
              method: 'GET'
            })
          };
        } else if (isPlainObject(mapRequest)) {
          return {
            propName,
            then: mapRequest.then,
            request: this.makeRequest(mapRequest)
          };
        } else {
          return {
            propName: null,
            request: () => Promise.reject("Not Support the Request Type")
          };
        }
      };

      componentWillReceiveProps(nextProps) {
        if (!shallowEqual(nextProps, this.props)) {
          // 因为props发生了变化，所以更新requests
          let newState = this.refactorMapRequestToState(mapRequestToProps(omitChildren(nextProps)));
          this.setState({
            requests: newState.requests
          });
        }
      }


      componentDidMount() {
        let { lazyRequest, responses } = this.state;
        // 没有懒加载的话，就返回，防止不必要的渲染
        if (lazyRequest.length === 0) return;
        let finalResponses = Object.assign({}, responses);
        // 设置成功和失败
        Promise.all(lazyRequest.map(item => {
          return item.request().then((response) => {
            finalResponses[item.propName] = response;
          }).catch((error) => {
            finalResponses[item.propName] = error;
          });
        })).then(() => {
          this.setState({
            responses: finalResponses
          });
        }).catch(() => {
          this.setState({
            responses: finalResponses
          });
        });
      }

      makeRequest = (options = {}) => {
        return function () {
          let { url, method, headers, mapResult, then, andThen, ...others } = options;
          let promise = buildFetch(url, {
            method,
            headers,
            ...others
          });
          return promise.then((result) => {
            return {
              status: 'success',
              loading: false,
              code: 200,
              result: mapResult ? mapResult(result) : result
            };
          }).catch((error) => {
            throw {
              status: 'error',
              loading: false,
              code: error.code,
              message: error.message
            };
          });
        };
      };

      render() {
        return <WrappedComponent
          {...this.state.responses}
          {...this.state.requests}
          {...this.props}
        />;
      }
    }

    return hoistStatics(ConnectComponent, WrappedComponent);
  };
}