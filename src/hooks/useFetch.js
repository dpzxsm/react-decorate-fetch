import { useCallback } from 'react';
import { mapRequestByOptions } from "../utils/mapRequest";
import useRequest from "./useRequest";
import useForceUpdate from "./useForceUpdate";

export default function useFetch(options, deps = [], isForceUpdate = true) {
  let request = mapRequestByOptions(options);
  const forceUpdate = useForceUpdate();
  let [state, callback] = useRequest(request, deps);
  let newCallback = useCallback((...args) => {
    let promise = callback(...args);
    isForceUpdate && forceUpdate();
    return promise.then((data) => {
      isForceUpdate && forceUpdate();
      return data;
    }).catch((error) => {
      isForceUpdate && forceUpdate();
      throw error;
    });
  }, [callback]);
  return [state, newCallback];
}
