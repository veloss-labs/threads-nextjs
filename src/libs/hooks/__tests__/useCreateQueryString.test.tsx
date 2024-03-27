import { describe, expect, test, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCustomSearchParams } from '../useCustomSearchParams';

describe('useCustomSearchParams', () => {
  test('useCustomSearchParams 초기상태', () => {
    const { result } = renderHook(() => useCustomSearchParams());

    expect(result.current).toMatchObject({
      createQueryString: expect.any(Function),
    });
  });

  test('"useCustomSearchParams"에서 createQueryString 함수에서 flag가 "add"인 경우', () => {
    const { result } = renderHook(() => useCustomSearchParams());

    const { createQueryString } = result.current;

    const initParams = new URLSearchParams('tab=threads');

    const path = createQueryString(initParams, 'tab', 'comments', 'add');

    expect(path).toBe('tab=threads&tab=comments');
  });

  test('"useCustomSearchParams"에서 createQueryString 함수에서 flag가 "set"인 경우', () => {
    const { result } = renderHook(() => useCustomSearchParams());

    const { createQueryString } = result.current;

    const initParams = new URLSearchParams('tab=threads');

    const path = createQueryString(initParams, 'tab', 'comments', 'set');

    console.log(path);

    expect(path).toBe('tab=comments');
  });

  test('"useCustomSearchParams"에서 deleteQueryString 함수를 사용하는 경우', () => {
    const { result } = renderHook(() => useCustomSearchParams());

    const { deleteQueryString } = result.current;

    const initParams = new URLSearchParams('tab=threads');

    const path = deleteQueryString(initParams, 'tab');

    expect(path).toBe('');
  });
});
