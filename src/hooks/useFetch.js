import { useCallback } from 'react';
import { mapRequestByOptions } from "../utils/mapRequest";
import useRequest from "./useRequest";
import useForceUpdate from "./useForceUpdate";

export default function useFetch(options, deps = [], isForceUpdate = true) {
  let request = mapRequestByOptions(options);
  const forceUpdate = useForceUpdate();
  let [state, callback] = useRequest(request, deps);
  let newCallback = useCallback(() => {
    if (state.loading) {
      return Promise.resolve(false);
    }
    isForceUpdate && forceUpdate();
    return callback().then((data) => {
      isForceUpdate && forceUpdate();
      return data;
    });
  }, [callback]);
  return [state, newCallback];
}
