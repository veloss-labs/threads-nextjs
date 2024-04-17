import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { useUnmount } from '../useUnmount';

describe('useUnmount', () => {
  test('useUnmount 초기상태', () => {
    const callback = vi.fn();

    const { result } = renderHook(() => {
      useUnmount(callback);
    });

    expect(result.current).toBeUndefined();
  });

  test('"useUnmount"에서 컴포넌트가 unmount되었을 때 callback이 정상적으로 실행되는지 테스트', () => {
    const callback = vi.fn();

    const { unmount } = renderHook(() => {
      useUnmount(callback);
    });

    expect(callback).not.toHaveBeenCalled();

    // 컴포넌트가 unmount되었을 때
    unmount();

    // callback이 실행되어야 한다.
    expect(callback).toHaveBeenCalled();
  });
});
