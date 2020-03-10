import { useCallback } from 'react';
import { mapRequestByOptions } from '../utils/mapRequest';
import useRequest from './useRequest';
import useForceUpdate from './useForceUpdate';

export default function useFetch(options, deps = [], lazy) {
  let request = mapRequestByOptions(options);
  const forceUpdate = useForceUpdate();
  let [state, callback] = useRequest(request, deps, lazy ? {
    status: 'loading',
    loading: true
  } : undefined);
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
