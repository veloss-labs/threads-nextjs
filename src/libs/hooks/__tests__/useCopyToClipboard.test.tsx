import { act, renderHook } from '@testing-library/react';
import { afterAll, describe, expect, test, vi } from 'vitest';

import { useCopyToClipboard } from '../useCopyToClipboard';

describe('useCopyToClipboard', () => {
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  const setupCopyToClipboardMock = () => {
    const writeText = vi.fn();
    const readText = vi.fn();

    const clipboard = { writeText, readText };
    const navigator = { clipboard };

    vi.stubGlobal('navigator', navigator);

    return {
      writeText,
      readText,
    };
  };

  const clearCopyToClipboardMock = () => {
    vi.unstubAllGlobals();
  };

  const COPY_TEXT = 'hello world';

  const ERROR = new Error();
  ERROR.name = 'WriteToClipboardError';
  ERROR.message = 'Clipboard API not supported';

  test('useCopyToClipboard 초기상태', () => {
    const { result } = renderHook(() => useCopyToClipboard());

    expect(result.current).toMatchObject({
      copiedText: undefined,
      copy: expect.any(Function),
      setCopiedText: expect.any(Function),
    });
  });

  test('"useCopyToClipboard"에서 copy 함수가 정상적으로 실행된 경우', async () => {
    setupCopyToClipboardMock();

    const { result } = renderHook(() => useCopyToClipboard());

    const spy = vi.spyOn(window.navigator.clipboard, 'writeText');

    await act(() => result.current.copy(COPY_TEXT));

    expect(spy).toHaveBeenCalledWith(COPY_TEXT);
    expect(result.current.copiedText).toBe(COPY_TEXT);
  });

  test('"useCopyToClipboard"에서 copy 함수에서 에러가 발생하는 경우', async () => {
    clearCopyToClipboardMock();

    const { result } = renderHook(() => useCopyToClipboard());

    await expect(async () => {
      await act(async () => {
        await result.current.copy(COPY_TEXT);
      });
    }).rejects.toThrow(ERROR);

    expect(result.current.copiedText).toBeUndefined();
  });

  test('"useCopyToClipboard"에서 copy 함수가 실행되면 onSuccess 콜백이 실행되는지 확인', async () => {
    setupCopyToClipboardMock();

    const onSuccess = vi.fn();

    const { result } = renderHook(() => useCopyToClipboard({ onSuccess }));

    await act(() => result.current.copy(COPY_TEXT));

    expect(onSuccess).toHaveBeenCalled();
  });

  test('"useCopyToClipboard"에서 copy 함수가 실행되면 onError 콜백이 실행되는지 확인', async () => {
    clearCopyToClipboardMock();

    const onError = vi.fn();

    const { result } = renderHook(() => useCopyToClipboard({ onError }));

    await expect(async () => {
      await act(async () => {
        await result.current.copy(COPY_TEXT);
      });
    }).rejects.toThrow(ERROR);

    expect(onError).toHaveBeenCalled();
  });
});
