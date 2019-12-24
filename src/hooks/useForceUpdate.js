import { useReducer } from 'react';

export default function useForceUpdate() {
  const [_, forceUpdate] = useReducer(_ => _ + 1, 0);
  return () => forceUpdate(null);
}
