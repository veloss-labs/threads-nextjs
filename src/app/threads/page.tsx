'use client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useTransition } from 'react';
import ThreadsForm from '~/components/write/threads-form';
import ThreadsTitle from '~/components/write/threads-title';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { useLayoutStore } from '~/services/store/useLayoutStore';

export default function Page() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const { popupClose } = useLayoutStore();

  const onSuccess = useCallback(() => {
    popupClose();
    startTransition(() => {
      router.replace(PAGE_ENDPOINTS.ROOT);
    });
  }, [router, popupClose]);

  return (
    <div className="container max-w-3xl space-y-6 px-4 py-6 lg:py-10">
      <ThreadsTitle />
      <ThreadsForm onSuccess={onSuccess} />
    </div>
  );
}
