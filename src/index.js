import connect from './connect';
import { initConfig, buildFetch, bindDomClick } from './utils/helper';
import { applyMiddleware, removeMiddleware } from './utils/middleware';
import useFetch from './hooks/useFetch';
import useLazyFetch from './hooks/useLazyFetch';
import useLazyFetches from './hooks/useLazyFetches';

export {
  connect,
  useFetch,
  useLazyFetch,
  useLazyFetches,
  buildFetch,
  bindDomClick,
  initConfig,
  applyMiddleware,
  removeMiddleware
};
