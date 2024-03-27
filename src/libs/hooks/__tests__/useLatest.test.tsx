import { describe, expect, test } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useLatest } from '../useLatest';

describe('useLatest', () => {
  const value = 1;
  test('useLatest 초기상태', () => {
    const { result } = renderHook(() => useLatest(value));

    expect(result.current.current).toBe(value);
  });

  test('useLatest의 current 값 변경', () => {
    const { result, rerender } = renderHook((props) => useLatest(props), {
      initialProps: value,
    });

    const newValue = 2;
    rerender(newValue);

    expect(result.current.current).toBe(newValue);
  });
});
