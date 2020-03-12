import { useCallback, useRef } from 'react';
import useMountedState from './useMountedState';
import { FetchError } from '../utils/helper';

export default function useRequest(fn, deps = [], initialState) {
  const lastCallId = useRef(0);
  const state = useRef(initialState);
  const isMounted = useMountedState();

  const callback = useCallback((...args) => {
    const callId = ++lastCallId.current;
    let promise = fn(...args);
    state.current = {
      status: 'loading',
      loading: true,
      cancel: promise.cancel
    };
    return promise.then(
      value => {
        if (isMounted() && callId === lastCallId.current) {
          state.current = value;
        }
        return value.value;
      },
      error => {
        if (isMounted() && callId === lastCallId.current) {
          state.current = error;
        }
        throw new FetchError(error);
      }
    );
  }, deps);

  return [state.current, callback];
}
