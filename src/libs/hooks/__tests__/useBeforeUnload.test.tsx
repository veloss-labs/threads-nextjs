import { renderHook } from '@testing-library/react';
import { afterAll, describe, expect, test, vi } from 'vitest';

import { useBeforeUnload } from '../useBeforeUnload';

describe('useBeforeUnload', () => {
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  test('useBeforeUnload 초기상태', () => {
    const callback = vi.fn();

    const { result } = renderHook(() => {
      useBeforeUnload(callback);
    });

    expect(result.current).toBeUndefined();
  });

  test('"useBeforeUnload"에서 window.beforeunload가 정상적으로 실행되는지 테스트', () => {
    const callback = vi.fn();

    renderHook(() => {
      useBeforeUnload(callback);
    });

    expect(callback).not.toHaveBeenCalled();

    // window.beforeunload 이벤트를 발생시키면
    window.dispatchEvent(new Event('beforeunload'));

    // callback이 실행되어야 한다.
    expect(callback).toHaveBeenCalled();
  });

  test('"useBeforeUnload"에서 window.beforeunload가 등록되고 unmount시 정상적으로 cleanup 되는지 테스트', () => {
    const callback = vi.fn();

    const { unmount } = renderHook(() => {
      useBeforeUnload(callback);
    });

    expect(callback).not.toHaveBeenCalled();

    // window.beforeunload 이벤트를 발생시키면
    window.dispatchEvent(new Event('beforeunload'));

    // callback이 실행되어야 한다.
    expect(callback).toHaveBeenCalled();

    // cleanup
    unmount();

    // window.beforeunload 이벤트를 발생시켜도 callback이 실행되지 않아야 한다.
    window.dispatchEvent(new Event('beforeunload'));

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
