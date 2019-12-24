import { useCallback, useRef } from 'react';
import useMountedState from './useMountedState';

export default function useRequest(fn, deps = [], initialState = {
  status: 'pending',
  loading: false
}) {
  const lastCallId = useRef(0);
  const state = useRef(initialState);
  const isMounted = useMountedState();

  const callback = useCallback(() => {
    const callId = ++lastCallId.current;

    state.current = {
      status: 'loading',
      loading: true
    };

    return fn().then(
      value => {
        if (isMounted() && callId === lastCallId.current) {
          state.current = value;
        }
        return value;
      },
      error => {
        if (isMounted() && callId === lastCallId.current) {
          state.current = error;
        }
        return error;
      }
    );
  }, deps);

  return [state.current, callback];
}
