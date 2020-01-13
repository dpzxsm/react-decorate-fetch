import { FetchError } from "./helper";

const middlewares = [];

/**
 * 添加中间件
 */
export function applyMiddleware(plugin) {
  // check middlewares
  Object.keys(plugin).forEach((key) => {
    if (typeof plugin[key] !== "function") {
      throw new FetchError("The Middleware's action must be function!");
    }
  });
  middlewares.push(plugin);
}

export function removeMiddleware(plugin) {
  let index = middlewares.indexOf(plugin);
  if (index !== -1) {
    middlewares.splice(index, 1);
  }
}

const defaultNext = function (context, next) {
  // do nothing
  next();
};

export function compose(action) {
  return function (context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);

    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middlewares[i] ? (middlewares[i][action] || defaultNext) : undefined;
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

export default middlewares;
