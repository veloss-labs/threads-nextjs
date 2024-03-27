import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useMemoizedFn } from '../useMemoizedFn';

describe('useMemoizedFn', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  test('useMemoizedFn 초기상태', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useMemoizedFn(callback));

    expect(result.current).toBeInstanceOf(Function);
  });

  test('useMemoizedFn 함수 실행', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useMemoizedFn(callback));

    act(() => {
      result.current();
    });

    expect(callback).toHaveBeenCalled();
  });

  test('useMemoizedFn 함수 실행 시 인자 전달', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useMemoizedFn(callback));

    act(() => {
      result.current(1, 2, 3);
    });

    expect(callback).toHaveBeenCalledWith(1, 2, 3);
  });

  test('useMemoizedFn 함수 실행 시 this 전달', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useMemoizedFn(callback));

    const thisArg = { a: 1 };

    act(() => {
      result.current.call(thisArg);
    });

    expect(callback.mock.instances[0]).toBe(thisArg);
  });
});
