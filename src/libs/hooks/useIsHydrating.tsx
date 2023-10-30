import { useState } from 'react';
import { isBrowser } from '~/libs/browser/dom';

export default function useIsHydrating(queryString: string) {
  const [isHydrating] = useState(
    () => isBrowser && Boolean(document.querySelector(queryString)),
  );
  return isHydrating;
}
