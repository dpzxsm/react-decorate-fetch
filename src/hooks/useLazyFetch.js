import { useEffect } from 'react';
import useFetch from "./useFetch";

export default function useLazyFetch(options, deps) {
  let [state, callback] = useFetch(options, deps);
  let refreshInterval = options.refreshInterval || 0;
  useEffect(() => {
    if (refreshInterval) {
      let timer = setInterval(callback, refreshInterval);
      return () => clearInterval(timer);
    } else {
      callback().then((err) => {
        //do nothing
      });
    }
  }, [callback]);
  return state;
}
