import { useCallback } from 'react';
import { mapRequestByOptions } from '../utils/mapRequest';
import useRequest from './useRequest';
import useForceUpdate from './useForceUpdate';

const LazyInitialState = {
  status: 'loading',
  loading: true,
  cancel: function () {}
};
const DefaultInitialState = {
  status: 'pending',
  loading: false,
  cancel: function () {}
};

export default function useFetch(options, deps = [], lazy) {
  let request = mapRequestByOptions(options);
  const forceUpdate = useForceUpdate();
  let [state, callback] = useRequest(request, deps, lazy ? LazyInitialState : DefaultInitialState);
  let newCallback = useCallback((...args) => {
    let promise = callback(...args);
    !lazy && forceUpdate();
    return promise.then((data) => {
      forceUpdate();
      return data;
    }).catch((error) => {
      forceUpdate();
      throw error;
    });
  }, [callback]);
  return [state, newCallback];
}
