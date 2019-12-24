import { useEffect } from 'react';
import useFetch from "./useFetch";

export default function useLazyFetch(options, deps) {
  let [state, callback] = useFetch(options, deps);
  useEffect(() => {
    callback();
  }, [callback]);
  return state;
}
