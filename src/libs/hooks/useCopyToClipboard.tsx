'use client';
import { useState } from 'react';
import { useMemoizedFn } from './useMemoizedFn';

interface CopyToClipboardOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCopyToClipboard({
  onSuccess,
  onError,
}: CopyToClipboardOptions = {}) {
  const [copiedText, setCopiedText] = useState<string | undefined>(undefined);

  const copy = async (value: string) => {
    setCopiedText(value);

    try {
      if (!('clipboard' in navigator)) {
        const error = new Error();
        error.name = 'WriteToClipboardError';
        error.message = 'Clipboard API not supported';
        throw error;
      }

      await navigator.clipboard.writeText(value);
      if (onSuccess) {
        onSuccess();
      }
      setCopiedText(value);
    } catch (error) {
      setCopiedText(undefined);
      console.error('Failed to copy:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
      throw error;
    }
  };

  return {
    copiedText,
    copy: useMemoizedFn(copy),
    setCopiedText,
  };
}
