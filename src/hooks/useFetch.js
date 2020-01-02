import { useCallback } from 'react';
import { mapRequestByOptions } from "../utils/mapRequest";
import useRequest from "./useRequest";
import useForceUpdate from "./useForceUpdate";

export default function useFetch(options, deps = [], isForceUpdate = true) {
  let { refreshInterval, ...otherOptions } = options;
  let request = mapRequestByOptions(otherOptions);
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
  useEffect(() => {
    if (refreshInterval && Number.isInteger(refreshInterval)) {
      let timer = setInterval(() => {
        newCallback();
      }, refreshInterval);
      return () => clearInterval(timer);
    }
  }, [callback]);
  return [state, newCallback];
}
