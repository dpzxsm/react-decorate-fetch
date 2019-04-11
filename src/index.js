import connect from './connect';
import { initConfig, buildFetch, bindDomClick } from './connect/helper';
import { applyMiddleware, removeMiddleware } from './connect/middleware.js';

export {
  connect,
  buildFetch,
  bindDomClick,
  initConfig,
  applyMiddleware,
  removeMiddleware
};