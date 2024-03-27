import { describe, expect, test } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useUpdate } from '../useUpdate';

describe('useUpdate', () => {
  test('useUpdate 초기상태', () => {
    const { result } = renderHook(() => useUpdate());

    expect(result.current).toBeInstanceOf(Function);
  });
});
