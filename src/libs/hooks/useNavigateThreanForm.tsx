import { usePathname, useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import {
  type MetaData,
  InvalidationFunction,
  useLayoutStore,
} from '~/services/store/useLayoutStore';
import { useMemoizedFn } from '~/libs/hooks/useMemoizedFn';

type HrefOptions = {
  quotation?: any;
  invalidateFunctions?: InvalidationFunction;
  intialValue?: MetaData;
  redirectUrl?: string;
};

export default function useNavigateThreanForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { popupOpen } = useLayoutStore();

  const handleHref = (opts?: HrefOptions) => {
    const meta: MetaData = {
      quotation: undefined,
      invalidateFunctions: undefined,
      intialValue: undefined,
      redirectUrl: pathname,
    };

    if (opts?.invalidateFunctions) {
      meta.invalidateFunctions = opts.invalidateFunctions;
    }
    if (opts?.intialValue) {
      meta.intialValue = opts.intialValue;
    }
    if (opts?.quotation) {
      meta.quotation = opts.quotation;
    }
    if (opts?.redirectUrl) {
      meta.redirectUrl = opts.redirectUrl;
    }

    popupOpen('THREAD', meta);

    startTransition(() => {
      router.push(PAGE_ENDPOINTS.THREADS.ROOT);
    });
  };

  return {
    isPending,
    handleHref: useMemoizedFn(handleHref),
  };
}
