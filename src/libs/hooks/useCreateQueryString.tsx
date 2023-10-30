import { useSearchParams } from 'next/navigation';
import { useMemoizedFn } from './useMemoizedFn';

export function useCreateQueryString() {
  const searchParams = useSearchParams();

  const createQueryString = (
    name: string,
    value: string,
    flag: 'remove' | 'add',
  ) => {
    const params = new URLSearchParams(searchParams);
    if (flag === 'remove') params.delete(name);
    if (flag === 'add') params.set(name, value);

    return params.toString();
  };

  return {
    createQueryString: useMemoizedFn(createQueryString),
  };
}
