import { useMemo, useRef } from 'react';

type Noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends Noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

export function useMemoizedFn<T extends Noop>(fn: T) {
  const fnRef = useRef<T>(fn);

  fnRef.current = useMemo(() => fn, [fn]);

  const memoizedFn = useRef<PickFunction<T>>();
  if (!memoizedFn.current) {
    memoizedFn.current = function memoized(this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current;
}
