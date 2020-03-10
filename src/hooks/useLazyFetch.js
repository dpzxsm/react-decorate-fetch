import { useEffect } from 'react';
import useFetch from './useFetch';

export default function useLazyFetch(options, deps) {
  let [state, callback] = useFetch(options, deps, true);
  let refreshInterval = options.refreshInterval || 0;
  useEffect(() => {
    callback().then((err) => {
      //do nothing
    });
    if (refreshInterval) {
      let timer = setInterval(callback, refreshInterval);
      return () => clearInterval(timer);
    }
  }, [callback]);
  return state;
}
