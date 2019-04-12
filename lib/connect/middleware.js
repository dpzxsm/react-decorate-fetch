"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyMiddleware = applyMiddleware;
exports.removeMiddleware = removeMiddleware;
exports.compose = compose;
var middlewares = [];

/**
 * 添加中间件
 */
function applyMiddleware(plugin) {
  // check middlewares
  Object.keys(plugin).forEach(function (key) {
    if (typeof plugin[key] !== "function") {
      throw new Error("The Middleware's action must be function!");
    }
  });
  middlewares.push(plugin);
}

function removeMiddleware(plugin) {
  var index = middlewares.indexOf(plugin);
  if (index !== -1) {
    middlewares.splice(index, 1);
  }
}

var defaultNext = function defaultNext(context, next) {
  // do nothing
  next();
};

function compose(action) {
  return function (context, next) {
    // last called middleware #
    var index = -1;
    return dispatch(0);

    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      var fn = middlewares[i] ? middlewares[i][action] || defaultNext : undefined;
      if (i === middlewares.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

exports.default = middlewares;