import connect from './connect';
import { initConfig, buildFetch } from './utils/helper';
import { applyMiddleware, removeMiddleware } from './utils/middleware';
import useFetch from './hooks/useFetch';
import useLazyFetch from './hooks/useLazyFetch';

export {
  connect,
  useFetch,
  useLazyFetch,
  buildFetch,
  initConfig,
  applyMiddleware,
  removeMiddleware
};
