import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { omitChildren } from '../utils/helper';
import isPlainObject from "../utils/isPlainObject";
import shallowEqual from "../utils/shallowEqual";
import { mapRequestByOptions } from "../utils/mapRequest";

export default function (mapRequestToProps, defaults, options) {
  mapRequestToProps = mapRequestToProps || (() => ({}));
  if (isPlainObject(mapRequestToProps)) {
    let mapRequest = Object.assign({}, mapRequestToProps);
    mapRequestToProps = () => mapRequest;
  }
  options = Object.assign({ withRef: false }, options);
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
        Object.keys(mappings).forEach((key) => {
          let options = mappings[key];
          if (Function.prototype.isPrototypeOf(options)) {
            requests[key] = (params) => {
              let childMappings = options(params);
              let childRequests = Object.keys(childMappings).map(key => {
                let request = mapRequestByOptions(childMappings[key], defaults);
                return ({
                  key,
                  request
                });
              });
              this.initialResponsesState(childRequests);
              let finalResponses = {};
              return Promise.all(childRequests.map(item => {
                return item.request().then(response => {
                  finalResponses[item.key] = response;
                  return response;
                });
              })).then((results) => {
                this.setState((pre) => ({
                  responses: {
                    ...pre.responses, ...finalResponses
                  }
                }));
                if (results.length > 0) {
                  return results;
                } else {
                  return results[0];
                }
              });
            };
          } else {
            responses[key] = {
              status: 'pending',
              loading: false
            };
            lazyRequest.push({
              key,
              options,
              request: mapRequestByOptions(options, defaults)
            });
          }
        });
        return {
          lazyRequest,
          requests,
          responses
        };
      };

      initialResponsesState = (requests = []) => {
        if (requests.length === 0) return;
        this.setState((pre) => {
          let newResponses = {};
          requests.forEach((item) => {
            if (item.key) {
              newResponses[item.key] = {
                status: 'loading',
                loading: true
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

      componentDidUpdate(prevProps) {
        if (!shallowEqual(prevProps, this.props)) {
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
            finalResponses[item.key] = response;
          }).catch((error) => {
            finalResponses[item.key] = error;
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

        this._timers = lazyRequest.map(item => {
          let refreshInterval = item.options.refreshInterval || 0;
          if (refreshInterval && Number.isInteger(refreshInterval)) {
            return setInterval(() => {
              this.initialResponsesState([item]);
              item.request().then(response => {
                this.setState(pre => {
                  return {
                    responses: {
                      ...pre.responses,
                      [item.key]: response
                    }
                  };
                });
              });
            }, refreshInterval);
          } else {
            return null;
          }
        });
      }

      componentWillUnmount() {
        this._timers && this._timers.forEach(timer => clearInterval(timer));
      }

      render() {
        const ref = options.withRef ? 'wrappedInstance' : null;
        return <WrappedComponent
          {...this.state.responses}
          {...this.state.requests}
          {...this.props}
          ref={ref}
        />;
      }
    }

    return hoistStatics(ConnectComponent, WrappedComponent);
  };
}
