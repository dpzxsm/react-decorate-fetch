import { useEffect, useRef } from 'react';
import useFetch from "./useFetch";
import useForceUpdate from "./useForceUpdate";

export default function useLazyFetches(options, deps) {
  let state = useRef([]);
  const forceUpdate = useForceUpdate();
  let fetches = options.map((item, index) => {
    let [state, callback] = useFetch(item, deps, false);
    return {
      state,
      callback
    };
  });
  state.current = [...fetches.map(item => item.state)];
  useEffect(() => {
    forceUpdate();
    Promise.all(fetches.map(item => item.callback())).then(() => {
      forceUpdate();
    });
  }, []);

  return state.current;
}
