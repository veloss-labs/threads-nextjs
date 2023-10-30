import React from 'react';
/**
 * Setup a callback to be fired on the window's `beforeunload` event. This is
 * useful for saving some data to `window.localStorage` just before the page
 * refreshes.
 *
 * Note: The `callback` argument should be a function created with
 * `React.useCallback()`.
 */
export default function useBeforeUnload(
  callback: (event: BeforeUnloadEvent) => any,
  options?: { capture?: boolean },
): void {
  let { capture } = options || {};
  React.useEffect(() => {
    let opts = capture != null ? { capture } : undefined;
    window.addEventListener('beforeunload', callback, opts);
    return () => {
      window.removeEventListener('beforeunload', callback, opts);
    };
  }, [callback, capture]);
}
