import { useMemoizedFn } from './useMemoizedFn';

export function useCustomSearchParams() {
  const createQueryString = (
    searchParams: URLSearchParams,
    name: string,
    value: string,
    flag: 'add' | 'set',
  ) => {
    const params = new URLSearchParams(searchParams);
    if (flag === 'set') params.set(name, value);
    if (flag === 'add') params.append(name, value);

    return params.toString();
  };

  const deleteQueryString = (searchParams: URLSearchParams, name: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(name);

    return params.toString();
  };

  return {
    createQueryString: useMemoizedFn(createQueryString),
    deleteQueryString: useMemoizedFn(deleteQueryString),
  };
}
